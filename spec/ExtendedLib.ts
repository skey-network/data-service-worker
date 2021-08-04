import { getInstance as rawGetInstance } from 'skey-lib'
import * as Transactions from '@waves/waves-transactions'
import { Config } from '../src/Config'

export type IssueTokenParams = Omit<Transactions.IIssueParams, 'chainId'> & {
  seed: string
}

export const getInstance = (config: Config) => {
  const { nodeUrl, chainId } = config.blockchain
  const { genesisSeed } = config.test

  const lib = rawGetInstance({ nodeUrl, chainId })

  const issueToken = async (input: IssueTokenParams) => {
    const tx = Transactions.issue({ ...input, chainId }, input.seed)

    // any fixes problem with docker build and skey-lib
    return await lib.broadcast(tx as any)
  }

  const createAccount = () => {
    const { address, seed } = lib.createAccount()
    return { address, seed }
  }

  const sponsor = async (address: string, amount = 1) => {
    if (!genesisSeed) throw new Error('genesisSeed is missing')

    return await lib.transfer(address, amount, genesisSeed)
  }

  const createMultipleAccounts = (amount: number) =>
    [...Array(amount)].map(() => createAccount())

  const burnKey = async (assetId: string, seed: string) => {
    const params: Transactions.IBurnParams = {
      assetId,
      chainId,
      amount: 1
    }

    const tx = Transactions.burn(params, seed)
    return await lib.broadcast(tx)
  }

  return {
    ...lib,
    issueToken,
    createAccount,
    sponsor,
    createMultipleAccounts,
    burnKey
  }
}
