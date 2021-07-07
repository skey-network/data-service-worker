import { Config } from './Config'
import { DatabaseClient, defaultOptions as dbDefaultOptions } from './Database'
import Queue from 'bull'
import { ParsedUpdate } from './UpdateParser'
import { DeviceHandler } from './TxHandlers/DeviceHandler'
import { BlockchainClient } from './BlockchainClient'
import { GrpcClient } from './GrpcClient'

interface JobData {
  handler: string
  update: ParsedUpdate
}

export class Processor {
  config: Config
  db: DatabaseClient
  blockchain: BlockchainClient
  grpc: GrpcClient
  queue: Queue.Queue<JobData>

  constructor(config: Config) {
    this.config = config
  }

  async init() {
    this.db = new DatabaseClient(this.config.db, dbDefaultOptions)

    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc)

    const { host, port, queue } = this.config.redis
    this.queue = new Queue(queue, { redis: { host, port } })

    this.queue.process(this.process.bind(this))

    await this.db.connect()
  }

  async destroy() {
    await this.queue.close()
    await this.db.disconnect()
  }

  async process(job: Queue.Job<JobData>) {
    const handler = new DeviceHandler(this.db, this.blockchain)
    await handler.handleUpdate(job.data.update)
  }
}
