import '../setup'

import * as helper from '../helper'
import * as Database from '../../src/Database'
import { Organisation } from '../../models/Organisation'
import { handleOrganisationUpdates } from '../../src/TxHandlers/OrganisationHandler'

const cases = helper
  .createMultipleAccounts(3)
  .map((item) => ({ ...item, toString: () => item.address }))

const steps = [
  {
    // GIVEN that listener is working
    // Test name
    toString: () => 'create organisations',
    // Should transfer tokens before or not
    transfer: true,
    // WHEN entries stored in blockchain
    entries: (address: string) => [{ key: 'type', value: 'organisation' }],
    // THEN expect this in database
    expected: (address: string) => ({
      address,
      name: undefined,
      description: undefined,
      whitelisted: false
    })
  },
  {
    toString: () => 'update organisations',
    transfer: false,
    entries: (address: string) => [
      { key: 'name', value: 'test name' },
      { key: 'description', value: 'test desc' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test name',
      description: 'test desc',
      whitelisted: false
    })
  }
]

describe('OrganisationHandler - integration', () => {
  let cancelSubscription = async () => {}

  beforeAll(async () => {
    await Database.connect()

    cancelSubscription = await helper.getListenerInstance(handleOrganisationUpdates)
  })

  afterAll(async () => {
    await cancelSubscription()
    await Database.disconnect()
  })

  describe.each(steps)('%s', (step) => {
    beforeAll(async () => {
      if (step.transfer) {
        await Promise.all(cases.map((org) => helper.sponsor(org.address)))
      }

      await Promise.all(
        cases.map((org) => {
          return helper.lib.insertData(step.entries(org.address), org.seed)
        })
      )

      await helper.delay(2000)
    })

    test.each(cases)('%s', async (args) => {
      const expected = step.expected(args.address)
      const doc = (await Organisation.findOne({ address: args.address }))!

      const picked = ((obj) => ({
        address: obj.address,
        name: obj.name,
        description: obj.description,
        whitelisted: obj.whitelisted
      }))(doc)

      expect(picked).toEqual(expected)
    })
  })
})
