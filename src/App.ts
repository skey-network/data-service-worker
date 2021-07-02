import { Handler } from './TxHandlers/Handler'

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

export class App {
  handlers: Handler[]
  config: Config
  db: DatabaseClient
  blockchain: BlockchainClient
  grpc: GrpcClient
  queue: Queue.Queue<Update>
  cancelListener: () => Promise<void>

  constructor(config: Config) {
    this.config = config
  }

  async init() {
    this.db = new DatabaseClient(this.config.db, DbDefaultOptions)
    this.grpc = new GrpcClient(this.config.grpc)
    this.blockchain = new BlockchainClient(this.grpc)
    this.queue = new Queue('Default', { redis: this.config.redis })

    await this.db.connect()
    this.loadHandlers()
  }

  async destroy() {
    await Promise.all([this.stopListener(), this.db.disconnect(), this.queue.close()])
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
    if (!this.hasTransactions(chunk)) return

    const update = parseUpdate(chunk)
    if (!update) return

    const job = await this.queue.add(update)
    console.log('Processing block update', update.height, 'with job id', Number(job.id))
  }

  async process(job: Queue.Job<Update>) {
    const percentPerTask = Math.floor(100 / this.handlers.length)

    let failed = false
    let progress = 0

    await Promise.all(
      this.handlers.map(async (handler) => {
        try {
          await handler.handleUpdate(job.data)
          progress += percentPerTask
          await job.progress(progress)
        } catch (err) {
          console.error(err)
          failed = true
        }
      })
    )

    if (!failed) return

    await job.moveToFailed({ message: 'Job failed' })
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
