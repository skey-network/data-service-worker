import '../setup'

import * as helper from '../helper'
import { Blockchain } from '../../src/Blockchain'
import { GrpcClient } from '../../src/GrpcClient'
import { SubscribeEvent } from '../../src/Types'

describe('Blockchain', () => {
  let instance: Blockchain

  beforeEach(() => {
    instance = new Blockchain(new GrpcClient())
  })

  describe('fetchHeight', () => {
    it('returns correct height', async () => {
      const height = await instance.fetchHeight()

      expect(height).toBeGreaterThan(0)
    })
  })

  describe('fetchAsset', () => {
    let assetId = ''

    beforeAll(async () => {
      assetId = await helper.lib.generateKey('aaa', 1000, helper.seeds.dappFather)
    })

    it('returns object', async () => {
      const asset = await instance.fetchAsset(assetId)

      expect(asset.issuer).toBeDefined()
    })
  })

  describe('subscribe', () => {
    it('promise is cancellable', async () => {
      const promise = instance.subscribe(() => {}, 1)
      await promise.cancel()
    })

    it('receives updates', async () => {
      const chunks: SubscribeEvent[] = []

      instance.subscribe(
        (chunk) => {
          chunks.push(chunk)
        },
        1,
        10
      )

      await helper.delay(2000)

      expect(chunks.length).toBe(10)
      expect(chunks[0].update?.id).toBeDefined()
    })

    it('calls callback function on update', async () => {
      const callback = jest.fn()

      instance.subscribe(callback, 5, 7)

      await helper.delay(1000)

      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[1][0]?.update?.id).toBeDefined()
    })
  })
})
