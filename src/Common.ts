import { Injectable } from 'injection-js'
import * as Crypto from '@waves/ts-lib-crypto'
import { _waves_DataTransactionData_DataEntry as Entry } from '../proto/interfaces/waves/DataTransactionData'

const keysMap = Object.freeze({
  rootStrings: [
    'name',
    'type',
    'description',
    'additional_description',
    'asset_url',
    'url',
    'contact',
    'floor',
    'dapp',
    'owner',
    'device_model'
  ],
  addressStrings: [
    'address_line_1',
    'address_line_2',
    'city',
    'postcode',
    'state',
    'country',
    'number'
  ],
  location: ['lat', 'lng', 'alt'],
  booleans: ['visible', 'active', 'connected']
})

@Injectable()
export class Common {
  bufforToAddress(input: Crypto.TBinaryIn) {
    return Crypto.base58Encode(input)
  }

  delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  snakeToCamel(str: string) {
    return str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase())
  }

  parseDeviceEntry(entry: Entry): Object | null {
    if (!entry.key) return null

    if (keysMap.rootStrings.includes(entry.key)) {
      return { [this.snakeToCamel(entry.key)]: entry.string_value }
    }

    if (keysMap.addressStrings.includes(entry.key)) {
      return { [`physicalAddress.${this.snakeToCamel(entry.key)}`]: entry.string_value }
    }

    if (keysMap.location.includes(entry.key)) {
      return { [`location.${entry.key}`]: Number(entry.string_value ?? '0') }
    }

    if (keysMap.booleans.includes(entry.key)) {
      if (entry.value === 'bool_value') {
        return { [entry.key]: entry.bool_value }
      }

      if (entry.value === 'string_value') {
        return { [entry.key]: entry.string_value === 'true' }
      }
    }

    if (/^custom_/.test(entry.key)) {
      return { [`custom.${entry.key.replace('custom_', '')}`]: entry.string_value }
    }

    return null
  }
}
