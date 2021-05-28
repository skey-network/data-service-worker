import * as Crypto from '@waves/ts-lib-crypto'
import { readFileSync } from 'fs'
import config from '../config'

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

export const bufferToString = (input?: Crypto.TBinaryIn) => {
  return Crypto.base58Encode(input ?? [])
}

export const publicKeyToAddress = (input?: Crypto.TBinaryIn) => {
  return Crypto.address({ publicKey: input ?? [] }, config().blockchain.chainId)
}
