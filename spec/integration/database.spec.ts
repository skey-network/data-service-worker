import '../setup'

import { Database } from '../../src/Database'
import { Device } from '../../models/Device'
import { Supplier } from '../../models/Supplier'
import { Key } from '../../models/Key'
import { Event } from '../../models/Event'

const cases = [
  {
    toString: () => 'device',
    model: Device,
    data: {
      address: 'device_addr',
      supplier: 'supplier_addr',
      owner: 'owner_addr',
      name: 'device name',
      description: 'device_description',
      location: {
        lat: 50.2,
        lng: -0.5,
        alt: 60
      },
      physicalAddress: {
        addressLine1: 'test',
        addressLine2: 'test',
        city: 'test',
        postcode: 'test',
        state: 'test',
        country: 'test',
        number: 'test',
        floor: 'test'
      },
      deviceType: 'other',
      additionalDescription: 'test',
      assetUrl: 'test',
      url: 'test',
      contactInfo: 'test',
      deviceModel: 'test',
      visible: false,
      active: true,
      connected: true,
      custom: {
        powerLevel: 10
      }
    }
  },
  {
    toString: () => 'supplier',
    model: Supplier,
    data: {
      address: 'sss',
      name: 'supplier',
      description: 'desc',
      devices: ['dev1', 'dev2']
    }
  },
  {
    toString: () => 'key',
    model: Key,
    data: {
      assetId: 'key',
      name: 'awesome key',
      device: 'some device',
      owner: 'owner',
      issuer: 'issuer',
      validTo: 123123,
      issueTimestamp: 123123
    }
  },
  {
    toString: () => 'event',
    model: Event,
    data: {
      txHash: 'hash',
      sender: 'sender',
      assetId: 'aaaaaa',
      action: 'self destroy',
      status: 'success'
    }
  }
]

describe('Database integration', () => {
  let database: Database

  beforeAll(async () => {
    database = new Database()
    await database.connect()
  })

  afterAll(async () => {
    await database.disconnect()
  })

  describe.each(cases)('%s', ({ model, data, toString }) => {
    let id: string

    it('validates schema', () => {
      const item = new model(data)
      expect(item.validateSync()).toBe(undefined)
    })

    it(`creates ${toString()}`, async () => {
      const item = new model(data)

      const result = await item.save()
      id = result.id

      expect(result).toBeDefined()
    })

    it('has matching data', async () => {
      const item = await model.findById(id)
      const { __v, createdAt, updatedAt, _id, ...obj } = item?.toObject() as any

      expect(obj).toEqual(data)
    })

    it(`removes ${toString()}`, async () => {
      const item = await model.findByIdAndRemove(id)

      expect(item).toBeDefined()
    })
  })
})
