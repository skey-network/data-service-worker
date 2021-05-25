import { GrpcClient } from './GrpcClient'
import * as Crypto from '@waves/ts-lib-crypto'
import { AssetInfoResponse, SubscribeEvent, SubscribeRequest } from './Types'

export class Blockchain {
  constructor(private grpcClient: GrpcClient) {}

  public fetchAsset(assetId: string) {
    return new Promise<AssetInfoResponse>((resolve, reject) => {
      this.grpcClient.assetsApiClient.GetInfo(
        { asset_id: Crypto.base58Decode(assetId) },
        (err, res) => {
          if (err || !res) return reject(err)

          resolve(res)
        }
      )
    })
  }

  public fetchHeight() {
    return new Promise<number>((resolve, reject) => {
      this.grpcClient.blocksApiClient.GetCurrentHeight({}, (err, res) => {
        if (err || !res) return reject(err)

        resolve(res!.value)
      })
    })
  }

  public delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  public subscribe(
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
      // call.on(
      //   'data',
      //   (c) =>
      //     // console.log(c.update.append.transaction_state_updates[0]?.assets)
      //     console.log(c.update.append.transaction_state_updates[0])
      //   // console.log(getDataEntries(getStateUpdates(c)).map((c) => c.entries))
      // )

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
