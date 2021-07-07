import { SubscribeEvent, Entry, StateUpdate } from './Types'
import * as Crypto from '@waves/ts-lib-crypto'

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

export interface ParsedUpdate {
  height: number
  ids: string[]
  entries: EntriesForAddress[]
}

export const getIds = (chunk: SubscribeEvent) => {
  const buffers = chunk.update?.append?.transaction_ids ?? []
  return buffers.filter((buffer) => buffer).map((buffer) => Crypto.base58Encode(buffer))
}

export const parseEntry = (entry: Entry): ParsedEntry | null => {
  if (!entry) return null

  if (!entry.key) {
    // this.logger.error('entry has no key')
    return null
  }

  const withKey = (value: any) => ({ key: entry.key!, value })

  switch (entry.value) {
    case 'binary_value':
      return withKey(Crypto.base58Encode(entry.binary_value!))
    case 'bool_value':
      return withKey(entry.bool_value)
    case 'int_value':
      return withKey(BigInt(entry.int_value as string))
    case 'string_value':
      return withKey(entry.string_value)
    default:
      return withKey(null)
  }
}

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
    entries: transformEntries(stateUpdates)
  }
}
