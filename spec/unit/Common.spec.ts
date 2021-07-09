import * as Crypto from '@waves/ts-lib-crypto'
import * as Common from '../../src/Common'

describe('Common', () => {
  // describe('publicKeyToAddress', () => {
  //   const cases = [
  //     {
  //       toString: () => 'case 1',
  //       input: ['2c1rWn6HJjgjCgqNETC4YiEE3AKw', 'R'],
  //       expected: '3M4BrYgdrVAQTNnM783HfkXBmQe9uwXrKAx'
  //     },
  //     {
  //       toString: () => 'case 2',
  //       input: ['2XYY79KkfNdK8NWQ8mfuChRUd7eH', 'R'],
  //       expected: '3MM2pyHZJKdxYVSqRLdrJQweb9ckhvqLzEr'
  //     }
  //   ]

  //   it.each(cases)('%s', ({ input, expected }) => {
  //     const hash = Buffer.from(Crypto.base58Decode(input[0]))
  //     const result = Common.publicKeyHashToAddress(hash, input[1])

  //     expect(result).toBe(expected)
  //   })
  // })

  describe('scripts', () => {
    it('are defined', () => {
      expect(Common.scripts.device.length)
      expect(Common.scripts.organisation.length)
      expect(Common.scripts.supplier.length)
    })
  })

  describe('normalizeBinaryInput', () => {
    const cases = [
      {
        toString: () => 'empty',
        input: undefined,
        expected: Buffer.from([])
      },
      {
        toString: () => 'buffer',
        input: Buffer.from([42, 42]),
        expected: Buffer.from([42, 42])
      },
      {
        toString: () => 'json buffer',
        input: {
          type: 'Buffer' as 'Buffer',
          data: [1, 2]
        },
        expected: Buffer.from([1, 2])
      },
      {
        toString: () => 'uint8array',
        input: new Uint8Array([8]),
        expected: Buffer.from([8])
      },
      {
        toString: () => 'string',
        input: 'aaa',
        expected: Buffer.from([1, 185, 63])
      }
    ]

    it.each(cases)('%s', ({ input, expected }) => {
      expect(expected).toBeInstanceOf(Buffer)
      expect(Common.normalizeBinaryInput(input)).toEqual(expected)
    })
  })
})
