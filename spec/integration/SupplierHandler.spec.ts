import '../setup'

import * as helper from '../helper'
import { SupplierHandler } from '../../src/TxHandlers/SupplierHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestHelper'

const supplier = helper.createAccount()

const cases = [
  {
    toString: () => 'invalid type',
    entries: [{ key: 'type', value: 'other' }],
    expected: null
  },
  {
    toString: () => 'create supplier',
    entries: [{ key: 'type', value: 'supplier' }],
    expected: {
      address: supplier.address,
      name: undefined,
      description: undefined,
      whitelisted: false,
      devices: []
    }
  },
  {
    toString: () => 'update supplier',
    entries: [
      { key: 'name', value: 'test_name' },
      { key: 'description', value: 'test_desc' }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      devices: []
    }
  },
  {
    toString: () => 'whitelist devices',
    entries: [
      { key: 'device_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: 'active' },
      { key: 'device_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: 'active' }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      devices: [
        '3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv',
        '3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj'
      ]
    }
  },
  {
    toString: () => 'blacklist devices',
    entries: [
      { key: 'device_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: null },
      { key: 'device_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: null }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      devices: []
    }
  },
  {
    toString: () => 'invalid entries',
    entries: [
      { key: 'device_invalid', value: 'active' },
      { key: 'device__45906834590684350645906', value: 'active' }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      devices: []
    }
  }
]

describe('SupplierHandler - integration', () => {
  let ctx: TxHandlerTestContext<SupplierHandler>

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(SupplierHandler)
    await helper.sponsor(supplier.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it.each(cases)('%s', async (args) => {
    await helper.lib.insertData(args.entries as any, supplier.seed)
    await helper.delay(1000)

    const doc = (await ctx.db.models.supplierModel.findOne({
      address: supplier.address
    }))!

    if (!args.expected) {
      expect(doc).toBe(null)
      return
    }

    const picked = ((obj) => ({
      address: obj.address,
      name: obj.name,
      description: obj.description,
      whitelisted: obj.whitelisted,
      devices: Array.from(obj.devices)
    }))(doc)

    expect(picked).toEqual(args.expected)
  })
})
