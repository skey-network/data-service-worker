// import * as FT from './FactoryTypes'
// import { basicInfoEntries } from './FactoryHelpers'
// import { getInstance } from 'skey-lib'

// // TODO
// const lib = getInstance({
//   nodeUrl: 'http://localhost:7100',
//   chainId: 'R'
// })

// export const broadcastAccount = async (account: FT.Account) => {
//   const { type, name, description, seed } = account
//   await lib.insertData(basicInfoEntries(type, name, description), seed)
// }

// export const broadcastDappFather = (dappFather: FT.DappFather) =>
//   broadcastAccount(dappFather)

// export const broadcastSupplier = (supplier: FT.Supplier) => broadcastAccount(supplier)

// export const broadcastOrganisation = (organisation: FT.Organisation) =>
//   broadcastAccount(organisation)

// export const broadcastUser = (user: FT.User) => broadcastAccount(user)

// export const broadcastDevice = async (device: FT.Device) => {
//   await lib.insertData(deviceEntries(device), device.seed)
// }

// export const modifyStatus = async (
//   account: FT.Account,
//   prefix: string,
//   id: string,
//   active: boolean
// ) => {
//   const value = active ? 'active' : 'inactive'
//   const key = `${prefix}_${id}`
//   await lib.insertData([{ key, value }], account.seed)
// }

// export const deviceEntries = (device: FT.Device) => [
//   ...[
//     'name',
//     'description',
//     'type',
//     'supplier',
//     'owner',
//     'active',
//     'visible',
//     'connected'
//   ].map((prop) => ({
//     key: prop,
//     value: (device as any)[prop]
//   })),
//   ...['lat', 'lng', 'alt'].map((prop) => ({
//     key: prop,
//     value: (device as any)[prop].toString()
//   })),
//   ...['details', 'custom'].map((prop) => ({
//     key: prop,
//     value: JSON.stringify((device as any)[prop])
//   }))
// ]
