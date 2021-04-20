import { Injectable } from 'injection-js'
import { SubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
import { SubscribeRequest } from '../proto/interfaces/waves/events/grpc/SubscribeRequest'
import { Common } from './Common'
import { GrpcClient } from './GrpcClient'

@Injectable()
export class Blockchain {
  constructor(private grpcClient: GrpcClient, private common: Common) {}

  fetchHeight() {
    return new Promise<number>((resolve, reject) => {
      this.grpcClient.blocksApiClient.GetCurrentHeight({}, (err, res) => {
        if (err) reject(err)

        resolve(res!.value)
      })
    })
  }

  onBlockchainUpdate(
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
      await this.common.delay(CANCEL_TIMEOUT)
    }

    return Object.assign(promise, { cancel })
  }
}
