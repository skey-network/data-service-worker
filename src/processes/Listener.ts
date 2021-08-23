import { BlockchainClient, CancellablePromise } from '../Clients/BlockchainClient'
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
  promise: CancellablePromise<void>
  index = -1

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

  async handleGrpcConnection(): Promise<void> {
    const node = this.nextNode()
    if (!node) {
      this.logger.error('Cannot find node to connect. Exiting ...')
      process.exit(1)
    }

    this.logger.debug('Trying to connect to', node)

    this.config.grpc.host = node
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc, this.config)

    const initialHeight = await this.getInitialHeight()
    if (!initialHeight) {
      this.logger.error('cannot connect to', node)
      return this.handleGrpcConnection()
    }

    this.logger.log(node, 'connected')
    this.logger.log('Starting from height', initialHeight)

    this.promise = this.blockchain.subscribe(this.handleChunk.bind(this), initialHeight)

    this.promise.catch(async () => {
      this.handleGrpcConnection()
    })
  }

  async init() {
    await this.db.connect()
    this.meta = new MetaClient(this.config, this.db)

    await this.handleGrpcConnection()
  }

  async getInitialHeight() {
    // Current height of blockchain
    const currentHeight = await this.blockchain.fetchHeight()
    if (!currentHeight) {
      this.logger.error('Cannot fetch current blockchain height')
      return null
    }

    // Height stored in db
    const lastHeight = await this.meta.getHeight()
    if (!lastHeight) await this.meta.setHeight(1)

    // Minimal height set in environment variables
    // Used to skip some amount of blocks
    const { minHeight } = this.config.app

    // Higher of heights from db and env
    const fromHeight = Math.max(lastHeight ?? 1, minHeight)

    // wait for height of blockchain to be high enough
    // *Arg passed to grpc cannot be lower than current height*
    if (fromHeight > currentHeight) {
      this.logger.debug('Waiting for height', fromHeight)
      await this.blockchain.waitForHeight(fromHeight)
    }

    return fromHeight
  }

  async destroy() {
    await this.db.disconnect()
    await this.promise.cancel()
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

  nextNode(): string | null {
    this.index++

    const nodes = this.config.grpc.peers
    return nodes[this.index % nodes.length]
  }
}
