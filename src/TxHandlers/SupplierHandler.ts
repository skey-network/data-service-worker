import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import { DEVICE_PREFIX, DEVICE_REGEX } from '../Constants'
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
  private logger = new Logger(SupplierHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    this.logger.debug(SupplierHandler.name, 'handle height', update.height)

    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const { address, entries } = item
    const payload = this.parseEntries(entries)

    const exists = await this.db.safeFindOne({ address: item.address }, 'suppliers')
    const func = exists ? this.updateSupplier : this.createSupplier

    await func.bind(this)(address, payload)
  }

  async createSupplier(address: string, payload: SupplierPayload) {
    if (payload.type !== 'supplier') return

    const success = await this.db.safeInsertOne(
      {
        ...payload,
        address,
        devices: payload.devices
          .filter((device) => device.whitelisted)
          .map((device) => device.address),
        whitelisted: false
      },
      'suppliers'
    )

    success && this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, payload: SupplierPayload) {
    const { name, description, devices } = payload

    const whitelisted = devices.filter((d) => d.whitelisted).map((d) => d.address)
    const blacklisted = devices.filter((d) => !d.whitelisted).map((d) => d.address)

    const $set = { name, description }
    const $pull = { devices: { $in: blacklisted } }
    const $addToSet = { devices: { $each: whitelisted } }

    const modified = [false, false, false]

    // Cannot run pull and add$addToSet at the same time?

    if (name || description) {
      modified[0] = await this.db.safeUpdateOne({ address }, { $set }, 'suppliers')
    }

    if (whitelisted.length) {
      modified[1] = await this.db.safeUpdateOne({ address }, { $addToSet }, 'suppliers')
    }

    if (blacklisted.length) {
      modified[2] = await this.db.safeUpdateOne({ address }, { $pull }, 'suppliers')
    }

    if (modified.includes(true)) {
      this.logger.log(`Supplier ${address} updated`)
    }
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
