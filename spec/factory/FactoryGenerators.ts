// import * as FT from './FactoryTypes'
// import * as helper from '../helper'
// import faker from 'faker'
// import * as FactoryHelpers from './FactoryHelpers'

// // export const createDeviceSupplierConn = (ctx: FT.Context): FT.DeviceSupplierConn => {
// //   const device = ctx.devices.find((dev) => !dev.supplier)
// //   if (!device) throw new Error('Cannot find device without supplier')

// //   const supplier = FactoryHelpers.randElement(ctx.suppliers)
// //   if (!supplier) throw new Error('Cannot get random supplier')

// //   return { supplier: supplier.address, device: device.address }
// // }

// export const createSupplier = (): FT.Supplier => ({
//   ...createAccount('supplier'),
//   devices: [],
//   organisations: []
// })

// export const createUser = (): FT.User => createAccount('user')

// export const createOrganisation = (): FT.Organisation => ({
//   ...createAccount('organisation'),
//   users: []
// })

// export const createDappFather = (): FT.DappFather => ({
//   ...createAccount('dappFather'),
//   suppliers: [],
//   organisations: []
// })

// export const createDevice = (): FT.Device => ({
//   ...createAccount('device'),
//   lat: Number(faker.address.latitude()),
//   lng: Number(faker.address.longitude()),
//   alt: Math.random() * 1000,
//   active: FactoryHelpers.randBool(),
//   visible: FactoryHelpers.randBool(),
//   connected: FactoryHelpers.randBool(),
//   details: {
//     deviceType: FactoryHelpers.randElement(['mobile', 'human']),
//     deviceModel: faker.vehicle.model(),
//     additionalDescription: faker.lorem.paragraph(5),
//     url: faker.internet.url(),
//     physicalAddress: {
//       city: faker.address.city(),
//       country: faker.address.country()
//     }
//   },
//   custom: {
//     powerLevel: FactoryHelpers.randInt(0, 100),
//     [faker.random.word()]: faker.random.word(),
//     [faker.random.word()]: FactoryHelpers.randBool()
//   }
// })
