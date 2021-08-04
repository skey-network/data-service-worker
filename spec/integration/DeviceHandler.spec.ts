import '../setup'

import { DeviceHandler } from '../../src/TxHandlers/DeviceHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestContext'
import config from '../../config'
import { getInstance } from '../ExtendedLib'

const lib = getInstance(config())

const cases = [
  {
    toString: () => 'invalid type',
    entries: () => [{ key: 'type', value: 'supplier' }],
    expected: () => null
  },
  {
    toString: () => 'create device',
    entries: (address: string) => [
      { key: 'type', value: 'device' },
      { key: 'name', value: 'dunno yet' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'dunno yet',
      keys: []
    })
  },
  {
    toString: () => 'update device',
    entries: (address: string) => [
      { key: 'name', value: 'test_device' },
      { key: 'description', value: 'test_desc' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      keys: []
    })
  },
  {
    toString: () => 'whitelist keys',
    entries: (address: string) => [
      { key: 'key_7pbRiBQXZLdifutZJz8brpPtHJEmZyJpSk2nt3HKmje', value: 'active' },
      { key: 'key_2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn', value: 'active' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      keys: [
        '7pbRiBQXZLdifutZJz8brpPtHJEmZyJpSk2nt3HKmje',
        '2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn'
      ]
    })
  },
  {
    toString: () => 'blacklist key 1',
    entries: (address: string) => [
      { key: 'key_7pbRiBQXZLdifutZJz8brpPtHJEmZyJpSk2nt3HKmje', value: 'inactive' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      keys: ['2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn']
    })
  },
  {
    toString: () => 'blacklist key 2',
    entries: (address: string) => [
      { key: 'key_2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn', value: 'inactive' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      keys: []
    })
  },
  {
    toString: () => 'update invalid values',
    entries: (address: string) => [
      { key: 'other', value: 'hello there' },
      { key: 'some_bool', value: true },
      { key: 'some_int', value: 123 },
      { key: 'type', value: 'supplier' },
      { key: 'version', value: true }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      keys: []
    })
  }
]

describe('DeviceHandler', () => {
  let ctx: TxHandlerTestContext<DeviceHandler>

  const getOne = async (address: string) =>
    ctx.db.connection.collection('devices').findOne({ address })

  const device = lib.createAccount()

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(DeviceHandler)

    await lib.sponsor(device.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it.each(cases)('%s', async (args) => {
    await lib.insertData(args.entries(device.address), device.seed)

    const doc = await getOne(device.address)

    if (!args.expected(device.address)) {
      return expect(doc).toBe(null)
    }

    const { _id, __v, createdAt, updatedAt, ...data } = doc

    expect(data).toEqual(args.expected(device.address))
  })
})
