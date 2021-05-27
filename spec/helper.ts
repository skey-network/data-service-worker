import { getInstance } from 'skey-lib'
import config from '../config'
import * as Blockchain from '../src/Blockchain'
import { parseUpdate, Update } from '../src/UpdateParser'

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

export const getListenerInstance = async (handler: (update: Update) => Promise<void>) => {
  const height = await Blockchain.fetchHeight()
  return Blockchain.subscribe((chunk) => handler(parseUpdate(chunk)), height).cancel
}
