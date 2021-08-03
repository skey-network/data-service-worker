import { getInstance } from 'skey-lib'
import config from '../config'
import * as Blockchain from '../src/Clients/BlockchainClient'
import { ParsedUpdate, parseUpdate } from '../src/UpdateParser'
import * as Transactions from '@waves/waves-transactions'

export const accounts = {
  genesis: {
    address: '3MLiRijBGgFLZeXMm6DxHCAVkRnCTxS7hog',
    seed: 'seed seed seed seed seed seed seed seed seed seed seed seed seed seed seed'
  },
  dappFather: {
    address: '3MAAxQ6TGcKyj88UBwX3v3zAX1QxuKsiDdZ',
    seed: 'exist soldier arrow plunge gospel stairs time true tip cruise cheese any gas iron renew'
  }
}

// export const lib = getInstance(config().blockchain)

export const lib = getInstance({
  nodeUrl: 'http://localhost:7100',
  chainId: 'R'
})

export type IssueTokenParams = Omit<Transactions.IIssueParams, 'chainId'> & {
  seed: string
}

export const issueToken = async (input: IssueTokenParams) => {
  const tx = Transactions.issue(
    { ...input, chainId: config().blockchain.chainId },
    input.seed
  )

  return await lib.broadcast(tx)
}

export const delay = lib.delay

export const createAccount = () => {
  const { address, seed } = lib.createAccount()
  return { address, seed }
}

export const sponsor = (address: string, amount = 1) =>
  lib.transfer(address, amount, accounts.genesis.seed)

export const createMultipleAccounts = (amount: number) => {
  return [...Array(amount)].map(() => createAccount())
}

export const burnKey = async (assetId: string, seed: string) => {
  const params: Transactions.IBurnParams = {
    assetId,
    chainId: config().blockchain.chainId,
    amount: 1
  }

  const tx = Transactions.burn(params, seed)
  return await lib.broadcast(tx)
}
