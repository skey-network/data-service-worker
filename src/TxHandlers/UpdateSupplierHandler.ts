import { DataUpdate, Update } from '../UpdateParser'
import { Entry } from '../Types'
import { Supplier } from '../../models/Supplier'
import { ACTIVE_KEYWORD, DEVICE_PREFIX, DEVICE_REGEX } from '../Constants'
import { createLogger } from '../Logger'
import { bufforToAddress } from '../Common'

export interface SupplierPayload {
  name?: string
  description?: string
  type?: string
  devices: {
    address: string
    whitelisted: boolean
  }[]
}

const logger = createLogger('UpdateSupplierHandler')

export const handleSupplierUpdates = async (update: Update) => {
  for (const item of update.dataUpdates) {
    await handleSingleUpdate(item)
  }
}

const handleSingleUpdate = async (item: DataUpdate) => {
  const address = bufforToAddress(item.address ?? [])
  const payload = parseEntries(item.entries)

  const exists = await Supplier.exists({ address })

  if (exists) {
    return await updateSupplier(address, payload)
  }

  if (payload.type === 'supplier') {
    return await createSupplier(address, payload)
  }
}

const createSupplier = async (address: string, payload: SupplierPayload) => {
  const obj = {
    ...payload,
    address,
    devices: payload.devices.filter((device) => device.whitelisted)
  }

  await Supplier.create(obj)
  logger.log(`Supplier ${address} created`)
}

const updateSupplier = async (address: string, payload: SupplierPayload) => {
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

  logger.log(`Supplier ${address} updated`)
}

const parseEntries = (entries: Entry[]): SupplierPayload => {
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
