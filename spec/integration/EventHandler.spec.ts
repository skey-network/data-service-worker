import '../setup'

import * as Database from '../../src/Database'
import * as helper from '../helper'
import { handleEventUpdates } from '../../src/TxHandlers/EventHandler'
import * as Common from '../../src/Common'
import { Event } from '../../models/Event'
import { Helpers } from '../factory'

const cases = [
  {
    toString: () => 'basic example',
    device: helper.createAccount(),
    user: helper.createAccount(),
    supplier: helper.createAccount(),
    key: '',
    txHash: ''
  }
]

describe('EventHandler', () => {
  let cancelSubscription = async () => {}

  beforeAll(async () => {
    await Database.connect()
    cancelSubscription = await helper.getListenerInstance(handleEventUpdates)
  })

  afterAll(async () => {
    await cancelSubscription()
    await Database.disconnect()
  })

  describe.each(cases)('%s', (ctx) => {
    it('sponsor accounts', async () => {
      await Promise.all(
        [ctx.device, ctx.user, ctx.supplier].map((acc) => helper.sponsor(acc.address))
      )
    })

    it('set account scripts', async () => {
      await Promise.all([
        helper.lib.setScript(Common.scripts.device, ctx.device.seed),
        helper.lib.setScript(Common.scripts.supplier, ctx.supplier.seed)
      ])
    })

    it('prepare key', async () => {
      ctx.key = await helper.lib.generateKey(
        ctx.device.address,
        Helpers.randTimestamp(),
        ctx.supplier.seed
      )

      await helper.lib.transferKey(ctx.user.address, ctx.key, ctx.supplier.seed)
    })

    it('set data entries', async () => {
      await Promise.all([
        helper.lib.insertData(
          [
            { key: 'type', value: 'device' },
            { key: 'supplier', value: ctx.supplier.address },
            { key: 'owner', value: ctx.supplier.address },
            { key: `key_${ctx.key}`, value: 'active' }
          ],
          ctx.device.seed
        ),
        helper.lib.insertData(
          [{ key: `device_${ctx.device.address}`, value: 'active' }],
          ctx.supplier.seed
        )
      ])
    })

    it('interact with device', async () => {
      ctx.txHash = await helper.lib.interactWithDevice(
        ctx.key,
        ctx.supplier.address,
        'open',
        ctx.user.seed
      )
    })

    it('saved event in database', async () => {
      const doc = (await Event.findOne({ txHash: ctx.txHash }))!

      expect(doc.txHash).toBe(ctx.txHash)
      expect(doc.sender).toBe(ctx.user.address)
      expect(doc.assetId).toBe(ctx.key)
      expect(doc.action).toBe('open')
      expect(doc.status).toBe('SUCCEEDED')
    })
  })
})
