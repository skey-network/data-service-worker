import { Config } from '../Config'
import {
  DatabaseClient,
  defaultOptions as dbDefaultOptions
} from '../Clients/DatabaseClient'
import Queue from 'bull'
import { DeviceHandler } from '../TxHandlers/DeviceHandler'
import { IProcess, JobData } from '../Types'
import { SupplierHandler } from '../TxHandlers/SupplierHandler'
import { OrganisationHandler } from '../TxHandlers/OrganisationHandler'
import { DappFatherHandler } from '../TxHandlers/DappFatherHandler'
import { GrpcClient } from '../Clients/GrpcClient'
import { BlockchainClient } from '../Clients/BlockchainClient'
import { KeyHandler } from '../TxHandlers/KeyHandler'
import { EventHandler } from '../TxHandlers/EventHandler'

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
    const dappFatherHandler = new DappFatherHandler(this.config, this.db, this.blockchain)
    const supplierHandler = new SupplierHandler(this.config, this.db, this.blockchain)
    const organisationHandler = new OrganisationHandler(
      this.config,
      this.db,
      this.blockchain
    )
    const deviceHandler = new DeviceHandler(this.config, this.db, this.blockchain)
    const keyHandler = new KeyHandler(this.config, this.db, this.blockchain)
    const eventHandler = new EventHandler(this.config, this.db, this.blockchain)

    await dappFatherHandler.handleUpdate(job.data.update)
    await supplierHandler.handleUpdate(job.data.update)
    await organisationHandler.handleUpdate(job.data.update)
    await deviceHandler.handleUpdate(job.data.update)
    await keyHandler.handleUpdate(job.data.update)
    await eventHandler.handleUpdate(job.data.update)
  }
}
