import { Injectable } from 'injection-js'
import config from '../config'
import { _waves_DataTransactionData_DataEntry as Entry } from '../proto/interfaces/waves/DataTransactionData'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
// import { _waves_events_StateUpdate_DataEntryUpdate } from '../proto/interfaces/waves/events/StateUpdate'
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

      const map = new Map<string, Entry[]>()

      for (const entry of entries) {
        if (!entry.address || !entry.data_entry) continue

        const address = this.common.bufforToAddress(entry.address)

        const currentEntries = map.get(address) ?? []

        map.set(address, [...currentEntries, entry.data_entry])
      }

      for (const [address, entries] of map) {
        yield { address, entries }
      }
    }
  }

  async handleAddDevices(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      const dapp = this.common.bufforToAddress(item.address ?? [])

      if (config.blockchain.dapp !== dapp) {
        this.logger.debug('not a dapp')
        continue
      }

      for (const entry of item.entries) {
        if (!Constants.deviceRegex.test(entry.key ?? '')) {
          this.logger.debug('invalid entry key')
          continue
        }

        if (entry.string_value !== Constants.active) {
          this.logger.debug('invalid entry value')
          continue
        }

        const devicePrefix = 'device_'
        const address = entry.key!.replace(devicePrefix, '')

        try {
          await this.db.deviceRepository.save({
            address,
            dapp,
            owner: dapp,
            whitelisted: true
          })
          this.logger.log(`Device ${address} created`)
        } catch (err) {
          this.logger.error(`Cannot create device ${address}`)
          this.logger.error(err.message)
        }
      }
    }
  }

  async handleUpdateDevices(chunk: SubscribeEvent) {
    const items = this.dataEntriesIterator(chunk)

    for (const item of items) {
      const address = this.common.bufforToAddress(item.address ?? [])

      const updates = item.entries
        .map((entry) => this.common.parseDeviceEntry(entry))
        .filter((entry) => entry)

      const update = Object.assign({}, ...updates)

      if (updates.length === 0) {
        this.logger.debug('invalid entry keys')
        continue
      }

      const device = await this.db.deviceRepository.findOne({ address })

      if (device) {
        await this.db.deviceRepository.findOneAndUpdate(
          { address: device.address },
          { $set: update },
          { upsert: true }
        )
      } else {
        // Create new device only if dapp is in data entries

        if (!update.dapp) {
          this.logger.debug('device dapp not specified')
          continue
        }

        await this.db.deviceRepository.save({ address, ...update, whitelisted: false })
      }

      this.logger.log(`Device ${address} updated`)
    }
  }
}
