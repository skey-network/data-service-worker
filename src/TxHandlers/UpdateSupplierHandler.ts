import { IteratorItem, AbstractHandler } from './AbstractHandler'
import { SubscribeEvent, Entry } from '../Types'
import { MongoRepository } from 'typeorm'
import config from '../../config'
import {
  ACTIVE_KEYWORD,
  DEVICE_PREFIX,
  DEVICE_REGEX,
  INACTIVE_KEYWORD
} from '../Constants'
import { Logger } from '../Logger'

const { dapp } = config.blockchain

// This handles adding and removing devices from dapp
// Possible outcome is updating device or creating empty in db

export class UpdateSupplierHandler extends AbstractHandler {
  protected logger = new Logger(UpdateSupplierHandler.name)

  constructor(private repository: MongoRepository<Device>) {
    super()
  }

  public async handle(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      await this.handleSingleUpdate(item)
    }
  }

  private async handleSingleUpdate(item: IteratorItem) {
    const address = this.bufforToAddress(item.address ?? []) // dappAddress

    if (address !== dapp) {
      this.logger.debug('address is not a dapp')
      return
    }

    for (const entry of item.entries) {
      await this.handleSingleEntry(entry)
    }
  }

  private async handleSingleEntry(entry: Entry) {
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

  private async save(address: string, status: string) {
    const whitelisted = status === ACTIVE_KEYWORD

    const device = await this.repository.findOne({ address })

    if (device) {
      await this.repository.findOneAndUpdate({ address }, { whitelisted })
      this.logger.debug(`Updated device ${address} dapp whitelist`)
    } else {
      await this.repository.insertOne({ address, whitelisted })
      this.logger.log(`Created device ${address} from dapp whitelist`)
    }
  }
}
