import '../setup'

import * as helper from '../helper'
import { Database } from '../../src/Database'
import { Supplier } from '../../models/Supplier'
import { UpdateSupplierHandler } from '../../src/TxHandlers/UpdateSupplierHandler'
import { SubscribeEvent } from '../../src/Types'

const cases = helper
  .createMultipleAccounts(3)
  .map((item) => ({ ...item, toString: () => item.address }))

const steps = [
  {
    // GIVEN that listener is working
    // Test name
    toString: () => 'create suppliers',
    // Should transfer tokens before or not
    transfer: true,
    // WHEN entries stored in blockchain
    entries: (address: string) => [{ key: 'type', value: 'supplier' }],
    // THEN expect this in database
    expected: (address: string) => ({
      address,
      name: undefined,
      description: undefined,
      whitelisted: false,
      devices: []
    })
  },
  {
    toString: () => 'update suppliers',
    transfer: false,
    entries: (address: string) => [
      { key: 'name', value: 'test name' },
      { key: 'description', value: 'test desc' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test name',
      description: 'test desc',
      whitelisted: false,
      devices: []
    })
  },
  {
    toString: () => 'whitelist devices',
    transfer: false,
    entries: (address: string) => [
      { key: 'device_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: 'active' },
      { key: 'device_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: 'active' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test name',
      description: 'test desc',
      whitelisted: false,
      devices: [
        '3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv',
        '3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj'
      ]
    })
  },
  {
    toString: () => 'blacklist devices',
    transfer: false,
    entries: (address: string) => [
      { key: 'device_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: 'inactive' },
      { key: 'device_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: 'inactive' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test name',
      description: 'test desc',
      whitelisted: false,
      devices: []
    })
  }
]

describe('SupplierHandler - integration', () => {
  let cancelSubscription = async () => {}

  beforeAll(async () => {
    await Database.connect()

    cancelSubscription = await helper.getListenerInstance((chunk: SubscribeEvent) =>
      UpdateSupplierHandler.handle(chunk)
    )
  })

  afterAll(async () => {
    await cancelSubscription()
    await Database.disconnect()
  })

  describe.each(steps)('%s', (step) => {
    beforeAll(async () => {
      if (step.transfer) {
        await Promise.all(cases.map((supplier) => helper.sponsor(supplier.address)))
      }

      await Promise.all(
        cases.map((supplier) => {
          return helper.lib.insertData(step.entries(supplier.address), supplier.seed)
        })
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
