import * as Crypto from '@waves/ts-lib-crypto'
import { AssetInfoResponse, SubscribeEvent, SubscribeRequest } from '../Types'
import { delay } from '../Common'
import { TransactionResponse } from '../../proto/interfaces/waves/node/grpc/TransactionResponse'
import { GrpcClient } from './GrpcClient'
import { Logger } from '../Logger'

export class BlockchainClient {
  client: GrpcClient

  constructor(client: GrpcClient) {
    this.client = client
  }

  private logger = new Logger(BlockchainClient.name)

  fetchAsset(assetId: string) {
    return new Promise<AssetInfoResponse | null>((resolve) => {
      this.client.assetsApiClient.GetInfo(
        { asset_id: Crypto.base58Decode(assetId) },
        (err, res) => {
          if (err || !res) return resolve(null)

          resolve(res)
        }
      )
    })
  }

  fetchTransactions(ids: Uint8Array[]) {
    const txes: TransactionResponse[] = []

    const processTransaction = (tx: TransactionResponse) => {
      txes.push(tx)
    }

    return new Promise<TransactionResponse[]>((resolve, reject) => {
      const call = this.client.transactionsApiClient.getTransactions({
        transaction_ids: ids
      })

      call.on('data', processTransaction)
      call.on('close', () => resolve(txes))
      call.on('error', (err) => reject(err))
    })
  }

  fetchHeight() {
    return new Promise<number | null>((resolve) => {
      this.client.blocksApiClient.GetCurrentHeight({}, (err, res) => {
        if (err || !res) {
          this.logger.error(err)
          return resolve(null)
        }

        resolve(res.value)
      })
    })
  }

  subscribe(
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

    const call = this.client.blockchainUpdatesApiClient.subscribe(request)

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
}
