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
      whitelisted: false
    })
  },
  {
    toString: () => 'update organisation',
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
      name: 'test name',
      description: 'test desc',
      whitelisted: false
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
      whitelisted: obj.whitelisted
    }))(doc)

    expect(picked).toEqual(args.expected(org.address))
  })
})
