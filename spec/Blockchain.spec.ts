import './setup'

import { Blockchain } from '../src/Blockchain'
import { ReflectiveInjector } from 'injection-js'
import { GrpcClient } from '../src/GrpcClient'
import { Common } from '../src/Common'
import { ProtoLoader } from '../src/ProtoLoader'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'

const delay = new Common().delay

describe('Blockchain', () => {
  let service: Blockchain

  beforeEach(() => {
    const injector = ReflectiveInjector.resolveAndCreate([
      Blockchain,
      GrpcClient,
      Common,
      ProtoLoader
    ])

    service = injector.get(Blockchain)
  })

  describe('fetchHeight', () => {
    it('returns correct height', async () => {
      const height = await service.fetchHeight()

      expect(height).toBeGreaterThan(0)
    })
  })

  describe('onBlockchainUpdate', () => {
    it('promise is cancellable', async () => {
      const promise = service.onBlockchainUpdate(() => {}, 1)
      await promise.cancel()
    })

    it('receives updates', async () => {
      const chunks: SubscribeEvent[] = []

      service.onBlockchainUpdate(
        (chunk) => {
          chunks.push(chunk)
        },
        1,
        10
      )

      await delay(2000)

      expect(chunks.length).toBe(10)
      expect(chunks[0].update?.id).toBeDefined()
    })

    it('calls callback function on update', async () => {
      const callback = jest.fn()

      service.onBlockchainUpdate(callback, 5, 7)

      await delay(1000)

      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[1][0]?.update?.id).toBeDefined()
    })
  })
})
