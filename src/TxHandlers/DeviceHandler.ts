import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import { ACTIVE_KEYWORD, KEY_REGEX } from '../Constants'
import { Handler } from './Handler'
import { Logger } from '../Logger'

interface KeyItem {
  id: string
  whitelisted: boolean
}

const keysMap = Object.freeze({
  strings: ['name', 'description', 'type', 'supplier', 'owner', 'version', 'custom'],
  floats: ['lat', 'lng', 'alt'],
  json: ['details'],
  booleans: ['visible', 'active', 'connected']
})

export class DeviceHandler extends Handler {
  private logger = new Logger(DeviceHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    for (const item of update.entries) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const update = this.parseProps(item.entries)
    const keyList = this.parseKeyList(item.entries)

    if (!update && !keyList.length) return

    const device = await this.db.safeFindOne({ address: item.address }, 'devices')
    const func = device ? this.updateDevice : this.createDevice

    await func.bind(this)(item.address, update, keyList)
  }

  async createDevice(address: string, update: any, keyList: KeyItem[]) {
    if (update?.type !== 'device') return

    const list = keyList.filter((key) => key.whitelisted).map((key) => key.id)

    const success = await this.db.safeInsertOne(
      { ...update, address, keys: list },
      'devices'
    )
    success && this.logger.log(`Device ${address} created`)
  }

  async updateDevice(address: string, update: any, keyList: KeyItem[]) {
    const whitelisted = keyList.filter((k) => k.whitelisted).map((k) => k.id)
    const blacklisted = keyList.filter((k) => !k.whitelisted).map((k) => k.id)

    const $set = update
    const $pull = { keys: { $in: blacklisted } }
    const $addToSet = { keys: { $each: whitelisted } }

    const modified = [false, false, false]

    if (update) {
      modified[0] = await this.db.safeUpdateOne({ address }, { $set }, 'devices')
    }

    if (whitelisted.length) {
      modified[1] = await this.db.safeUpdateOne({ address }, { $addToSet }, 'devices')
    }

    if (blacklisted.length) {
      modified[2] = await this.db.safeUpdateOne({ address }, { $pull }, 'devices')
    }

    if (modified.includes(true)) {
      this.logger.log(`Device ${address} updated`)
    }
  }

  parseKeyList(entries: ParsedEntry[]): KeyItem[] {
    return entries
      .filter(({ key }) => KEY_REGEX.test(key))
      .map(({ key, value }) => ({
        id: key.replace('key_', ''),
        whitelisted: value === ACTIVE_KEYWORD
      }))
  }

  parseProps(entries: ParsedEntry[]): any | null {
    const updates = entries
      .map(({ key, value }) => {
        if (keysMap.strings.includes(key)) {
          return { [key]: value }
        }

        if (keysMap.floats.includes(key)) {
          return { [key]: Number(value) }
        }

        if (keysMap.json.includes(key)) {
          const obj = this.tryParse(value as string)
          if (!obj) return this.logger.error('invalid json')

          return { [key]: obj }
        }

        if (keysMap.booleans.includes(key)) {
          return { [key]: value }
        }
      })
      .filter((update) => update)

    if (updates.length === 0) return null

    return Object.assign({}, ...updates)
  }

  tryParse(text: string) {
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }
}
