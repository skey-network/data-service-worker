import { Update, DataUpdate } from '../UpdateParser'
import { createLogger } from '../Logger'
import { Entry } from '../Types'
import config from '../../config'
import { ACTIVE_KEYWORD, SUPPLIER_PREFIX, SUPPLIER_REGEX } from '../Constants'
import { Supplier } from '../../models/Supplier'
import { bufforToAddress } from '../Common'

const logger = createLogger('DappFatherHandler')

export const handleDappFatherUpdates = async (update: Update) => {
  for (const item of update.dataUpdates) {
    await handleSingleUpdate(item)
  }
}

const handleSingleUpdate = async (item: DataUpdate) => {
  const { dappFatherAddress } = config().blockchain
  const address = bufforToAddress(item.address)

  if (address !== dappFatherAddress) {
    return logger.debug('address is not dapp father')
  }

  for (const entry of item.entries) {
    await handleSingleEntry(entry)
  }
}

const handleSingleEntry = async (entry: Entry) => {
  if (!SUPPLIER_REGEX.test(entry.key ?? '')) {
    return logger.debug('invalid key')
  }

  const address = entry.key!.replace(SUPPLIER_PREFIX, '')
  const whitelisted = entry.string_value === ACTIVE_KEYWORD

  const exists = await Supplier.exists({ address })

  const func = exists ? updateSupplier : createSupplier
  return await func(address, whitelisted)
}

const createSupplier = async (address: string, whitelisted: boolean) => {
  await Supplier.create({ address, devices: [], whitelisted })
  logger.log(`Supplier ${address} created`)
}

const updateSupplier = async (address: string, whitelisted: boolean) => {
  await Supplier.updateOne({ address }, { whitelisted })
  logger.log(`Supplier ${address} updated`)
}
