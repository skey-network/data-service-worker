import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'
import { ACTIVE_KEYWORD, KEY_REGEX } from '../Constants'
import { EntryMap, Handler, ListItem, UpdateItemPayload } from './Handler'
import { Logger } from '../Logger'

const entryMap: EntryMap = Object.freeze({
  strings: ['name', 'description', 'type', 'supplier', 'owner', 'version', 'custom'],
  floats: ['lat', 'lng', 'alt'],
  json: ['details'],
  booleans: ['visible', 'active', 'connected']
})

export class DeviceHandler extends Handler {
  protected logger = new Logger(DeviceHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    for (const item of update.entries) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const update = this.parseProps(item.entries, entryMap)
    const keyList = this.parseKeyList(item.entries)

    if (!update && !keyList.length) return

    const device = await this.db.safeFindOne({ address: item.address }, 'devices')
    const func = device ? this.updateDevice : this.createDevice

    await func.bind(this)(item.address, update, keyList)
  }

  async createDevice(address: string, update: any, keyList: ListItem[]) {
    if (update?.type !== 'device') return

    const newRecord = this.buildNewDevice(address, update, this.idsFromWhitelist(keyList))
    const success = await this.db.safeInsertOne(newRecord, 'devices')

    success && this.logger.log(`Device ${address} created`)
  }

  async updateDevice(address: string, update: any, keyList: ListItem[]) {
    const commonUpdateProps: UpdateItemPayload = {
      collection: 'devices',
      type: 'device',
      idField: 'address',
      id: address
    }

    await this.updateList({
      ...commonUpdateProps,
      whitelistName: 'whitelist',
      list: keyList
    })

    await this.updateProps({
      ...commonUpdateProps,
      data: await this.buildUpdateDeviceProps(address, update)
    })
  }

  parseKeyList(entries: ParsedEntry[]): ListItem[] {
    return this.extractWhitelist({
      entries,
      regex: KEY_REGEX,
      prefix: 'key_',
      compareFunc: (value) => value === ACTIVE_KEYWORD
    })
  }

  private buildNewDevice(address: string, update: any, whitelist: string[]) {
    const newDevice = { ...update, address, whitelist }
    if (update.lng && update.lat) {
      newDevice.location = {
        type: 'Point',
        coordinates: [update.lng, update.lat]
      }
    }
    return newDevice
  }

  private async buildUpdateDeviceProps(address: string, update: any) {
    if (!update) return update

    const updateDeviceProps = { ...update }

    if (update.lng && update.lat) {
      updateDeviceProps.location = {
        type: 'Point',
        coordinates: [update.lng, update.lat]
      }
    } else if (update.lng || update.lat) {
      const { lng, lat } = await this.db.safeFindOne({ address }, 'devices')

      updateDeviceProps.location = {
        type: 'Point',
        coordinates: [update.lng || lng, update.lat || lat]
      }
    }

    return updateDeviceProps
  }
}
