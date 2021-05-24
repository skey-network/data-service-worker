import { IteratorItem, AbstractHandler } from './AbstractHandler'
import { SubscribeEvent, Entry } from '../Types'
import { Logger } from '../Logger'
import { Device } from '../../models/Device'

const keysMap = Object.freeze({
  strings: ['name', 'description', 'type', 'supplier', 'owner', 'version'],
  floats: ['lat', 'lng', 'alt'],
  json: ['details', 'custom'],
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
    const update = this.parseEntries(item.entries)

    if (!update) return this.logger.debug('no updates')

    console.log(update)

    await this.save(address, update)
  }

  static async save(address: string, update: any) {
    const device = await Device.findOne({ address })

    if (device) {
      await Device.updateOne({ address: device.address }, { $set: update })
      this.logger.log(`Device ${address} updated`)
    } else {
      if (update.type !== 'device') {
        return this.logger.debug('invalid type')
      }

      await Device.create({ address, ...update })
      this.logger.log(`Device ${address} created`)
    }
  }

  static parseEntries(entries: Entry[]): any | null {
    const updates = entries
      .map((entry) => {
        const key = entry.key ?? ''
        const { string_value, bool_value } = entry

        if (keysMap.strings.includes(key)) {
          return { [key]: string_value ?? '' }
        }

        if (keysMap.floats.includes(key)) {
          return { [key]: Number(string_value ?? '0') }
        }

        if (keysMap.json.includes(key)) {
          const obj = this.tryParse(string_value ?? '')

          if (!obj) {
            return this.logger.debug('invalid json')
          }

          return { [key]: obj }
        }

        if (keysMap.booleans.includes(key)) {
          return { [key]: bool_value ?? false }
        }
      })
      .filter((update) => update)

    if (updates.length === 0) return null

    return Object.assign({}, ...updates)
  }

  static tryParse(text: string) {
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }
}
