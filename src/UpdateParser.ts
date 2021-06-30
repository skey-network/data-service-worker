import {
  SubscribeEvent,
  Entry,
  StateUpdate,
  AssetStateUpdate,
  BalanceUpdate
} from './Types'
import { createLogger } from './Logger'
import { bufferToString } from './Common'

const logger = createLogger('UpdateParser')

export interface DataUpdate {
  address: string
  entries: Entry[]
}

export interface Update {
  height: number
  dataUpdates: DataUpdate[]
  assetUpdates: AssetStateUpdate[]
  balanceUpdates: BalanceUpdate[]
  ids: Uint8Array[]
}

export const parseUpdate = (chunk: SubscribeEvent): Update | null => {
  try {
    const stateUpdates = getStateUpdates(chunk)

    return {
      height: chunk.update?.height ?? 0,
      dataUpdates: getDataUpdates(stateUpdates),
      assetUpdates: getAssetUpdates(stateUpdates),
      balanceUpdates: getBalanceUpdates(stateUpdates),
      ids: getIds(chunk)
    }
  } catch (err) {
    logger.error('Error while parsing update')
    logger.error(err)
    return null
  }
}

export const getIds = (chunk: SubscribeEvent): Uint8Array[] => {
  return (chunk.update?.append?.transaction_ids ?? []) as Uint8Array[]
}

export const getStateUpdates = (chunk: SubscribeEvent) => {
  const stateUpdates = chunk.update?.append?.transaction_state_updates

  if (!stateUpdates || stateUpdates?.length === 0) {
    // logger.debug('No state updates')
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

export const getDataUpdates = (stateUpdates: StateUpdate[]) => {
  const dataUpdates: DataUpdate[] = []

  for (const update of stateUpdates) {
    const entries = update.data_entries

    if (!entries || entries.length === 0) {
      // logger.debug('No data entries')
      return []
    }

    const map = new Map<string, Entry[]>()

    for (const entry of entries) {
      if (!entry.address || !entry.data_entry) continue

      const address = bufferToString(entry.address)
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
