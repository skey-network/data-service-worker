import { grpcClient } from './GrpcClient'
import * as Crypto from '@waves/ts-lib-crypto'
import { AssetInfoResponse, SubscribeEvent, SubscribeRequest } from './Types'
import { delay } from './Common'
import { TransactionResponse } from '../proto/interfaces/waves/node/grpc/TransactionResponse'

export const fetchAsset = (assetId: string) => {
  return new Promise<AssetInfoResponse>((resolve, reject) => {
    grpcClient.assetsApiClient.GetInfo(
      { asset_id: Crypto.base58Decode(assetId) },
      (err, res) => {
        if (err || !res) return reject(err)

        resolve(res)
      }
    )
  })
}

export const fetchTransactions = (ids: Uint8Array[]) => {
  const txes: TransactionResponse[] = []

  const processTransaction = (tx: TransactionResponse) => {
    txes.push(tx)
  }

  return new Promise<TransactionResponse[]>((resolve, reject) => {
    const call = grpcClient.transactionsApiClient.getTransactions({
      transaction_ids: ids
    })

    call.on('data', processTransaction)
    call.on('close', () => resolve(txes))
    call.on('error', (err) => reject(err))
  })
}

export const fetchHeight = () => {
  return new Promise<number>((resolve, reject) => {
    grpcClient.blocksApiClient.GetCurrentHeight({}, (err, res) => {
      if (err || !res) return reject(err)

      resolve(res!.value)
    })
  })
}

export const subscribe = (
  callback: (chunk: SubscribeEvent) => any,
  fromHeight: number,
  toHeight?: number
) => {
  const CANCEL_TIMEOUT = 300
  const CANCEL_MESSAGE = '1 CANCELLED: Cancelled on client'

  const request: SubscribeRequest = {
    from_height: fromHeight,
    to_height: toHeight
  }

  const call = grpcClient.blockchainUpdatesApiClient.subscribe(request)

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
    await delay(CANCEL_TIMEOUT)
  }

  return Object.assign(promise, { cancel })
}
