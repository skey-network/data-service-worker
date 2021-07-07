import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import { ACTIVE_KEYWORD, KEY_REGEX } from '../Constants'
import { Handler } from './Handler'
import { DatabaseClient } from '../Database'
import { BlockchainClient } from '../BlockchainClient'
import { Logger } from '../Logger'
import { delay } from '../Common'

interface KeyItem {
  id: string
  whitelisted: boolean
}

const keysMap = Object.freeze({
  strings: ['name', 'description', 'type', 'supplier', 'owner', 'version'],
  floats: ['lat', 'lng', 'alt'],
  json: ['details', 'custom'],
  booleans: ['visible', 'active', 'connected']
})

export class DeviceHandler extends Handler {
  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    super(db, blockchain)
  }

  private logger = new Logger(DeviceHandler.name)

  get deviceModel() {
    return this.db.models.deviceModel
  }

  async handleUpdate(update: ParsedUpdate) {
    for (const item of update.entries) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const update = this.parseProps(item.entries)
    const keyList = this.parseKeyList(item.entries)

    if (!update && !keyList.length) return

    const device = await this.deviceModel.exists({ address: item.address })
    const func = device ? this.updateDevice : this.createDevice

    await func.bind(this)(item.address, update, keyList)
  }

  async createDevice(address: string, update: any, keyList: KeyItem[]) {
    if (update?.type !== 'device') return

    const list = keyList.filter((key) => key.whitelisted).map((key) => key.id)

    await this.deviceModel.create({ ...update, address, keys: list })
    this.logger.log(`Device ${address} created`)
  }

  async updateDevice(address: string, update: any, keyList: KeyItem[]) {
    const whitelisted = keyList.filter((k) => k.whitelisted).map((k) => k.id)
    const blacklisted = keyList.filter((k) => !k.whitelisted).map((k) => k.id)

    const $set = update
    const $pull = { keys: { $in: blacklisted } }
    const $push = { keys: { $each: whitelisted } }

    if (update) {
      await this.deviceModel.updateOne({ address }, { $set })
    }

    if (whitelisted.length) {
      await this.deviceModel.updateOne({ address }, { $push })
    }

    if (blacklisted.length) {
      await this.deviceModel.updateOne({ address }, { $pull })
    }

    this.logger.log(`Device ${address} updated`)
  }

  parseKeyList(entries: ParsedEntry[]): KeyItem[] {
    return entries
      .filter((entry) => KEY_REGEX.test(entry.key))
      .map((entry) => ({
        id: entry.key.replace('key_', ''),
        whitelisted: entry.value === ACTIVE_KEYWORD
      }))
  }

  parseProps(entries: ParsedEntry[]): any | null {
    const updates = entries
      .map((entry) => {
        const { key, value } = entry

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
