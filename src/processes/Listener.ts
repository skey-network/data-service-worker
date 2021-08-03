import { BlockchainClient } from '../Clients/BlockchainClient'
import { Config } from '../Config'
import { GrpcClient } from '../Clients/GrpcClient'
import Queue from 'bull'
import { parseUpdate } from '../UpdateParser'
import { IProcess, JobData, SubscribeEvent } from '../Types'
import { getClasses } from '../HandlerManager'
import { Logger } from '../Logger'

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

  get logger() {
    return new Logger(Listener.name, this.config.app.logs)
  }

  async init(height?: number) {
    const currentHeight = await this.blockchain.fetchHeight()

    if (!currentHeight) {
      throw new Error('Cannot fetch currentHeight')
    }

    const promise = this.blockchain.subscribe(
      this.handleChunk.bind(this),
      height ?? currentHeight
    )

    this.cancelListener = promise.cancel

    promise.catch(() => process.exit(10))
  }

  async destroy() {
    await this.cancelListener()
    await this.queue.close()
  }

  async handleChunk(chunk: SubscribeEvent) {
    const update = parseUpdate(chunk)

    if (!update) {
      this.logger.debug('No updates on height', chunk.update?.height)
      return
    }

    for (const { name } of getClasses()) {
      await this.queue.add({ update, handler: name })
    }
  }
}
