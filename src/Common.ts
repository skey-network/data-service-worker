import { Injectable } from 'injection-js'
import * as Crypto from '@waves/ts-lib-crypto'
import * as Constants from './Constants'

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

  isValidDeviceEntryKey(key: string) {
    return Constants.deviceEntryKeys.findIndex((regex) => regex.test(key)) !== -1
  }
}
