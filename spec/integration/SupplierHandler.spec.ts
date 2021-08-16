import '../setup'

import { SupplierHandler } from '../../src/TxHandlers/SupplierHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestContext'
import config from '../../config'
import { getInstance } from '../ExtendedLib'

const lib = getInstance(config())

const supplier = lib.createAccount()

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
      whitelist: [],
      organisations: []
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
      whitelist: [],
      organisations: []
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
      whitelist: [
        '3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv',
        '3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj'
      ],
      organisations: []
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
      whitelist: [],
      organisations: []
    }
  },
  {
    toString: () => 'whitelist organisations',
    entries: [
      { key: 'org_3ENsUGgQFNVWtGb6Vp8cSVv1aoQ93GJUYPf', value: 'active' },
      { key: 'org_3EPjfsvPnzdQAGpR2fJYvS2d45z6oaPtRb5', value: 'active' }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      whitelist: [],
      organisations: [
        '3ENsUGgQFNVWtGb6Vp8cSVv1aoQ93GJUYPf',
        '3EPjfsvPnzdQAGpR2fJYvS2d45z6oaPtRb5'
      ]
    }
  },
  {
    toString: () => 'blacklist organisations',
    entries: [
      { key: 'org_3ENsUGgQFNVWtGb6Vp8cSVv1aoQ93GJUYPf', value: null },
      { key: 'org_3EPjfsvPnzdQAGpR2fJYvS2d45z6oaPtRb5', value: null }
    ],
    expected: {
      address: supplier.address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      whitelist: [],
      organisations: []
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
      whitelist: [],
      organisations: []
    }
  }
]

describe('SupplierHandler - integration', () => {
  let ctx: TxHandlerTestContext<SupplierHandler>

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(SupplierHandler)
    await lib.sponsor(supplier.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it.each(cases)('%s', async (args) => {
    await lib.insertData(args.entries as any, supplier.seed)
    await lib.delay(1000)

    const doc = (await ctx.db.safeFindOne(
      {
        address: supplier.address
      },
      'suppliers'
    ))!

    if (!args.expected) {
      return expect(doc).toBe(null)
    }

    const picked = ((obj) => ({
      address: obj.address,
      name: obj.name,
      description: obj.description,
      whitelisted: obj.whitelisted,
      whitelist: Array.from(obj.whitelist),
      organisations: Array.from(obj.organisations)
    }))(doc)

    expect(picked).toEqual(args.expected)
  })
})
