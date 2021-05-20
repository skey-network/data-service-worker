import { IteratorItem, AbstractHandler } from './AbstractHandler'
import { SubscribeEvent, Entry } from '../Types'
import config from '../../config'
import {
  ACTIVE_KEYWORD,
  DEVICE_PREFIX,
  DEVICE_REGEX,
  INACTIVE_KEYWORD
} from '../Constants'
import { Logger } from '../Logger'
import { Device } from '../../models/Device'

const { dapp } = config.blockchain

// This handles adding and removing devices from dapp
// Possible outcome is updating device or creating empty in db

export class UpdateSupplierHandler extends AbstractHandler {
  static logger = new Logger(UpdateSupplierHandler.name)

  static async handle(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      await this.handleSingleUpdate(item)
    }
  }

  static async handleSingleUpdate(item: IteratorItem) {
    const address = this.bufforToAddress(item.address ?? []) // dappAddress

    if (address !== dapp) {
      this.logger.debug('address is not a dapp')
      return
    }

    for (const entry of item.entries) {
      await this.handleSingleEntry(entry)
    }
  }

  static async handleSingleEntry(entry: Entry) {
    if (DEVICE_REGEX.test(entry.key ?? '')) {
      this.logger.debug('invalid entry key')
      return
    }

    if (
      entry.string_value !== ACTIVE_KEYWORD &&
      entry.string_value !== INACTIVE_KEYWORD
    ) {
      this.logger.debug('invalid entry value')
      return
    }

    const address = entry.key!.replace(DEVICE_PREFIX, '')

    await this.save(address, entry.string_value)
  }

  static async save(address: string, status: string) {
    const whitelisted = status === ACTIVE_KEYWORD

    const device = await Device.findOne({ address })

    if (device) {
      await Device.updateOne({ address }, { whitelisted })
      this.logger.debug(`Updated device ${address} dapp whitelist`)
    } else {
      await Device.create({ address, whitelisted })
      this.logger.log(`Created device ${address} from dapp whitelist`)
    }
  }
}
