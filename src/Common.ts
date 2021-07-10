import * as Crypto from '@waves/ts-lib-crypto'
import { readFileSync } from 'fs'
import config from '../config'
import { Logger } from './Logger'

const logger = new Logger('Common')

// Redis transforms JS buffer into this
interface JSONBuffer {
  type: 'Buffer'
  data: number[]
}

type BinaryInput = Buffer | Uint8Array | JSONBuffer | string

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

// Depending on whether task is run via redis or main process
// the input is defferent
export const normalizeBinaryInput = (input?: BinaryInput) => {
  if (input instanceof Buffer) return input

  if (input instanceof Uint8Array) return Buffer.from(input)

  if (typeof input === 'string') {
    return Buffer.from(Crypto.base58Decode(input))
  }

  if (input?.data) return Buffer.from(input.data)

  logger.error('Unexpected buffer input', input)
  return Buffer.from([])
}

export const bufferToString = (input?: BinaryInput) => {
  return Crypto.base58Encode(normalizeBinaryInput(input))
}

export const publicKeyToAddress = (input?: BinaryInput) => {
  return Crypto.address(
    { publicKey: normalizeBinaryInput(input) },
    config().blockchain.chainId
  )
}

// export const publicKeyHashToAddress = (hash: Buffer, chainId: string) => {
//   const entity = Buffer.from([1])
//   const id = Buffer.from([chainId.charCodeAt(0)])
//   const sum = Buffer.concat([entity, id, hash])
//   const checksum = Crypto.keccak(Crypto.blake2b(sum)).slice(0, 4)
//   return Crypto.base58Encode(Buffer.concat([sum, checksum]))
// }
