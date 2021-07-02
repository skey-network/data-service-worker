import * as Generators from './FactoryGenerators'
import * as Actions from './FactoryActions'
import * as FT from './FactoryTypes'
import * as Helpers from './FactoryHelpers'
import { sponsor } from '../helper'

export const createBundle = (amount: number) => {
  const df = Generators.createDappFather()
  const ctx = Generators.createContext(df)

  ctx.suppliers = Helpers.multiplyAndExec(Generators.createSupplier, amount)
  ctx.organisations = Helpers.multiplyAndExec(Generators.createOrganisation, amount)
  ctx.users = Helpers.multiplyAndExec(Generators.createSupplier, amount)
  ctx.devices = Helpers.multiplyAndExec(Generators.createDevice, amount)

  return ctx
}

export const sponsorAccounts = async (ctx: FT.Context) => {
  const accounts: FT.Account[] = [
    ctx.dappFather,
    ...ctx.suppliers,
    ...ctx.organisations,
    ...ctx.devices,
    ...ctx.users
  ]

  await Promise.all(accounts.map((acc) => sponsor(acc.address, 1)))
}

export const broadcastBundle = async (ctx: FT.Context) => {
  await Actions.broadcastDappFather(ctx.dappFather)

  await Promise.all(ctx.suppliers.map(Actions.broadcastSupplier))
  await Promise.all(ctx.organisations.map(Actions.broadcastOrganisation))
  await Promise.all(ctx.users.map(Actions.broadcastUser))
  await Promise.all(ctx.devices.map(Actions.broadcastDevice))

  return ctx
}
