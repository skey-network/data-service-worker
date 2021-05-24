import { IteratorItem, AbstractHandler } from './AbstractHandler'
import { SubscribeEvent, Entry } from '../Types'
import { Supplier } from '../../models/Supplier'
import { ACTIVE_KEYWORD, DEVICE_PREFIX, DEVICE_REGEX } from '../Constants'
import { Logger } from '../Logger'

// This handles adding and removing devices from dapp
// Possible outcome is updating device or creating empty in db

export interface SupplierPayload {
  name?: string
  description?: string
  type?: string
  devices: {
    address: string
    whitelisted: boolean
  }[]
}

export class UpdateSupplierHandler extends AbstractHandler {
  static logger = new Logger(UpdateSupplierHandler.name)

  static async handle(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      await this.handleSingleUpdate(item)
    }
  }

  static async handleSingleUpdate(item: IteratorItem) {
    const address = this.bufforToAddress(item.address ?? [])
    const payload = this.parseEntries(item.entries)

    const exists = await Supplier.exists({ address })

    if (exists) {
      return await this.updateSupplier(address, payload)
    }

    if (payload.type === 'supplier') {
      return await this.createSupplier(address, payload)
    }
  }

  static async createSupplier(address: string, payload: SupplierPayload) {
    const obj = {
      ...payload,
      address,
      devices: payload.devices.filter((device) => device.whitelisted)
    }

    await Supplier.create(obj)
    this.logger.log(`Supplier ${address} created`)
  }

  static async updateSupplier(address: string, payload: SupplierPayload) {
    const { name, description, devices } = payload

    const whitelisted = devices.filter((d) => d.whitelisted).map((d) => d.address)
    const blacklisted = devices.filter((d) => !d.whitelisted).map((d) => d.address)

    const $set = { name, description }
    const $pull = { devices: { $in: blacklisted } }
    const $push = { devices: { $each: whitelisted } }

    // Cannot run pull and push at the same time?

    if (name || description) {
      await Supplier.updateOne({ address }, { $set })
    }

    if (whitelisted.length) {
      await Supplier.updateOne({ address }, { $push })
    }

    if (blacklisted.length) {
      await Supplier.updateOne({ address }, { $pull })
    }

    this.logger.log(`Supplier ${address} updated`)
  }

  static parseEntries(entries: Entry[]): SupplierPayload {
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
