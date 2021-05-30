import * as Crypto from '@waves/ts-lib-crypto'
import { readFileSync } from 'fs'

export const scripts = {
  device: readFileSync('./artifacts/device.txt', 'utf-8'),
  supplier: readFileSync('./artifacts/supplier.txt', 'utf-8'),
  organisation: readFileSync('./artifacts/organisation.txt', 'utf-8')
}

export const delay = (timeout: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeout)
  })
}

export const bufforToAddress = (input?: Crypto.TBinaryIn) => {
  return Crypto.base58Encode(input ?? [])
}
