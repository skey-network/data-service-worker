import { ReflectiveInjector } from 'injection-js'
import { getInstance } from 'skey-lib'
import config from '../config'
import { Blockchain } from '../src/Blockchain'
import { GrpcClient } from '../src/GrpcClient'
import { Logger } from '../src/Logger'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'

export const genesis =
  'seed seed seed seed seed seed seed seed seed seed seed seed seed seed seed'

export const lib = getInstance({
  nodeUrl: config().blockchain.nodeUrl,
  chainId: config().blockchain.chainId
})

export const delay = lib.delay

// export const waitForCall = (spy: jest.SpyInstance, timeout = 10_000) => {
//   return new Promise<void>((resolve) => {
//     const start = Date.now()

//     const handle = setInterval(() => {
//       const timeoutReached = Date.now() - start > timeout

//       if (spy.mock.calls.length === 0 && !timeoutReached) return

//       clearInterval(handle)
//       resolve()
//     }, 100)
//   })
// }

export const createMultipleAccounts = (amount: number) => {
  return [...Array(amount)].map(() => lib.createAccount())
}

// export const testListener = async (
//   app: { listener: Listener; blockchain: Blockchain; txHandler: TxHandler },
//   handler: (chunk: SubscribeEvent) => any,
//   event: Promise<any>,
//   spy: jest.SpyInstance
// ) => {
//   const height = await app.blockchain.fetchHeight()

//   const promise = app.listener.subscribe((chunk) => handler(chunk), height)

//   await event

//   await waitForCall(spy)
//   await promise.cancel()
// }
