import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import config from '../config'
import { readdirSync } from 'fs'
import type { BlocksApiClient, BlockchainUpdatesApiClient } from './Types'
import { AssetsApiClient } from '../proto/interfaces/waves/node/grpc/AssetsApi'
import { TransactionsApiClient } from '../proto/interfaces/waves/node/grpc/TransactionsApi'

export interface GrpcClient {
  blocksApiClient: BlocksApiClient
  assetsApiClient: AssetsApiClient
  blockchainUpdatesApiClient: BlockchainUpdatesApiClient
  transactionsApiClient: TransactionsApiClient
}

export const protoLoaderOptions: protoLoader.Options = Object.freeze({
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export const createGrpcClient = (): GrpcClient => {
  const proto = loadProto()

  const { node, events } = proto
  const { apiPort, updatesPort } = config().grpc

  return {
    blocksApiClient: createApi(node.grpc.BlocksApi, apiPort),
    assetsApiClient: createApi(node.grpc.AssetsApi, apiPort),
    transactionsApiClient: createApi(node.grpc.TransactionsApi, apiPort),
    blockchainUpdatesApiClient: createApi(events.grpc.BlockchainUpdatesApi, updatesPort)
  }
}

export const createApi = <T>(obj: any, port: number) => {
  const url = `${config().grpc.host}:${port}`
  const client = new obj(url, grpc.credentials.createInsecure())
  return client as T
}

export const loadProto = (): any => {
  const dir = `${process.cwd()}/proto`

  const files = readdirSync(dir)
    .map((filename) => `${dir}/${filename}`)
    .filter((file) => /.proto$/.test(file))

  const packageDefinition = protoLoader.loadSync(files, protoLoaderOptions)
  return grpc.loadPackageDefinition(packageDefinition).waves
}

export const grpcClient = createGrpcClient()
