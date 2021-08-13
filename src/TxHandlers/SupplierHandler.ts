import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import {
  ACTIVE_KEYWORD,
  DEVICE_PREFIX,
  DEVICE_REGEX,
  ORGANISATION_PREFIX,
  ORGANISATION_REGEX
} from '../Constants'
import { Logger } from '../Logger'
import { Handler, ListItem, UpdateItemPayload } from './Handler'

export interface SupplierPayload {
  name?: string
  description?: string
  type?: string
  whitelist: ListItem[]
  organisations: ListItem[]
}

export class SupplierHandler extends Handler {
  protected logger = new Logger(SupplierHandler.name, this.config.app.logs)

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

    const { name, description } = payload

    const success = await this.db.safeInsertOne(
      {
        address,
        name,
        description,
        whitelist: this.idsFromWhitelist(payload.whitelist),
        organisations: this.idsFromWhitelist(payload.organisations),
        whitelisted: false
      },
      'suppliers'
    )

    success && this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, payload: SupplierPayload) {
    const { name, description, whitelist, organisations } = payload

    const commonUpdateProps: UpdateItemPayload = {
      collection: 'suppliers',
      type: 'supplier',
      idField: 'address',
      id: address
    }

    await this.updateList({
      ...commonUpdateProps,
      whitelistName: 'whitelist',
      list: whitelist
    })

    await this.updateList({
      ...commonUpdateProps,
      whitelistName: 'organisations',
      list: organisations
    })

    await this.updateProps({
      ...commonUpdateProps,
      data: { name, description }
    })
  }

  parseEntries(entries: ParsedEntry[]): SupplierPayload {
    const fields = ['name', 'description', 'type']

    const info = Object.fromEntries(
      entries
        .filter(({ key }) => fields.includes(key))
        .map(({ key, value }) => [key, value])
    )

    const devices = this.extractWhitelist({
      entries,
      regex: DEVICE_REGEX,
      prefix: DEVICE_PREFIX,
      compareFunc: (value) => !!value
    })

    const organisations = this.extractWhitelist({
      entries,
      regex: ORGANISATION_REGEX,
      prefix: ORGANISATION_PREFIX,
      compareFunc: (value) => value === ACTIVE_KEYWORD
    })

    return { ...info, whitelist: devices, organisations }
  }
}
