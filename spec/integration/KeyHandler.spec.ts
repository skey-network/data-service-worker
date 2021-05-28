import '../setup'

import * as Database from '../../src/Database'
import * as helper from '../helper'
import { handleKeyUpdates } from '../../src/TxHandlers/KeyHandler'
import { Helpers } from '../factory'
import { Key } from '../../models/Key'

describe('KeyHandler', () => {
  const ctx = {
    cancelSubscription: async () => {},
    key: {
      device: helper.createAccount().address,
      validTo: Helpers.randTimestamp(),
      assetId: ''
    },
    user: helper.createAccount()
  }

  beforeAll(async () => {
    await Database.connect()
    ctx.cancelSubscription = await helper.getListenerInstance(handleKeyUpdates)
    await helper.sponsor(ctx.user.address)
  })

  afterAll(async () => {
    await ctx.cancelSubscription()
    await Database.disconnect()
  })

  describe('create key', () => {
    beforeAll(async () => {
      ctx.key.assetId = await helper.lib.generateKey(
        ctx.key.device,
        ctx.key.validTo,
        helper.accounts.dappFather.seed,
        'test-key'
      )

      await helper.delay(2000)
    })

    it('saved key in database', async () => {
      const doc = (await Key.findOne({ assetId: ctx.key.assetId }))!

      expect(doc.assetId).toBe(ctx.key.assetId)
      expect(doc.issuer).toBe(helper.accounts.dappFather.address)
      expect(doc.owner).toBe(helper.accounts.dappFather.address)
      expect(doc.name).toBe('test-key')
      expect(doc.device).toBe(ctx.key.device)
      expect(doc.validTo).toBe(ctx.key.validTo)
      expect(typeof doc.issueTimestamp).toBe('number')
      expect(doc.burned).toBe(false)
    })
  })

  describe('transfer key', () => {
    beforeAll(async () => {
      await helper.lib.transferKey(
        ctx.user.address,
        ctx.key.assetId,
        helper.accounts.dappFather.seed
      )

      await helper.delay(2000)
    })

    it('updated key in database', async () => {
      const doc = (await Key.findOne({ assetId: ctx.key.assetId }))!

      expect(doc.owner).toBe(ctx.user.address)
    })
  })

  describe('transfer key back', () => {
    beforeAll(async () => {
      await helper.lib.transferKey(
        helper.accounts.dappFather.address,
        ctx.key.assetId,
        ctx.user.seed
      )

      await helper.delay(2000)
    })

    it('updated key in database', async () => {
      const doc = (await Key.findOne({ assetId: ctx.key.assetId }))!

      expect(doc.owner).toBe(helper.accounts.dappFather.address)
    })
  })

  describe('burn key', () => {
    beforeAll(async () => {
      await helper.burnKey(ctx.key.assetId, helper.accounts.dappFather.seed)
      await helper.delay(2000)
    })

    it('updated key in database', async () => {
      const doc = (await Key.findOne({ assetId: ctx.key.assetId }))!

      expect(doc.burned).toBe(true)
    })
  })
})
