import { Config } from '../Config'
import { DatabaseClient, defaultOptions as dbDefaultOptions } from '../Database'
import Queue from 'bull'
import { DeviceHandler } from '../TxHandlers/DeviceHandler'
import { IProcess, JobData } from '../Types'
import { SupplierHandler } from '../TxHandlers/SupplierHandler'
import { OrganisationHandler } from '../TxHandlers/OrganisationHandler'

export class Processor implements IProcess {
  config: Config
  db: DatabaseClient
  queue: Queue.Queue<JobData>

  constructor(config: Config) {
    this.config = config
  }

  async init() {
    this.db = new DatabaseClient(this.config.db, dbDefaultOptions)

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
    const deviceHandler = new DeviceHandler(this.db, null as any)
    const supplierHandler = new SupplierHandler(this.db, null as any)
    const organisationHandler = new OrganisationHandler(this.db, null as any)

    await deviceHandler.handleUpdate(job.data.update)
    await supplierHandler.handleUpdate(job.data.update)
    await organisationHandler.handleUpdate(job.data.update)
  }
}
