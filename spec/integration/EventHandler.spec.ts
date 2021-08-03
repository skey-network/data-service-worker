import '../setup'

import * as helper from '../helper'
import { EventHandler } from '../../src/TxHandlers/EventHandler'
import * as Common from '../../src/Common'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestHelper'

describe('EventHandler', () => {
  let ctx: TxHandlerTestContext<EventHandler>

  const getOne = async (txHash: string) =>
    ctx.db.connection.collection('events').findOne({ txHash })

  const user = helper.createAccount()
  const device = helper.createAccount()
  const supplier = helper.createAccount()

  let key = ''
  let txHash = ''

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(EventHandler)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it('sponsor accounts', async () => {
    await Promise.all([device, user, supplier].map((acc) => helper.sponsor(acc.address)))
  })

  it('set account scripts', async () => {
    await Promise.all([
      helper.lib.setScript(Common.scripts.device, device.seed),
      helper.lib.setScript(Common.scripts.supplier, supplier.seed)
    ])
  })

  it('prepare key', async () => {
    key = await helper.lib.generateKey(
      device.address,
      Date.now() + 3600 * 1000,
      supplier.seed
    )

    await helper.lib.transferKey(user.address, key, supplier.seed)
  })

  it('set data entries', async () => {
    await Promise.all([
      helper.lib.insertData(
        [
          { key: 'type', value: 'device' },
          { key: 'supplier', value: supplier.address },
          { key: 'owner', value: supplier.address },
          { key: `key_${key}`, value: 'active' }
        ],
        device.seed
      ),
      helper.lib.insertData(
        [{ key: `device_${device.address}`, value: 'active' }],
        supplier.seed
      )
    ])
  })

  it('interact with device', async () => {
    txHash = await helper.lib.interactWithDevice(key, supplier.address, 'open', user.seed)
  })

  it('saved event in database', async () => {
    const doc = await getOne(txHash)

    expect(doc.txHash).toBe(txHash)
    expect(doc.sender).toBe(user.address)
    expect(doc.assetId).toBe(key)
    expect(doc.action).toBe('open')
    expect(doc.status).toBe('SUCCEEDED')
  })
})
