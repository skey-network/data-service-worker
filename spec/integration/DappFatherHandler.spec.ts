import '../setup'

import * as helper from '../helper'
import { DappFatherHandler } from '../../src/TxHandlers/DappFatherHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestHelper'

const supplier = helper.createAccount().address
const organisation = helper.createAccount().address

const cases = [
  {
    toString: () => 'whitelist supplier',
    collection: 'suppliers',
    address: supplier,
    entries: [
      {
        key: `supplier_${supplier}`,
        value: 'active'
      }
    ],
    expected: {
      address: supplier,
      name: undefined,
      description: undefined,
      whitelisted: true
    }
  },
  {
    toString: () => 'blacklist supplier',
    collection: 'suppliers',
    address: supplier,
    entries: [
      {
        key: `supplier_${supplier}`,
        value: 'inactive'
      }
    ],
    expected: {
      address: supplier,
      name: undefined,
      description: undefined,
      whitelisted: false
    }
  },
  {
    toString: () => 'whitelist organisation',
    collection: 'organisations',
    address: organisation,
    entries: [
      {
        key: `org_${organisation}`,
        value: 'active'
      }
    ],
    expected: {
      address: organisation,
      name: undefined,
      description: undefined,
      whitelisted: true
    }
  },
  {
    toString: () => 'blacklist organisation',
    collection: 'organisations',
    address: organisation,
    entries: [
      {
        key: `org_${organisation}`,
        value: 'inactive'
      }
    ],
    expected: {
      address: organisation,
      name: undefined,
      description: undefined,
      whitelisted: false
    }
  }
]

describe('DappFatherHandler - integration', () => {
  let ctx: TxHandlerTestContext<DappFatherHandler>

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(DappFatherHandler)
    await helper.sponsor(helper.accounts.dappFather.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it.each(cases)('%s', async (args) => {
    await helper.lib.insertData(args.entries, helper.accounts.dappFather.seed)

    await helper.delay(1000)

    const doc = (await ctx.db.connection
      .collection(args.collection)
      .findOne({ address: args.address }))!

    const picked = ((obj) => ({
      address: obj.address,
      name: obj.name,
      description: obj.description,
      whitelisted: obj.whitelisted
    }))(doc)

    expect(picked).toEqual(args.expected)
  })
})
