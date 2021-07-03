import type { IHandler } from './TxHandlers/Handler'

import { DappFatherHandler } from './TxHandlers/DappFatherHandler'
import { EventHandler } from './TxHandlers/EventHandler'
import { KeyHandler } from './TxHandlers/KeyHandler'
import { OrganisationHandler } from './TxHandlers/OrganisationHandler'
import { SupplierHandler } from './TxHandlers/SupplierHandler'
import { DeviceHandler } from './TxHandlers/DeviceHandler'

import { DatabaseClient, defaultOptions as DbDefaultOptions } from './Database'
import { BlockchainClient } from './BlockchainClient'
import { GrpcClient } from './GrpcClient'
import { Config } from './Config'
import { SubscribeEvent } from './Types'
import { parseUpdate, Update } from './UpdateParser'
import Queue from 'bull'

interface JobData {
  handler: string
  update: Update
}

export class App {
  handlers: IHandler[]
  config: Config
  db: DatabaseClient
  blockchain: BlockchainClient
  grpc: GrpcClient
  queue: Queue.Queue<JobData>
  cancelListener: () => Promise<void>

  constructor(config: Config) {
    this.config = config
  }

  async init() {
    this.db = new DatabaseClient(this.config.db, DbDefaultOptions)
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc)
    this.queue = new Queue('Default', { redis: this.config.redis })
    this.queue.process(this.process.bind(this))

    await this.db.connect()
    this.loadHandlers()
  }

  async destroy() {
    await this.stopListener()
    await this.queue.close()
    await this.db.disconnect()
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

  async handleChunk(chunk: SubscribeEvent) {
    console.log('handle chunk', chunk.update?.height)

    if (!this.hasTransactions(chunk)) return

    const update = parseUpdate(chunk)
    if (!update) return

    for (const handler of this.handlers) {
      const job = await this.queue.add({ update, handler: handler.constructor.name })
      console.log('Processing block update', update.height, 'with job id', Number(job.id))
    }
  }

  async process(job: Queue.Job<JobData>) {
    console.log('Processing job', job.id, 'with handler', job.data.handler)

    const handler = this.handlers.find(
      (handler) => handler.constructor.name === job.data.handler
    )

    if (!handler) throw new Error('handler not found')

    await handler.handleUpdate(job.data.update)
  }

  hasTransactions(chunk: SubscribeEvent) {
    return (chunk.update?.append?.transaction_ids ?? []).length > 0
  }

  loadHandlers() {
    this.handlers = [
      new DappFatherHandler(this.db, this.blockchain),
      new EventHandler(this.db, this.blockchain),
      new KeyHandler(this.db, this.blockchain),
      new OrganisationHandler(this.db, this.blockchain),
      new SupplierHandler(this.db, this.blockchain),
      new DeviceHandler(this.db, this.blockchain)
    ]
  }
}
