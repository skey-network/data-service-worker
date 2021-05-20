import { SubscribeEvent, Entry } from '../Types'
import * as Crypto from '@waves/ts-lib-crypto'
import { Logger } from '../Logger'

export interface IteratorItem {
  address: string
  entries: Entry[]
}

export abstract class AbstractHandler {
  protected logger = new Logger(AbstractHandler.name)

  public async handle(chunk: SubscribeEvent) {
    throw new Error('not implemented')
  }

  public bufforToAddress(input: Crypto.TBinaryIn) {
    return Crypto.base58Encode(input)
  }

  public *dataEntriesIterator(chunk: SubscribeEvent): Generator<IteratorItem> {
    const stateUpdates = chunk.update?.append?.transaction_state_updates

    if (!stateUpdates || stateUpdates?.length === 0) {
      this.logger.debug('No state updates')
      return
    }

    for (const update of stateUpdates) {
      const entries = update.data_entries

      if (!entries || entries.length === 0) {
        this.logger.debug('No data entries')
        return
      }

      const map = new Map<string, Entry[]>()

      for (const entry of entries) {
        if (!entry.address || !entry.data_entry) continue

        const address = this.bufforToAddress(entry.address)

        const currentEntries = map.get(address) ?? []

        map.set(address, [...currentEntries, entry.data_entry])
      }

      for (const [address, entries] of map) {
        yield { address, entries }
      }
    }
  }
}
