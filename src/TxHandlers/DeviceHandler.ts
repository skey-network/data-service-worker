import { DataUpdate, Update } from '../UpdateParser'
import { Entry } from '../Types'
import { createLogger } from '../Logger'
import { Device } from '../../models/Device'
import { bufferToString } from '../Common'
import { ACTIVE_KEYWORD, KEY_REGEX } from '../Constants'

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

export const handleDeviceUpdates = async (update: Update) => {
  for (const item of update.dataUpdates) {
    await handleSingleUpdate(item)
  }
}

const handleSingleUpdate = async (item: DataUpdate) => {
  const address = bufferToString(item.address ?? [])
  const update = parseProps(item.entries)
  const keyList = parseKeyList(item.entries)

  if (!update || !keyList.length) return
  // logger.debug('no updates')

  const device = await Device.exists({ address })
  const func = device ? updateDevice : createDevice

  await func(address, update, keyList)
}

const createDevice = async (address: string, update: any, keyList: KeyItem[]) => {
  if (update.type !== 'device') {
    return
    // return logger.debug('invalid type')
  }

  const list = keyList.filter((key) => key.whitelisted).map((key) => key.id)

  await Device.create({ ...update, address, keys: list })
  logger.log(`Device ${address} created`)
}

const updateDevice = async (address: string, update: any, keyList: KeyItem[]) => {
  const whitelisted = keyList.filter((k) => k.whitelisted).map((k) => k.id)
  const blacklisted = keyList.filter((k) => !k.whitelisted).map((k) => k.id)

  const $set = update
  const $pull = { keys: { $in: blacklisted } }
  const $push = { keys: { $each: whitelisted } }

  if (update) {
    await Device.updateOne({ address }, { $set })
  }

  if (whitelisted.length) {
    await Device.updateOne({ address }, { $push })
  }

  if (blacklisted.length) {
    await Device.updateOne({ address }, { $pull })
  }

  logger.log(`Device ${address} updated`)
}

const parseKeyList = (entries: Entry[]): KeyItem[] => {
  return entries
    .filter((entry) => KEY_REGEX.test(entry.key ?? ''))
    .map((entry) => ({
      id: entry.key!.replace('key_', ''),
      whitelisted: entry.string_value === ACTIVE_KEYWORD
    }))
}

const parseProps = (entries: Entry[]): any | null => {
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
        const obj = tryParse(string_value ?? '')

        if (!obj) {
          return
          // return logger.debug('invalid json')
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

const tryParse = (text: string) => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
