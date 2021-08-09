import * as Crypto from '@waves/ts-lib-crypto'
import { AssetInfoResponse, SubscribeEvent, SubscribeRequest } from '../Types'
import { delay } from '../Common'
import { TransactionResponse } from '../../proto/interfaces/waves/node/grpc/TransactionResponse'
import { GrpcClient } from './GrpcClient'
import { Logger } from '../Logger'
import { Config } from '../Config'

export type CancellablePromise<T> = Promise<T> & { cancel: () => Promise<void> }

export class BlockchainClient {
  client: GrpcClient
  config: Config

  constructor(client: GrpcClient, config: Config) {
    this.client = client
    this.config = config
  }

  get logger() {
    return new Logger(BlockchainClient.name, this.config.app.logs)
  }

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

  waitForHeight(goal: number) {
    const INTERVAL = 1000

    return new Promise<void>((resolve, reject) => {
      const handle = setInterval(async () => {
        const height = await this.fetchHeight()

        if (!height) {
          clearTimeout(handle)
          reject(`Received height = ${height} expected number greater than 0`)
          return
        }

        if (height < goal) return

        clearTimeout(handle)
        resolve()
      }, INTERVAL)
    })
  }

  subscribe(
    callback: (chunk: SubscribeEvent) => any,
    fromHeight: number,
    toHeight?: number
  ) {
    const CANCEL_MESSAGE = '1 CANCELLED: Cancelled on client'
    const CONNECTION_DROPPED_MESSAGE = '14 UNAVAILABLE: Connection dropped'
    const CANCEL_TIMEOUT = 500
    const TIMER_INTERVAL = 100
    const MAX_DELAY_SECONDS = 15

    const request: SubscribeRequest = {
      from_height: fromHeight,
      to_height: toHeight
    }

    const call = this.client.blockchainUpdatesApiClient.subscribe(request)

    let lastTimestamp = Date.now()
    let timerHandle: NodeJS.Timeout

    const promise = new Promise<void>((resolve, reject) => {
      timerHandle = setInterval(async () => {
        if (lastTimestamp + MAX_DELAY_SECONDS * 1000 < Date.now()) {
          this.logger.error('No updates received in', MAX_DELAY_SECONDS, 'seconds')
          this.logger.error('Dropping connection ...')

          clearInterval(timerHandle)
          reject('no updates')
        }
      }, TIMER_INTERVAL)

      call.on('data', (chunk: SubscribeEvent) => {
        lastTimestamp = Date.now()

        this.logger.debug('Received chunk, height', chunk.update?.height)
        callback(chunk)
      })

      call.on('end', resolve)
      call.on('close', resolve)

      call.on('error', (err) => {
        if (err.message === CANCEL_MESSAGE) {
          return resolve()
        }

        if (err.message === CONNECTION_DROPPED_MESSAGE) {
          this.logger.error('Grpc connection lost')
          return reject()
        }

        if (!err) {
          this.logger.error('Received undefined grpc error')
          this.logger.error('Continuing process ...')
        }

        this.logger.error('Received grpc error')
        this.logger.error(err)

        reject(err)
      })
    })

    const cancel = async () => {
      clearInterval(timerHandle)
      call.cancel()
      await delay(CANCEL_TIMEOUT)
    }

    return Object.assign(promise, { cancel })
  }
}
