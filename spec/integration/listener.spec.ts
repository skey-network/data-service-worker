import '../setup'

import { ReflectiveInjector } from 'injection-js'
import { Common } from '../../src/Common'
import { GrpcClient } from '../../src/GrpcClient'
import { Listener } from '../../src/Listener'
import { SubscribeEvent } from '../../proto/interfaces/waves/events/grpc/SubscribeEvent'

const delay = new Common().delay

describe('listener', () => {
  let service: Listener

  beforeEach(() => {
    const injector = ReflectiveInjector.resolveAndCreate([Listener, GrpcClient, Common])

    service = injector.get(Listener)
  })

  describe('subscribe', () => {
    it('promise is cancellable', async () => {
      const promise = service.subscribe(() => {}, 1)
      await promise.cancel()
    })

    it('receives updates', async () => {
      const chunks: SubscribeEvent[] = []

      service.subscribe(
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

      service.subscribe(callback, 5, 7)

      await delay(1000)

      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback.mock.calls[1][0]?.update?.id).toBeDefined()
    })
  })
})
