import { DataUpdate, Update } from '../UpdateParser'
import { Entry } from '../Types'
import { createLogger } from '../Logger'
import { ACTIVE_KEYWORD, KEY_REGEX } from '../Constants'
import { Handler } from './Handler'
import { DatabaseClient } from '../Database'
import { BlockchainClient } from '../BlockchainClient'

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

const logger = createLogger('UpdateDeviceHandler')

export class DeviceHandler extends Handler {
  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    super(db, blockchain)
  }

  get deviceModel() {
    return this.db.models.deviceModel
  }

  async handleUpdate(update: Update) {
    console.log('parse device')
    for (const item of update.dataUpdates) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: DataUpdate) {
    const update = this.parseProps(item.entries)
    const keyList = this.parseKeyList(item.entries)

    console.log(update, keyList)

    if (!update && !keyList.length) return

    const device = await this.deviceModel.exists({ address: item.address })
    const func = device ? this.updateDevice : this.createDevice

    await func.bind(this)(item.address, update, keyList)
  }

  async createDevice(address: string, update: any, keyList: KeyItem[]) {
    if (update?.type !== 'device') return

    const list = keyList.filter((key) => key.whitelisted).map((key) => key.id)

    await this.deviceModel.create({ ...update, address, keys: list })
    logger.log(`Device ${address} created`)
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

    logger.log(`Device ${address} updated`)
  }

  parseKeyList(entries: Entry[]): KeyItem[] {
    return entries
      .filter((entry) => KEY_REGEX.test(entry.key ?? ''))
      .map((entry) => ({
        id: entry.key!.replace('key_', ''),
        whitelisted: entry.string_value === ACTIVE_KEYWORD
      }))
  }

  parseProps(entries: Entry[]): any | null {
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

          if (!obj) return logger.error('invalid json')

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

  tryParse(text: string) {
    try {
      return JSON.parse(text)
    } catch {
      return null
    }
  }
}
