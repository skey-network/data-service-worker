import { BlockchainClient } from '../BlockchainClient'
import { Config } from '../Config'
import { GrpcClient } from '../GrpcClient'
import Queue from 'bull'
import { parseUpdate } from '../UpdateParser'
import { IProcess, JobData, SubscribeEvent } from '../Types'
import { DeviceHandler } from '../TxHandlers/DeviceHandler'
import { SupplierHandler } from '../TxHandlers/SupplierHandler'
import { OrganisationHandler } from '../TxHandlers/OrganisationHandler'

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

  async init() {
    const height = await this.blockchain.fetchHeight()
    if (!height) return console.error('Cannot fetch height')

    this.cancelListener = this.blockchain.subscribe(
      this.handleChunk.bind(this),
      height
    ).cancel
  }

  async destroy() {
    await this.cancelListener()
    await this.queue.close()
  }

  // TODO
  async handleChunk(chunk: SubscribeEvent) {
    const update = parseUpdate(chunk)
    if (!update) return

    await this.queue.add({ update, handler: DeviceHandler.name })
    await this.queue.add({ update, handler: SupplierHandler.name })
    await this.queue.add({ update, handler: OrganisationHandler.name })
  }
}
