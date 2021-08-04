import { accounts } from '../helper'
import { DappFather } from './models/DappFather'
import { Config } from '../../src/Config'
import { Context } from './models/Context'
import { Account } from './models/Account'
import { Supplier } from './models/Supplier'
import { Organisation } from './models/Organisation'
import { Device } from './models/Device'
import { User } from './models/User'
import { randElement } from './FactoryHelpers'
import { Key } from './models/Key'
import { getInstance } from 'skey-lib'
import { Event } from './models/Event'

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

  get lib() {
    return getInstance({
      nodeUrl: this.config.blockchain.nodeUrl,
      chainId: this.config.blockchain.chainId
    })
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

    await this.ctx.dappFather.whitelistSuppliers(
      this.ctx.suppliers.map((supplier) => supplier.address)
    )

    await this.ctx.dappFather.whitelistOrganisations(
      this.ctx.organisations.map((organisation) => organisation.address)
    )

    await this.connectDevices()
    await this.createKeys()
    await this.createEvents()
  }

  async connectDevices() {
    await Promise.all(
      this.ctx.devices.map(async (device) => {
        const supplier = randElement(this.ctx.suppliers)

        await Promise.all([
          device.setSupplier(supplier.address),
          supplier.whitelistDevices([device.address])
        ])
      })
    )
  }

  async createKeys() {
    await Promise.all(
      this.ctx.devices.map(async (device) => {
        const supplier = this.ctx.suppliers.find(
          (supplier) => supplier.address === device.supplier
        )!

        const key = new Key(supplier.seed, supplier.address, device.address, this.config)

        await key.broadcast()
        await device.whiteListKeys([key.assetId!])

        this.ctx.keys.push(key)
      })
    )
  }

  async createEvents() {
    await Promise.all(
      this.ctx.keys.map(async (key) => {
        const owner = this.ctx.accounts.find((acc) => acc.address === key.owner)!

        const event = new Event(owner.seed, owner.address, key.assetId!, this.config)
        await event.broadcast()

        this.ctx.events.push(event)
      })
    )
  }

  // TODO refactor this

  async sponsorAccounts() {
    await Promise.all(
      this.ctx.accounts.map((acc) =>
        this.lib.transfer(acc.address, 1, accounts.genesis.seed)
      )
    )
  }
}
