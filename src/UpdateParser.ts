import { SubscribeEvent, Entry, StateUpdate } from './Types'
import * as Crypto from '@waves/ts-lib-crypto'
import { _waves_events_StateUpdate_AssetDetails } from '../proto/interfaces/waves/events/StateUpdate'

export interface DataUpdate {
  address: string
  updates: Entry[]
}

export interface ParsedEntry {
  key: string
  value: string | number | boolean | null
}

export interface EntriesForAddress {
  address: string
  entries: ParsedEntry[]
}

export interface BalanceUpdate {
  address: string
  assetId: string
  amount: number
}

export interface AssetUpdate extends _waves_events_StateUpdate_AssetDetails {
  asset_id: string
  issuer: string
}

export interface ParsedUpdate {
  height: number
  ids: string[]
  entries: EntriesForAddress[]
  assets: AssetUpdate[]
  balances: BalanceUpdate[]
}

export const getIds = (chunk: SubscribeEvent) => {
  const buffers = chunk.update?.append?.transaction_ids ?? []
  return buffers.filter((buffer) => buffer).map((buffer) => Crypto.base58Encode(buffer))
}

export const parseEntry = (entry: Entry): ParsedEntry | null => {
  if (!entry?.key) return null

  const withKey = (value: any) => ({ key: entry.key!, value })

  switch (entry.value) {
    case 'binary_value':
      return withKey(Crypto.base58Encode(entry.binary_value!))
    case 'bool_value':
      return withKey(entry.bool_value)
    case 'int_value':
      return withKey(Number((entry.int_value as string) ?? '0'))
    case 'string_value':
      return withKey(entry.string_value)
    default:
      return withKey(null)
  }
}

export const getBalanceUpdates = (stateUpdates: StateUpdate[]) =>
  stateUpdates
    .map((stateUpdate) => stateUpdate.balances!)
    .flat()
    .filter((balance) => balance)!
    .map((balance) => ({
      address: Crypto.base58Encode(balance.address!),
      assetId: Crypto.base58Encode(balance.amount_after?.asset_id!),
      amount: Number((balance.amount_after?.amount as string) ?? 0)
    }))

export const getAssetUpdates = (stateUpdates: StateUpdate[]) =>
  stateUpdates
    .map((stateUpdate) => stateUpdate.assets!)
    .flat()
    .filter((asset) => asset)
    .map((asset) => asset.after!)
    .filter((after) => after)
    .map((after) => ({
      ...after,
      asset_id: Crypto.base58Encode(after.asset_id!),
      issuer: Crypto.base58Encode(after.issuer!)
    }))

export const transformEntries = (stateUpdates: StateUpdate[]): EntriesForAddress[] => {
  return Object.entries(
    stateUpdates
      .map((x) => x.data_entries ?? [])
      .flat()
      .reduce((prev, curr) => {
        const address = Crypto.base58Encode(curr.address!)

        return {
          ...prev,
          [address]: [...(prev[address] ?? []), parseEntry(curr.data_entry!)]
        }
      }, {} as any)
  ).map(([address, entries]) => ({
    address,
    entries
  })) as any
}

export const getStateUpdates = (chunk: SubscribeEvent) => {
  const stateUpdates = chunk.update?.append?.transaction_state_updates
  if (!stateUpdates?.length) return []

  return stateUpdates
}

export const parseUpdate = (chunk: SubscribeEvent): ParsedUpdate | null => {
  if (!chunk) return null

  const ids = getIds(chunk)
  if (!ids.length) return null

  const stateUpdates = getStateUpdates(chunk)

  return {
    height: chunk.update?.height ?? 0,
    ids,
    entries: transformEntries(stateUpdates),
    assets: getAssetUpdates(stateUpdates),
    balances: getBalanceUpdates(stateUpdates)
  }
}
