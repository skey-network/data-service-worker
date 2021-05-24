import {
  SubscribeEvent,
  Entry,
  StateUpdate,
  AssetStateUpdate,
  BalanceUpdate
} from '../Types'
import * as Crypto from '@waves/ts-lib-crypto'
import { Logger } from '../Logger'

export interface DataUpdate {
  address: string
  entries: Entry[]
}

export interface IteratorItem {
  address: string
  entries: Entry[]
}

const logger = new Logger()

export const getStateUpdates = (chunk: SubscribeEvent) => {
  const stateUpdates = chunk.update?.append?.transaction_state_updates

  if (!stateUpdates || stateUpdates?.length === 0) {
    logger.debug('No state updates')
    return []
  }

  return stateUpdates
}

export const getAssetUpdates = (stateUpdates: StateUpdate[]) => {
  const assetUpdates: AssetStateUpdate[] = []

  for (const update of stateUpdates) {
    const updates = update.assets ?? []
    assetUpdates.push(...updates)
  }

  return assetUpdates
}

export const getBalanceUpdates = (stateUpdates: StateUpdate[]) => {
  const balanceUpdates: BalanceUpdate[] = []

  for (const update of stateUpdates) {
    const updates = update.balances ?? []
    balanceUpdates.push(...updates)
  }

  return balanceUpdates
}

export const bufforToAddress = (input?: Crypto.TBinaryIn) => {
  return Crypto.base58Encode(input ?? [])
}

export const getDataEntries = (stateUpdates: StateUpdate[]) => {
  const dataUpdates: DataUpdate[] = []

  for (const update of stateUpdates) {
    const entries = update.data_entries

    if (!entries || entries.length === 0) {
      logger.debug('No data entries')
      return []
    }

    const map = new Map<string, Entry[]>()

    for (const entry of entries) {
      if (!entry.address || !entry.data_entry) continue

      const address = bufforToAddress(entry.address)
      const currentEntries = map.get(address) ?? []
      map.set(address, [...currentEntries, entry.data_entry])
    }

    const newItems = [...map.entries()].map(([address, entries]) => ({
      address,
      entries
    }))

    dataUpdates.push(...newItems)
  }

  return dataUpdates
}

export abstract class AbstractHandler {
  static logger = new Logger(AbstractHandler.name)

  static async handle(chunk: SubscribeEvent) {
    throw new Error('not implemented')
  }

  static bufforToAddress(input: Crypto.TBinaryIn) {
    return Crypto.base58Encode(input)
  }

  static *dataEntriesIterator(chunk: SubscribeEvent): Generator<IteratorItem> {
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
