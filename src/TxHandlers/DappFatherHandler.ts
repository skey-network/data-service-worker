import { AbstractHandler, IteratorItem } from './AbstractHandler'
import { Logger } from '../Logger'
import { Entry, SubscribeEvent } from '../Types'
import config from '../../config'
import { ACTIVE_KEYWORD, SUPPLIER_PREFIX, SUPPLIER_REGEX } from '../Constants'
import { Supplier } from '../../models/Supplier'

export class DappFatherHandler extends AbstractHandler {
  static logger = new Logger(DappFatherHandler.name)

  static async handle(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      await this.handleSingleUpdate(item)
    }
  }

  static async handleSingleUpdate(item: IteratorItem) {
    const { dappFatherAddress } = config.blockchain
    const address = this.bufforToAddress(item.address ?? [])

    if (address !== dappFatherAddress) {
      return this.logger.debug('address is not dapp father')
    }

    for (const entry of item.entries) {
      await this.handleSingleEntry(entry)
    }
  }

  static async handleSingleEntry(entry: Entry) {
    if (!SUPPLIER_REGEX.test(entry.key ?? '')) {
      return this.logger.debug('invalid key')
    }

    const address = entry.key!.replace(SUPPLIER_PREFIX, '')
    const whitelisted = entry.string_value === ACTIVE_KEYWORD

    const exists = await Supplier.exists({ address })

    const func = exists ? this.updateSupplier : this.createSupplier
    return await func.bind(this)(address, whitelisted)
  }

  static async createSupplier(address: string, whitelisted: boolean) {
    await Supplier.create({ address, devices: [], whitelisted })
    this.logger.log(`Supplier ${address} created`)
  }

  static async updateSupplier(address: string, whitelisted: boolean) {
    await Supplier.updateOne({ address }, { whitelisted })
    this.logger.log(`Supplier ${address} updated`)
  }
}
