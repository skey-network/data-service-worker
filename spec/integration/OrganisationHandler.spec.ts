import '../setup'

import { OrganisationHandler } from '../../src/TxHandlers/OrganisationHandler'
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
    entries: (address: string) => [{ key: 'type', value: 'aaa' }],
    expected: (address: string) => null
  },
  {
    toString: () => 'create organisation',
    entries: (address: string) => [{ key: 'type', value: 'organisation' }],
    expected: (address: string) => ({
      address,
      name: undefined,
      description: undefined,
      whitelisted: false,
      users: []
    })
  },
  {
    toString: () => 'update organisation',
    entries: (address: string) => [
      { key: 'name', value: 'test_name' },
      { key: 'description', value: 'test_desc' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      users: []
    })
  },
  {
    toString: () => 'whitelist users',
    entries: (address: string) => [
      { key: 'user_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: 'active' },
      { key: 'user_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: 'active' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      users: [
        '3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv',
        '3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj'
      ]
    })
  },
  {
    toString: () => 'blacklist users',
    entries: (address: string) => [
      { key: 'user_3M2Zy7xEUVgS96dKwrimaFBbZH7AViVpPSv', value: 'inactive' },
      { key: 'user_3MQHyskVP95vCVbeKbVATrT4MhBhroDbGSj', value: 'inactive' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      users: []
    })
  },
  {
    toString: () => 'invalid entries',
    entries: (address: string) => [
      { key: 'other', value: 123123 },
      { key: 'bool', value: true },
      { key: 'hello', value: 'true' }
    ],
    expected: (address: string) => ({
      address,
      name: 'test_name',
      description: 'test_desc',
      whitelisted: false,
      users: []
    })
  }
]

describe('OrganisationHandler - integration', () => {
  let ctx: TxHandlerTestContext<OrganisationHandler>

  const org = lib.createAccount()
  const other = lib.createAccount()

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(OrganisationHandler)

    await lib.sponsor(org.address)
    await lib.sponsor(other.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it.each(cases)('%s', async (args) => {
    await lib.insertData(args.entries(org.address), org.seed)

    const doc = (await ctx.db.connection
      .collection('organisations')
      .findOne({ address: org.address }))!

    if (!args.expected(org.address)) {
      return expect(doc).toBe(null)
    }

    const picked = ((obj) => ({
      address: obj.address,
      name: obj.name,
      description: obj.description,
      whitelisted: obj.whitelisted,
      users: Array.from(obj.users)
    }))(doc)

    expect(picked).toEqual(args.expected(org.address))
  })
})
