import '../setup'

import * as Database from '../../src/Clients/DatabaseClient'
import { Factory } from '../factory'

import { Device } from '../../models/Device'
import { Supplier } from '../../models/Supplier'
import { Key } from '../../models/Key'
import { Event } from '../../models/Event'

const cases = [
  {
    toString: () => 'device',
    model: Device,
    data: Factory.createSingleDevice().props
  },
  {
    toString: () => 'supplier',
    model: Supplier,
    data: Factory.createSingleSupplier().props
  },
  {
    toString: () => 'key',
    model: Key,
    data: Factory.createSingleKey().props
  },
  {
    toString: () => 'event',
    model: Event,
    data: Factory.createSingleEvent().props
  }
]

describe('Database integration', () => {
  beforeAll(async () => {
    await Database.connect()
  })

  afterAll(async () => {
    await Database.disconnect()
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
