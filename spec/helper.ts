import { ReflectiveInjector } from 'injection-js'
import { getInstance } from 'skey-lib'
import { Db } from '../src/Db'
import config from '../config'
import { Blockchain } from '../src/Blockchain'
import { Common } from '../src/Common'
import { GrpcClient } from '../src/GrpcClient'
import { Listener } from '../src/Listener'
import { Logger } from '../src/Logger'
import { TxHandler } from '../src/TxHandler.old'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'

export const genesis = 'waves private node seed with waves tokens'

export const lib = getInstance({
  nodeUrl: config.blockchain.nodeUrl,
  chainId: config.blockchain.chainId
})

export const waitForCall = (spy: jest.SpyInstance, timeout = 10_000) => {
  return new Promise<void>((resolve) => {
    const start = Date.now()

    const handle = setInterval(() => {
      const timeoutReached = Date.now() - start > timeout

      if (spy.mock.calls.length === 0 && !timeoutReached) return

      clearInterval(handle)
      resolve()
    }, 100)
  })
}

export const createMultipleAccounts = (amount: number) => {
  return [...Array(amount)].map(() => lib.createAccount())
}

export const testListener = async (
  app: { listener: Listener; blockchain: Blockchain; txHandler: TxHandler },
  handler: (chunk: SubscribeEvent) => any,
  event: Promise<any>,
  spy: jest.SpyInstance
) => {
  const height = await app.blockchain.fetchHeight()

  const promise = app.listener.subscribe((chunk) => handler(chunk), height)

  await event

  await waitForCall(spy)
  await promise.cancel()
}

export const createApp = () => {
  const injector = ReflectiveInjector.resolveAndCreate([
    GrpcClient,
    Blockchain,
    Listener,
    TxHandler,
    Common,
    Logger,
    Db
  ])

  return {
    grpcClient: injector.get(GrpcClient) as GrpcClient,
    blockchain: injector.get(Blockchain) as Blockchain,
    listener: injector.get(Listener) as Listener,
    txHandler: injector.get(TxHandler) as TxHandler,
    common: injector.get(Common) as Common,
    logger: injector.get(Logger) as Logger,
    db: injector.get(Db) as Db
  }
}
