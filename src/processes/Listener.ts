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
  promise: Promise<void>

  constructor(config: Config) {
    this.config = config
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc, this.config)
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

    // Current height of blockchain
    const currentHeight = await this.blockchain.fetchHeight()
    if (!currentHeight) throw new Error('Cannot fetch current blockchain height')

    // Height stored in db
    const lastHeight = await this.meta.getHeight()
    if (!lastHeight) await this.meta.setHeight(1)

    // Minimal height set in environment variables
    // Used to skip some amount of blocks
    const { minHeight } = await this.config.app

    // Higher of heights from db and env
    const fromHeight = Math.max(lastHeight ?? 1, minHeight)

    // wait for height of blockchain to be high enough
    // *Arg passed to grpc cannot be lower than current height*
    if (fromHeight > currentHeight) {
      this.logger.debug('Waiting for height', fromHeight)
      await this.blockchain.waitForHeight(fromHeight)
    }

    this.logger.log('Starting from height', fromHeight)

    const promise = this.blockchain.subscribe(this.handleChunk.bind(this), fromHeight)

    this.cancelListener = promise.cancel
    this.promise = promise

    promise.catch(() => process.exit(1))
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
