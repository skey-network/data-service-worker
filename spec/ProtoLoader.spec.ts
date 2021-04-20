import './setup'

import * as protoLoader from '@grpc/proto-loader'
import * as grpc from '@grpc/grpc-js'
import { ProtoLoader } from '../src/ProtoLoader'

describe('ProtoLoader', () => {
  it('loads correct files', () => {
    const loadSync = jest.spyOn(protoLoader, 'loadSync').mockImplementation()

    jest.spyOn(grpc, 'loadPackageDefinition').mockReturnValue({ waves: {} })

    const cwd = process.cwd()

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

    new ProtoLoader()

    expect(loadSync.mock.calls[0][0]).toEqual(arr)

    jest.restoreAllMocks()
  })

  it('has correct proto object', () => {
    const loader = new ProtoLoader()

    expect(loader.proto.node.grpc).toBeDefined()
    expect(loader.proto.events.grpc).toBeDefined()
  })
})
