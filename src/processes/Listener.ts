import { BlockchainClient } from '../Clients/BlockchainClient'
import { Config } from '../Config'
import { GrpcClient } from '../Clients/GrpcClient'
import Queue from 'bull'
import { parseUpdate } from '../UpdateParser'
import { IProcess, JobData, SubscribeEvent } from '../Types'
import { getClasses } from '../HandlerManager'
import { Logger } from '../Logger'
import { MetaClient } from '../Clients/MetaClient'
import { DatabaseClient } from '../Clients/DatabaseClient'

export class Listener implements IProcess {
  config: Config
  blockchain: BlockchainClient
  db: DatabaseClient
  grpc: GrpcClient
  queue: Queue.Queue<JobData>
  meta: MetaClient
  cancelListener: () => Promise<void>

  constructor(config: Config) {
    this.config = config
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc)
    this.db = new DatabaseClient(this.config)

    const { host, port, queue } = this.config.redis
    this.queue = new Queue(queue, { redis: { host, port } })
  }

  get logger() {
    return new Logger(Listener.name, this.config.app.logs)
  }

  async init() {
    await this.db.connect()
    this.meta = new MetaClient(this.config, this.db)

    const lastHeight = await this.meta.getHeight()
    if (!lastHeight) await this.meta.setHeight(1)

    const promise = this.blockchain.subscribe(
      this.handleChunk.bind(this),
      lastHeight ?? 1
    )

    this.cancelListener = promise.cancel

    promise.catch(() => process.exit(10))
  }

  async destroy() {
    await this.db.disconnect()
    await this.cancelListener()
    await this.queue.close()
  }

  async handleChunk(chunk: SubscribeEvent) {
    const height = chunk.update?.height
    if (!height) throw new Error(`height = ${height}`)

    const stable = height === 1 ? 1 : height - 1
    const success = await this.meta.setHeight(stable)

    if (!success) return

    this.logger.debug('New stable height', stable)

    const update = parseUpdate(chunk)

    if (!update) {
      return this.logger.debug('No updates at height', chunk.update?.height)
    }

    for (const { name } of getClasses()) {
      await this.queue.add({ update, handler: name })
    }
  }
}
