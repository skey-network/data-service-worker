import { Config } from '../Config'
import {
  DatabaseClient,
  defaultOptions as dbDefaultOptions
} from '../Clients/DatabaseClient'
import Queue from 'bull'
import { IProcess, JobData } from '../Types'
import { GrpcClient } from '../Clients/GrpcClient'
import { BlockchainClient } from '../Clients/BlockchainClient'
import { getClassByName } from '../HandlerManager'
import { Logger } from '../Logger'

export class Processor implements IProcess {
  config: Config
  db: DatabaseClient
  queue: Queue.Queue<JobData>
  grpc: GrpcClient
  blockchain: BlockchainClient

  constructor(config: Config) {
    this.config = config
  }

  async init() {
    this.db = new DatabaseClient(this.config, dbDefaultOptions)
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc, this.config)

    const { host, port, queue } = this.config.redis
    this.queue = new Queue(queue, { redis: { host, port } })

    this.queue.process(this.process.bind(this))

    await this.db.connect()
  }

  get logger() {
    return new Logger(Processor.name, this.config.app.logs)
  }

  async destroy() {
    await this.queue.close()
    await this.db.disconnect()
  }

  async process(job: Queue.Job<JobData>) {
    this.logger.debug(`Processing update`, job.data.update.height)
    this.logger.debug(`Using handler - `, job.data.handler)

    const handlerClass = getClassByName(job.data.handler)!
    const handler = new handlerClass(this.config, this.db, this.blockchain)

    await handler.handleUpdate(job.data.update)
  }
}
