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
      { key: 'name', value: 'dunno yet' },
      { key: 'lat', value: '20.34' },
      { key: 'lng', value: '69.420' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'dunno yet',
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
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
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
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
      whitelist: [
        '7pbRiBQXZLdifutZJz8brpPtHJEmZyJpSk2nt3HKmje',
        '2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn'
      ],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
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
      whitelist: ['2CC5MxkAP6DfrqSu82ZbjFvLfvoHQ4NVgo5b4MGwKtmn'],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
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
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
    })
  },
  {
    toString: () => 'update boolean',
    entries: (address: string) => [
      { key: 'active', value: true },
      { key: 'connected', value: true },
      { key: 'visible', value: false }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      active: true,
      connected: true,
      visible: false,
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
    })
  },
  {
    toString: () => 'update boolean string',
    entries: (address: string) => [
      { key: 'active', value: 'false' },
      { key: 'connected', value: 'false' },
      { key: 'visible', value: 'true' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      active: false,
      connected: false,
      visible: true,
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
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
      active: false,
      connected: false,
      visible: true,
      whitelist: [],
      lat: 20.34,
      lng: 69.42,
      location: {
        type: 'Point',
        coordinates: [69.42, 20.34]
      }
    })
  },
  {
    toString: () => 'update device localisation',
    entries: (address: string) => [
      { key: 'lat', value: '12.345' },
      { key: 'lng', value: '67.89' }
    ],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      active: false,
      connected: false,
      visible: true,
      whitelist: [],
      lat: 12.345,
      lng: 67.89,
      location: {
        type: 'Point',
        coordinates: [67.89, 12.345]
      }
    })
  },
  {
    toString: () => 'update only one of device localisation',
    entries: (address: string) => [{ key: 'lat', value: '54.321' }],
    expected: (address: string) => ({
      address: address,
      name: 'test_device',
      description: 'test_desc',
      active: false,
      connected: false,
      visible: true,
      whitelist: [],
      lat: 54.321,
      lng: 67.89,
      location: {
        type: 'Point',
        coordinates: [67.89, 54.321]
      }
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
