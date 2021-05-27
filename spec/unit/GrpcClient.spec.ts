import '../setup'

import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import * as GrpcClient from '../../src/GrpcClient'
import config from '../../config'

describe('GrpcClient', () => {
  describe('loadProto', () => {
    it('loads correct proto from files', () => {
      const loadSync = jest.spyOn(protoLoader, 'loadSync')

      const cwd = process.cwd()
      const proto = GrpcClient.loadProto()

      const arr = [
        `${cwd}/proto/accounts_api.proto`,
        `${cwd}/proto/amount.proto`,
        `${cwd}/proto/assets_api.proto`,
        `${cwd}/proto/block.proto`,
        `${cwd}/proto/blockchain_api.proto`,
        `${cwd}/proto/blockchain_updates.proto`,
        `${cwd}/proto/blocks_api.proto`,
        `${cwd}/proto/events.proto`,
        `${cwd}/proto/invoke_script_result.proto`,
        `${cwd}/proto/order.proto`,
        `${cwd}/proto/recipient.proto`,
        `${cwd}/proto/transaction.proto`,
        `${cwd}/proto/transactions_api.proto`
      ]

      expect(loadSync.mock.calls[0][0]).toEqual(arr)
      expect(proto.node.grpc).toBeDefined()
      expect(proto.events.grpc).toBeDefined()
    })
  })

  describe('createApi', () => {
    it('works', () => {
      const fn = jest.fn()

      class TestClass {
        constructor(url: any, credentials: any) {
          fn(url, credentials)
        }
      }

      const client = GrpcClient.createApi(TestClass, 3000)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn.mock.calls[0][0]).toBe(`${config().grpc.host}:3000`)
      expect(fn.mock.calls[0][1]).toBeInstanceOf(grpc.ChannelCredentials)
      expect(client).toBeDefined()
    })
  })

  describe('createGrpcClient', () => {
    it('apis are defined', () => {
      const instance = GrpcClient.createGrpcClient()

      expect(instance.blockchainUpdatesApiClient).toBeDefined()
      expect(instance.blocksApiClient).toBeDefined()
      expect(instance.assetsApiClient).toBeDefined()
    })
  })
})
