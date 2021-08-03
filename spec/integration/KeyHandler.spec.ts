import '../setup'

import * as helper from '../helper'
import { KeyHandler } from '../../src/TxHandlers/KeyHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestHelper'

describe('KeyHandler', () => {
  let ctx: TxHandlerTestContext<KeyHandler>

  const getOne = async (assetId: string) =>
    ctx.db.connection.collection('keys').findOne({ assetId })

  const validKey = {
    device: helper.createAccount().address,
    validTo: 9999,
    name: 'test_key',
    assetId: ''
  }

  const user = helper.createAccount()
  const issuer = helper.createAccount()

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(KeyHandler)

    await helper.sponsor(issuer.address, 10)
    await helper.sponsor(user.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it('create valid key', async () => {
    validKey.assetId = await helper.lib.generateKey(
      validKey.device,
      validKey.validTo,
      issuer.seed,
      validKey.name
    )

    await helper.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.assetId).toBe(validKey.assetId)
    expect(doc.issuer).toBe(issuer.address)
    expect(doc.owner).toBe(issuer.address)
    expect(doc.name).toBe(validKey.name)
    expect(doc.device).toBe(validKey.device)
    expect(doc.validTo).toBe(validKey.validTo)
    expect(typeof doc.issueTimestamp).toBe('number')
    expect(doc.burned).toBe(false)
  })

  it('invalid quantity', async () => {
    const id = await helper.issueToken({
      quantity: 1000,
      decimals: 0,
      name: 'invalid_key',
      reissuable: false,
      description: `${validKey.device}_${999999999}`,
      seed: issuer.seed
    })

    const doc = await getOne(id)

    expect(doc).toBe(null)
  })

  it('invalid device', async () => {
    const id = await helper.issueToken({
      quantity: 1,
      decimals: 0,
      name: 'invalid_key',
      reissuable: false,
      description: `345634563456_${999999999}`,
      seed: issuer.seed
    })

    const doc = await getOne(id)

    expect(doc).toBe(null)
  })

  it('invalid decimals', async () => {
    const id = await helper.issueToken({
      quantity: 1,
      decimals: 4,
      name: 'invalid_key',
      reissuable: false,
      description: `${validKey.device}${999999999}`,
      seed: issuer.seed,
      fee: 100000000
    })

    const doc = await getOne(id)

    expect(doc).toBe(null)
  })

  it('invalid reissuable', async () => {
    const id = await helper.issueToken({
      quantity: 1,
      decimals: 0,
      name: 'invalid_key',
      reissuable: true,
      description: `${validKey.device}${999999999}`,
      seed: issuer.seed,
      fee: 100000000
    })

    const doc = await getOne(id)

    expect(doc).toBe(null)
  })

  it('transfer key', async () => {
    await helper.lib.transferKey(user.address, validKey.assetId, issuer.seed)

    await helper.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.owner).toBe(user.address)
  })

  it('transfer key back', async () => {
    await helper.lib.transferKey(issuer.address, validKey.assetId, user.seed)

    await helper.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.owner).toBe(issuer.address)
  })

  it('burn key', async () => {
    await helper.burnKey(validKey.assetId, issuer.seed)

    await helper.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.burned).toBe(true)
  })
})
