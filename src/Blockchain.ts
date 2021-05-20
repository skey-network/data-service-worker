import { GrpcClient } from './GrpcClient'
import { SubscribeEvent, SubscribeRequest } from './Types'

export class Blockchain {
  static grpcClient = new GrpcClient()

  static fetchHeight() {
    return new Promise<number>((resolve, reject) => {
      this.grpcClient.blocksApiClient.GetCurrentHeight({}, (err, res) => {
        if (err) reject(err)

        resolve(res!.value)
      })
    })
  }

  static delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  static subscribe(
    callback: (chunk: SubscribeEvent) => any,
    fromHeight: number,
    toHeight?: number
  ) {
    const CANCEL_TIMEOUT = 300
    const CANCEL_MESSAGE = '1 CANCELLED: Cancelled on client'

    const request: SubscribeRequest = {
      from_height: fromHeight,
      to_height: toHeight
    }

    const call = this.grpcClient.blockchainUpdatesApiClient.subscribe(request)

    const promise = new Promise<void>((resolve, reject) => {
      call.on('data', callback)

      call.on('end', resolve)
      call.on('close', resolve)

      call.on('error', (err) => {
        if (err.message === CANCEL_MESSAGE) {
          resolve()
        }

        // TODO handle errors?
        reject(err)
      })
    })

    // Use it to avoid promise leaking while testing
    const cancel = async () => {
      call.cancel()
      await this.delay(CANCEL_TIMEOUT)
    }

    return Object.assign(promise, { cancel })
  }
}
