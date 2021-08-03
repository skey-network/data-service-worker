import { BlockchainClient, CancellablePromise } from '../../src/Clients/BlockchainClient'
import { DatabaseClient } from '../../src/Clients/DatabaseClient'
import { GrpcClient } from '../../src/Clients/GrpcClient'
import config from '../../config'
import { parseUpdate } from '../../src/UpdateParser'
import { Handler } from '../../src/TxHandlers/Handler'

export interface TxHandlerTestContext<T extends Handler> {
  grpc: GrpcClient
  db: DatabaseClient
  blockchain: BlockchainClient
  handler: T
  _promise: CancellablePromise<any>
}

export const createTxHandlerTestContext = async <T extends Handler>(
  handlerRef: any
): Promise<TxHandlerTestContext<T>> => {
  const grpc = new GrpcClient(config().grpc)
  const db = new DatabaseClient(config().db)
  const blockchain = new BlockchainClient(grpc)

  await db.connect()
  const height = await blockchain.fetchHeight()

  const handler = new handlerRef(config(), db, blockchain)

  const _promise = blockchain.subscribe(async (chunk) => {
    const update = parseUpdate(chunk)
    if (!update) return

    await handler.handleUpdate(update)
  }, height!)

  return {
    grpc,
    db,
    blockchain,
    handler,
    _promise
  }
}

export const removeTxHandlerTestContext = async (ctx: TxHandlerTestContext<any>) => {
  await ctx.db.disconnect()
  await ctx._promise.cancel()
}
