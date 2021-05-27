import '../setup'

import * as helper from '../helper'
import * as Database from '../../src/Database'
import { handleDappFatherUpdates } from '../../src/TxHandlers/DappFatherHandler'
import { Supplier } from '../../models/Supplier'

const cases = helper
  .createMultipleAccounts(3)
  .map((item) => ({ ...item, toString: () => item.address }))

const steps = [
  {
    // GIVEN that listener is working
    // Test name
    toString: () => 'whitelist suppliers',
    // Should transfer tokens before or not
    transfer: true,
    // WHEN entries stored in blockchain
    entries: (address: string) => ({
      key: `supplier_${address}`,
      value: 'active'
    }),
    // THEN expect this in database
    expected: (address: string) => ({
      address,
      name: undefined,
      description: undefined,
      whitelisted: true,
      devices: []
    })
  },
  {
    toString: () => 'blacklist suppliers',
    transfer: false,
    entries: (address: string) => ({
      key: `supplier_${address}`,
      value: 'inactive'
    }),
    expected: (address: string) => ({
      address,
      name: undefined,
      description: undefined,
      whitelisted: false,
      devices: []
    })
  }
]

describe('DeviceHandler - integration', () => {
  let cancelSubscription = async () => {}

  beforeAll(async () => {
    await Database.connect()

    cancelSubscription = await helper.getListenerInstance(handleDappFatherUpdates)
  })

  afterAll(async () => {
    await cancelSubscription()
    await Database.disconnect()
  })

  describe.each(steps)('%s', (step) => {
    beforeAll(async () => {
      if (step.transfer) {
        await Promise.all(cases.map((c) => helper.sponsor(c.address)))
      }

      await helper.lib.insertData(
        cases.map((c) => step.entries(c.address)),
        helper.seeds.dappFather
      )

      await helper.delay(2000)
    })

    test.each(cases)('%s', async (args) => {
      const expected = step.expected(args.address)
      const doc = (await Supplier.findOne({ address: args.address }))!

      const picked = ((obj) => ({
        address: obj.address,
        name: obj.name,
        description: obj.description,
        whitelisted: obj.whitelisted,
        devices: Array.from(obj.devices)
      }))(doc)

      expect(picked).toEqual(expected)
    })
  })
})
