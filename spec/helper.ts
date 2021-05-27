import { getInstance } from 'skey-lib'
import config from '../config'
import { Blockchain } from '../src/Blockchain'
import { GrpcClient } from '../src/GrpcClient'
import { SubscribeEvent } from '../src/Types'

export const seeds = {
  genesis: 'seed seed seed seed seed seed seed seed seed seed seed seed seed seed seed',
  dappFather:
    'exist soldier arrow plunge gospel stairs time true tip cruise cheese any gas iron renew'
}

export const lib = getInstance({
  nodeUrl: config().blockchain.nodeUrl,
  chainId: config().blockchain.chainId
})

export const delay = lib.delay

export const createAccount = () => {
  const { address, seed } = lib.createAccount()
  return { address, seed }
}

export const sponsor = (address: string, amount = 1) =>
  lib.transfer(address, amount, seeds.genesis)

export const createMultipleAccounts = (amount: number) => {
  return [...Array(amount)].map(() => createAccount())
}

export const getListenerInstance = async (
  handler: (chunk: SubscribeEvent) => Promise<void>
) => {
  const grpcClient = new GrpcClient()
  const blockchainService = new Blockchain(grpcClient)

  const height = await blockchainService.fetchHeight()

  return blockchainService.subscribe(handler, height).cancel
}
