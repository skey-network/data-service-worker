import '../setup'

import { DatabaseClient } from '../../src/Clients/DatabaseClient'
import { Collection } from 'mongoose'
import config from '../../config'

const cases = [
  {
    toString: () => 'device',
    collectionName: 'devices',
    data: { address: 'device' }
  },
  {
    toString: () => 'supplier',
    collectionName: 'suppliers',
    data: { address: 'supplier' }
  },
  {
    toString: () => 'organisation',
    collectionName: 'organisations',
    data: { address: 'organisation' }
  },
  {
    toString: () => 'key',
    collectionName: 'keys',
    data: { assetId: 'key' }
  },
  {
    toString: () => 'event',
    collectionName: 'events',
    data: { txHash: 'key' }
  }
]

describe('Database integration', () => {
  let databaseClient: DatabaseClient

  beforeAll(async () => {
    databaseClient = new DatabaseClient(config().db)
    await databaseClient.connect()
  })

  afterAll(async () => {
    await databaseClient.disconnect()
  })

  describe.each(cases)('%s', ({ collectionName, data, toString }) => {
    let collection: Collection

    beforeEach(async () => {
      collection = await databaseClient.connection.collection(collectionName)
    })

    it(`creates ${toString()}`, async () => {
      await collection.insertOne(data, { forceServerObjectId: true })
    })

    it('has matching data', async () => {
      const result = await collection.findOne(data)
      const { _id, ...obj } = result
      expect(obj).toEqual(data)
    })

    it(`removes ${toString()}`, async () => {
      const { result } = await collection.deleteOne(data)
      expect(result.n).toBe(1)
    })
  })
})
