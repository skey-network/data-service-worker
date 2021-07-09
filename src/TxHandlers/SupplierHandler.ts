import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import { ACTIVE_KEYWORD, DEVICE_PREFIX, DEVICE_REGEX } from '../Constants'
import { Logger } from '../Logger'
import { Handler } from './Handler'

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
  private logger = new Logger(SupplierHandler.name)

  get supplierModel() {
    return this.db.models.supplierModel
  }

  async handleUpdate(update: ParsedUpdate) {
    this.logger.debug(SupplierHandler.name, 'handle height', update.height)

    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const { address, entries } = item
    const payload = this.parseEntries(entries)

    const exists = await this.supplierModel.exists({ address: item.address })

    if (exists) {
      return await this.updateSupplier(address, payload)
    }

    if (payload.type === 'supplier') {
      return await this.createSupplier(address, payload)
    }
  }

  async createSupplier(address: string, payload: SupplierPayload) {
    await this.supplierModel.create({
      ...payload,
      address,
      devices: payload.devices
        .filter((device) => device.whitelisted)
        .map((device) => device.address),
      whitelisted: false
    })

    this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, payload: SupplierPayload) {
    const { name, description, devices } = payload

    const whitelisted = devices.filter((d) => d.whitelisted).map((d) => d.address)
    const blacklisted = devices.filter((d) => !d.whitelisted).map((d) => d.address)

    const $set = { name, description }
    const $pull = { devices: { $in: blacklisted } }
    const $addToSet = { devices: { $each: whitelisted } }

    // Cannot run pull and add$addToSet at the same time?

    if (name || description) {
      await this.supplierModel.updateOne({ address }, { $set })
    }

    if (whitelisted.length) {
      await this.supplierModel.updateOne({ address }, { $addToSet })
    }

    if (blacklisted.length) {
      await this.supplierModel.updateOne({ address }, { $pull })
    }

    this.logger.log(`Supplier ${address} updated`)
  }

  parseEntries(entries: ParsedEntry[]): SupplierPayload {
    const fields = ['name', 'description', 'type']

    const info = Object.fromEntries(
      entries
        .filter(({ key }) => fields.includes(key))
        .map(({ key, value }) => [key, value])
    )

    const list = entries
      .filter(({ key }) => DEVICE_REGEX.test(key))
      .map(({ key, value }) => ({
        address: key.replace(DEVICE_PREFIX, ''),
        whitelisted: !!value
      }))

    return { ...info, devices: list }
  }
}
