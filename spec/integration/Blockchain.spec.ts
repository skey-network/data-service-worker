import '../setup'

import * as helper from '../helper'
import { BlockchainClient } from '../../src/Clients/BlockchainClient'
import { SubscribeEvent } from '../../src/Types'
import { GrpcClient } from '../../src/Clients/GrpcClient'
import config from '../../config'

describe('Blockchain', () => {
  let grpcClient: GrpcClient
  let blockchainClient: BlockchainClient

  beforeAll(async () => {
    grpcClient = new GrpcClient(config().grpc)
    blockchainClient = new BlockchainClient(grpcClient)
  })

  describe('fetchHeight', () => {
    it('returns correct height', async () => {
      const height = await blockchainClient.fetchHeight()
      expect(height).toBeGreaterThan(0)
    })
  })

  describe('fetchAsset', () => {
    let assetId = ''

    beforeAll(async () => {
      assetId = await helper.lib.generateKey('aaa', 1000, helper.accounts.genesis.seed)
    })

    it('returns object', async () => {
      const asset = await blockchainClient.fetchAsset(assetId)
      expect(asset!.issuer).toBeDefined()
    })
  })

  describe('subscribe', () => {
    it('promise is cancellable', async () => {
      const promise = blockchainClient.subscribe(() => {}, 1)
      await promise.cancel()
    })

    it('receives updates', async () => {
      const chunks: SubscribeEvent[] = []

      blockchainClient.subscribe(
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

      blockchainClient.subscribe(callback, 5, 7)

      await helper.delay(1000)

      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[1][0]?.update?.id).toBeDefined()
    })
  })
})
