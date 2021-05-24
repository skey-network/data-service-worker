import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import config from '../config'
import { readdirSync } from 'fs'
import type { BlocksApiClient, BlockchainUpdatesApiClient } from './Types'
import { AssetsApiClient } from '../proto/interfaces/waves/node/grpc/AssetsApi'

const protoLoaderOptions: protoLoader.Options = Object.freeze({
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export class GrpcClient {
  public blocksApiClient: BlocksApiClient
  public assetsApiClient: AssetsApiClient
  public blockchainUpdatesApiClient: BlockchainUpdatesApiClient
  public proto: any

  constructor() {
    this.proto = this.loadProto()
    const { node, events } = this.proto
    const { apiPort, updatesPort } = config.grpc

    this.blocksApiClient = this.createApi(node.grpc.BlocksApi, apiPort)
    this.assetsApiClient = this.createApi(node.grpc.AssetsApi, apiPort)

    this.blockchainUpdatesApiClient = this.createApi(
      events.grpc.BlockchainUpdatesApi,
      updatesPort
    )
  }

  public createApi<T>(obj: any, port: number) {
    const url = `${config.grpc.host}:${port}`
    const client = new obj(url, grpc.credentials.createInsecure())
    return client as T
  }

  public loadProto() {
    const dir = `${process.cwd()}/proto`

    const files = readdirSync(dir)
      .map((filename) => `${dir}/${filename}`)
      .filter((file) => /.proto$/.test(file))

    const packageDefinition = protoLoader.loadSync(files, protoLoaderOptions)
    return grpc.loadPackageDefinition(packageDefinition).waves
  }
}
