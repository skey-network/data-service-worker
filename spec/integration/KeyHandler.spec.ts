import '../setup'

import { KeyHandler } from '../../src/TxHandlers/KeyHandler'
import {
  createTxHandlerTestContext,
  removeTxHandlerTestContext,
  TxHandlerTestContext
} from './TxHandlerTestContext'
import config from '../../config'
import { getInstance } from '../ExtendedLib'

const lib = getInstance(config())

describe('KeyHandler', () => {
  let ctx: TxHandlerTestContext<KeyHandler>

  const getOne = async (assetId: string) =>
    ctx.db.connection.collection('keys').findOne({ assetId })

  const validKey = {
    device: lib.createAccount().address,
    validTo: 9999,
    name: 'test_key',
    assetId: ''
  }

  const user = lib.createAccount()
  const issuer = lib.createAccount()

  beforeAll(async () => {
    ctx = await createTxHandlerTestContext(KeyHandler)

    await lib.sponsor(issuer.address, 10)
    await lib.sponsor(user.address)
  })

  afterAll(async () => {
    await removeTxHandlerTestContext(ctx)
  })

  it('create valid key', async () => {
    validKey.assetId = await lib.generateKey(
      validKey.device,
      validKey.validTo,
      issuer.seed,
      validKey.name
    )

    await lib.delay(1000)

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
    const id = await lib.issueToken({
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
    const id = await lib.issueToken({
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
    const id = await lib.issueToken({
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
    const id = await lib.issueToken({
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
    await lib.transferKey(user.address, validKey.assetId, issuer.seed)

    await lib.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.owner).toBe(user.address)
  })

  it('transfer key back', async () => {
    await lib.transferKey(issuer.address, validKey.assetId, user.seed)

    await lib.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.owner).toBe(issuer.address)
  })

  it('burn key', async () => {
    await lib.burnKey(validKey.assetId, issuer.seed)

    await lib.delay(1000)

    const doc = await getOne(validKey.assetId)

    expect(doc.burned).toBe(true)
  })
})
