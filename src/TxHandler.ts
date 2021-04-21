import { Injectable } from 'injection-js'
import config from '../config'
import { _waves_DataTransactionData_DataEntry } from '../proto/interfaces/waves/DataTransactionData'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
import { _waves_events_StateUpdate_DataEntryUpdate } from '../proto/interfaces/waves/events/StateUpdate'
import { Common } from './Common'
import * as Constants from './Constants'
import { Db } from './Db'
import { Logger } from './Logger'

@Injectable()
export class TxHandler {
  constructor(private common: Common, private logger: Logger, private db: Db) {}

  *dataEntriesIterator(chunk: SubscribeEvent) {
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

      for (const entry of entries) {
        yield entry
      }
    }
  }

  async handleAddDevices(chunk: SubscribeEvent) {
    const entries = this.dataEntriesIterator(chunk)

    for (const entry of entries) {
      const dapp = this.common.bufforToAddress(entry.address ?? [])

      if (config.blockchain.dapp !== dapp) {
        this.logger.debug('not a dapp')
        continue
      }

      if (!Constants.deviceRegex.test(entry.data_entry?.key ?? '')) {
        this.logger.debug('invalid entry key')
        continue
      }

      if (entry.data_entry?.string_value !== Constants.active) {
        this.logger.debug('invalid entry value')
        continue
      }

      const devicePrefix = 'device_'
      const address = entry.data_entry.key!.replace(devicePrefix, '')

      try {
        await this.db.deviceRepository.save({ address, dapp, owner: dapp })
        this.logger.log(`Device ${address} created`)
      } catch (err) {
        this.logger.error(`Cannot create device ${address}`)
        this.logger.error(err.message)
      }
    }
  }

  async handleUpdateDevices(chunk: SubscribeEvent) {
    const entries = this.dataEntriesIterator(chunk)

    for (const entry of entries) {
      const address = this.common.bufforToAddress(entry.address ?? [])

      if (!this.common.isValidDeviceEntryKey(entry.data_entry?.key ?? '')) {
        this.logger.debug('invalid entry key')
        continue
      }

      const device = await this.db.deviceRepository.findOne({ address })

      if (!device) {
        this.logger.debug('device does not exist')
        continue
      }

      // TODO
      await this.db.deviceRepository.findOneAndUpdate(
        { address: device.address },
        { $set: { name: 'test name' } },
        { upsert: true }
      )

      this.logger.log(`Should update device ${address}`)
    }
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
