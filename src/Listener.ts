import { BlockchainClient } from './BlockchainClient'
import { Config } from './Config'
import { GrpcClient } from './GrpcClient'
import Queue from 'bull'
import { ParsedUpdate, UpdateParser } from './UpdateParser'
import { SubscribeEvent } from './Types'
import { DeviceHandler } from './TxHandlers/DeviceHandler'
import { writeFileSync } from 'fs'

export interface JobData {
  handler: string
  update: any
}

export class Listener {
  config: Config
  blockchain: BlockchainClient
  grpc: GrpcClient
  queue: Queue.Queue<JobData>
  cancelListener: () => Promise<void>

  constructor(config: Config) {
    this.config = config
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc)

    const { host, port, queue } = this.config.redis
    this.queue = new Queue(queue, { redis: { host, port } })
  }

  async startListener() {
    const height = await this.blockchain.fetchHeight()
    if (!height) return console.error('Cannot fetch height')

    this.cancelListener = this.blockchain.subscribe(
      this.handleChunk.bind(this),
      height
    ).cancel
  }

  async stopListener() {
    return await this.cancelListener()
  }

  async destroy() {
    await this.stopListener()
    await this.queue.close()
  }

  // TODO
  async handleChunk(chunk: SubscribeEvent) {
    writeFileSync(
      `./height_${chunk.update?.height ?? 0}_${Date.now()}`,
      JSON.stringify(chunk)
    )

    const parser = new UpdateParser(chunk)
    const update = parser.parse(chunk)
    if (!update) return

    writeFileSync(
      `./parsed_${chunk.update?.height ?? 0}_${Date.now()}`,
      JSON.stringify(update)
    )

    await this.queue.add({ update, handler: DeviceHandler.name })
  }
}
