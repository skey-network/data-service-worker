import '../setup'

import { EventHandler } from '../../src/TxHandlers/EventHandler'
import * as Common from '../../src/Common'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestContext'
import config from '../../config'
import { getInstance } from '../ExtendedLib'

const lib = getInstance(config())

describe('EventHandler', () => {
  let ctx: TxHandlerTestContext<EventHandler>

  const getOne = async (txHash: string) =>
    ctx.db.connection.collection('events').findOne({ txHash })

  const user = lib.createAccount()
  const device = lib.createAccount()
  const supplier = lib.createAccount()

  let key = ''
  let txHash = ''

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(EventHandler)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it('sponsor accounts', async () => {
    await Promise.all([device, user, supplier].map((acc) => lib.sponsor(acc.address)))
  })

  it('set account scripts', async () => {
    await Promise.all([
      lib.setScript(Common.scripts.device, device.seed),
      lib.setScript(Common.scripts.supplier, supplier.seed)
    ])
  })

  it('prepare key', async () => {
    key = await lib.generateKey(device.address, Date.now() + 3600 * 1000, supplier.seed)

    await lib.transferKey(user.address, key, supplier.seed)
  })

  it('set data entries', async () => {
    await Promise.all([
      lib.insertData(
        [
          { key: 'type', value: 'device' },
          { key: 'supplier', value: supplier.address },
          { key: 'owner', value: supplier.address },
          { key: `key_${key}`, value: 'active' }
        ],
        device.seed
      ),
      lib.insertData(
        [{ key: `device_${device.address}`, value: 'active' }],
        supplier.seed
      )
    ])
  })

  it('interact with device', async () => {
    txHash = await lib.interactWithDevice(key, supplier.address, 'open', user.seed)
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
