import { sponsor } from '../helper'
import { DappFather } from './models/DappFather'
import { Config } from '../../src/Config'
import { Context } from './models/Context'
import { Account } from './models/Account'
import { Supplier } from './models/Supplier'
import { Organisation } from './models/Organisation'
import { Device } from './models/Device'
import { User } from './models/User'

export const createBundle = async (config: Config, amount: number) => {
  const factory = new Factory(config)
  factory.createBundle(amount)
  await factory.sponsorAccounts()
  await factory.broadcast()
  return factory.ctx
}

export class Factory {
  config: Config
  ctx: Context

  constructor(config: Config) {
    this.config = config
    const df = new DappFather(this.config)
    this.ctx = new Context(df)
  }

  createBundle(amount: number) {
    this.ctx.suppliers = this.createNAccounts(amount, Supplier)
    this.ctx.organisations = this.createNAccounts(amount, Organisation)
    this.ctx.devices = this.createNAccounts(amount, Device)
    this.ctx.users = this.createNAccounts(amount, User)
  }

  createNAccounts<T extends Account>(n: number, classRef: any): T[] {
    return Array(n)
      .fill(null)
      .map(() => new classRef(this.config))
  }

  async broadcast() {
    await Promise.all(this.ctx.accounts.map((acc) => acc.broadcast()))
  }

  async sponsorAccounts() {
    await Promise.all(this.ctx.accounts.map((acc) => sponsor(acc.address, 1)))
  }
}
