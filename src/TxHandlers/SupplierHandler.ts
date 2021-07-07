import { DataUpdate, Update } from '../UpdateParser'
import { Entry } from '../Types'
import { ACTIVE_KEYWORD, DEVICE_PREFIX, DEVICE_REGEX } from '../Constants'
import { Logger } from '../Logger'
import { bufferToString } from '../Common'
import { Handler } from './Handler'
import { DatabaseClient } from '../Database'
import { BlockchainClient } from '../BlockchainClient'

export interface SupplierPayload {
  name?: string
  description?: string
  type?: string
  devices: {
    address: string
    whitelisted: boolean
  }[]
}

export class SupplierHandler extends Handler {
  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    super(db, blockchain)
  }

  private logger = new Logger(SupplierHandler.name)

  get supplierModel() {
    return this.db.models.supplierModel
  }

  async handleUpdate(update: Update) {
    this.logger.debug(SupplierHandler.name, 'handle height', update.height)

    for (const item of update.dataUpdates) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: DataUpdate) {
    const address = bufferToString(item.address ?? [])
    const payload = this.parseEntries(item.entries)

    const exists = await this.supplierModel.exists({ address })

    if (exists) {
      return await this.updateSupplier(address, payload)
    }

    if (payload.type === 'supplier') {
      return await this.createSupplier(address, payload)
    }
  }

  async createSupplier(address: string, payload: SupplierPayload) {
    const obj = {
      ...payload,
      address,
      devices: payload.devices.filter((device) => device.whitelisted)
    }

    await this.supplierModel.create(obj)
    this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, payload: SupplierPayload) {
    const { name, description, devices } = payload

    const whitelisted = devices.filter((d) => d.whitelisted).map((d) => d.address)
    const blacklisted = devices.filter((d) => !d.whitelisted).map((d) => d.address)

    const $set = { name, description }
    const $pull = { devices: { $in: blacklisted } }
    const $push = { devices: { $each: whitelisted } }

    // Cannot run pull and push at the same time?

    if (name || description) {
      await this.supplierModel.updateOne({ address }, { $set })
    }

    if (whitelisted.length) {
      await this.supplierModel.updateOne({ address }, { $push })
    }

    if (blacklisted.length) {
      await this.supplierModel.updateOne({ address }, { $pull })
    }

    this.logger.log(`Supplier ${address} updated`)
  }

  parseEntries(entries: Entry[]): SupplierPayload {
    const fields = ['name', 'description', 'type']

    const info = Object.fromEntries(
      entries
        .filter((entry) => fields.includes(entry.key!))
        .map((entry) => [entry.key, entry.string_value])
    )

    const list = entries
      .filter((entry) => DEVICE_REGEX.test(entry.key!))
      .map((entry) => ({
        address: entry.key?.replace(DEVICE_PREFIX, '') ?? '',
        whitelisted: ACTIVE_KEYWORD === entry.string_value
      }))

    return { ...info, devices: list }
  }
}
