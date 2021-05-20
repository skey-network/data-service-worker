import { Injectable } from 'injection-js'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import config from '../config'
import { readdirSync } from 'fs'
import type { BlocksApiClient, BlockchainUpdatesApiClient } from './Types'

const protoLoaderOptions: protoLoader.Options = Object.freeze({
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

@Injectable()
export class GrpcClient {
  public blocksApiClient: BlocksApiClient
  public blockchainUpdatesApiClient: BlockchainUpdatesApiClient
  public proto: any

  constructor() {
    this.proto = this.loadProto()

    const { node, events } = this.proto

    this.blocksApiClient = this.createApi(node.grpc.BlocksApi, config.grpc.apiPort)

    this.blockchainUpdatesApiClient = this.createApi(
      events.grpc.BlockchainUpdatesApi,
      config.grpc.updatesPort
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
