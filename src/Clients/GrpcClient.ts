import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { readdirSync } from 'fs'
import type { BlocksApiClient, BlockchainUpdatesApiClient } from '../Types'
import { AssetsApiClient } from '../../proto/interfaces/waves/node/grpc/AssetsApi'
import { TransactionsApiClient } from '../../proto/interfaces/waves/node/grpc/TransactionsApi'

export interface GrpcConnectionInput {
  host: string
  apiPort: number
  updatesPort: number
}

export const protoLoaderOptions: protoLoader.Options = Object.freeze({
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export class GrpcClient {
  blocksApiClient: BlocksApiClient
  assetsApiClient: AssetsApiClient
  blockchainUpdatesApiClient: BlockchainUpdatesApiClient
  transactionsApiClient: TransactionsApiClient

  constructor(input: GrpcConnectionInput) {
    const { host, apiPort, updatesPort } = input
    const { node, events } = this.loadProto()

    this.blocksApiClient = this.createApi(node.grpc.BlocksApi, host, apiPort)

    this.assetsApiClient = this.createApi(node.grpc.AssetsApi, host, apiPort)

    this.transactionsApiClient = this.createApi(node.grpc.TransactionsApi, host, apiPort)

    this.blockchainUpdatesApiClient = this.createApi(
      events.grpc.BlockchainUpdatesApi,
      host,
      updatesPort
    )
  }

  loadProto(): any {
    const dir = `${process.cwd()}/proto`

    const files = readdirSync(dir)
      .map((filename) => `${dir}/${filename}`)
      .filter((file) => /.proto$/.test(file))

    const packageDefinition = protoLoader.loadSync(files, protoLoaderOptions)
    return grpc.loadPackageDefinition(packageDefinition).waves
  }

  createApi<T>(obj: any, host: string, port: number): T {
    const url = `${host}:${port}`
    const client = new obj(url, grpc.credentials.createInsecure())
    return client
  }
}
