import { IteratorItem, AbstractHandler } from './AbstractHandler'
import { SubscribeEvent, Entry } from '../Types'
import { Logger } from '../Logger'
import { Device } from '../../models/Device'

const keysMap = Object.freeze({
  rootStrings: [
    'name',
    'type',
    'description',
    'additional_description',
    'asset_url',
    'url',
    'contact',
    'floor',
    'supplier',
    'owner',
    'device_model',
    'device_type',
    'type'
  ],
  addressStrings: [
    'address_line_1',
    'address_line_2',
    'city',
    'postcode',
    'state',
    'country',
    'number'
  ],
  location: ['lat', 'lng', 'alt'],
  booleans: ['visible', 'active', 'connected']
})

// This handles state changes on device address
// Possible outcomes are saving and creating device in db

export class UpdateDeviceHandler extends AbstractHandler {
  static logger = new Logger(UpdateDeviceHandler.name)

  static async handle(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      await this.handleSingleUpdate(item)
    }
  }

  static async handleSingleUpdate(item: IteratorItem) {
    const address = this.bufforToAddress(item.address ?? [])

    const update = this.getUpdate(item.entries)
    if (!update) return

    await this.save(address, update)
  }

  static async save(address: string, update: any) {
    const device = await Device.findOne({ address })

    if (device) {
      await Device.updateOne({ address: device.address }, { $set: update })
      this.logger.log(`Device ${address} updated`)
    } else {
      if (!update.supplier || !update.owner) {
        this.logger.debug('device dapp && owner not specified')
        return
      }

      await Device.create({ address, ...update, whitelisted: false })
      this.logger.log(`Device ${address} created`)
    }
  }

  static getUpdate(entries: Entry[]): any | null {
    const updates = entries
      .map((entry) => this.parseDeviceEntry(entry))
      .filter((entry) => entry)

    if (updates.length === 0) {
      this.logger.debug('invalid entry keys')
      return null
    }

    return Object.assign({}, ...updates)
  }

  static parseDeviceEntry(entry: Entry): Object | null {
    if (!entry.key) return null

    if (keysMap.rootStrings.includes(entry.key)) {
      return { [this.snakeToCamel(entry.key)]: entry.string_value }
    }

    if (keysMap.addressStrings.includes(entry.key)) {
      return { [`physicalAddress.${this.snakeToCamel(entry.key)}`]: entry.string_value }
    }

    if (keysMap.location.includes(entry.key)) {
      return { [`location.${entry.key}`]: Number(entry.string_value ?? '0') }
    }

    if (keysMap.booleans.includes(entry.key)) {
      if (entry.value === 'bool_value') {
        return { [entry.key]: entry.bool_value }
      }

      if (entry.value === 'string_value') {
        return { [entry.key]: entry.string_value === 'true' }
      }
    }

    if (/^custom_/.test(entry.key)) {
      return { [`custom.${entry.key.replace('custom_', '')}`]: entry.string_value }
    }

    return null
  }

  static snakeToCamel(str: string) {
    return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
  }
}
