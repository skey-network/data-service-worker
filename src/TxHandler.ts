import * as Crypto from '@waves/ts-lib-crypto'
import { Injectable } from 'injection-js'
import { _waves_DataTransactionData_DataEntry } from '../proto/interfaces/waves/DataTransactionData'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
import { _waves_events_StateUpdate_DataEntryUpdate } from '../proto/interfaces/waves/events/StateUpdate'
import * as Constants from './Constants'

export interface Ticket {
  accepted: boolean
  error?: string
}

export interface Entry {
  key: string
  value: string | boolean
}

// TODO hardcoded list of dapps initially
// TODO iterate through data entries function

@Injectable()
export class TxHandler {
  handleAddDevices(chunk: SubscribeEvent): Ticket[] {
    const tickets: Ticket[] = []

    const stateUpdates = chunk.update?.append?.transaction_state_updates

    if (!stateUpdates || stateUpdates?.length === 0) {
      return [{ accepted: false, error: 'no state updates' }]
    }

    stateUpdates.forEach((update) => {
      const entries = update.data_entries

      if (!entries || entries.length === 0) {
        return [{ accepted: false, error: 'no data entries' }]
      }

      entries.forEach((entry) => {
        const dapp = Crypto.base58Encode(entry.address ?? [])
        // check if address is a dapp

        if (!Constants.deviceRegex.test(entry.data_entry?.key ?? '')) {
          tickets.push({ accepted: false, error: 'invalid entry key' })
          return
        }

        if (entry.data_entry?.string_value !== Constants.ACTIVE) {
          tickets.push({ accepted: false, error: 'invalid entry value' })
          return
        }

        const devicePrefix = 'device_'
        const address = entry.data_entry.key!.replace(devicePrefix, '')

        tickets.push({ accepted: true })

        console.log(`Add device ${address} to dapp ${dapp}`)
      })
    })

    return tickets
  }

  // parseEntry(entry: _waves_DataTransactionData_DataEntry): Entry {
  //   switch (entry.value) {
  //     case 'string_value':
  //       return { key: entry.key!, value: entry.string_value ?? '' }
  //     case 'bool_value':
  //       return { key: entry.key!, value: entry.bool_value ?? false }
  //     case 'int_value':
  //       return { key: entry.key!, value: entry.int_value?.toString() ?? '' }
  //     case 'binary_value':
  //       return { key: entry.key!, value: entry.binary_value?.toString() ?? '' }
  //     default:
  //       throw new Error('Invalid data entry format')
  //   }
  // }
}
