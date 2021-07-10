import { BlockchainClient } from '../Clients/BlockchainClient'
import { Config } from '../Config'
import { GrpcClient } from '../Clients/GrpcClient'
import Queue from 'bull'
import { parseUpdate } from '../UpdateParser'
import { IProcess, JobData, SubscribeEvent } from '../Types'
import { getClasses } from '../HandlerManager'

export class Listener implements IProcess {
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

  async init(height?: number) {
    const currentHeight = await this.blockchain.fetchHeight()
    if (!currentHeight) return console.error('Cannot fetch currentHeight')

    this.cancelListener = this.blockchain.subscribe(
      this.handleChunk.bind(this),
      height ?? currentHeight
    ).cancel
  }

  async destroy() {
    await this.cancelListener()
    await this.queue.close()
  }

  async handleChunk(chunk: SubscribeEvent) {
    const update = parseUpdate(chunk)
    if (!update) return

    for (const { name } of getClasses()) {
      await this.queue.add({ update, handler: name })
    }
  }
}
