import { Injectable } from 'injection-js'
import * as grpc from '@grpc/grpc-js'
import { BlocksApiClient } from '../proto/interfaces/waves/node/grpc/BlocksApi'
import { ProtoLoader } from './ProtoLoader'
import config from '../config'
import { BlockchainUpdatesApiClient } from '../proto/interfaces/waves/events/grpc/BlockchainUpdatesApi'

@Injectable()
export class GrpcClient {
  public blocksApiClient: BlocksApiClient
  public blockchainUpdatesApiClient: BlockchainUpdatesApiClient

  constructor(private protoLoader: ProtoLoader) {
    const { node, events } = protoLoader.proto

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
}
