// import '../setup'
// import * as helper from '../helper'

// describe('handleAddDevices', () => {
//   let app = helper.createApp()
//   let save: jest.SpyInstance

//   beforeEach(async () => {
//     app = helper.createApp()
//     await app.db.connect()
//     save = jest.spyOn(app.db.deviceRepository, 'save')
//   })

//   afterEach(async () => {
//     await app.db.disconnect()
//     await helper.lib.waitForNBlocks(1)
//   })

//   it('adds devices to database', async () => {
//     // GIVEN
//     const devices = helper.createMultipleAccounts(3)

//     const event = helper.lib.insertData(
//       devices.map((account) => ({ key: `device_${account.address}`, value: 'active' })),
//       helper.genesis
//     )

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleAddDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     const results = await Promise.all(
//       devices.map((account) =>
//         app.db.deviceRepository.findOne({ address: account.address })
//       )
//     )

//     results.forEach((result) => {
//       expect(result?.address).toBeDefined()
//       expect(result?.dapp).toBeDefined()
//       expect(result?.owner).toBeDefined()
//       expect(result?.whitelisted).toBe(true)
//     })
//   })

//   it('no updates', async () => {
//     // GIVEN
//     const event = helper.lib.delay(3000)

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleAddDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//   })

//   it('is not dapp', async () => {
//     // GIVEN
//     const event = (async () => {
//       const sender = helper.lib.createAccount()
//       const deviceAddress = helper.lib.createAccount().address

//       await helper.lib.transfer(sender.address, 1, helper.genesis)

//       await helper.lib.insertData(
//         [{ key: `device_${deviceAddress}`, value: 'active' }],
//         sender.seed
//       )
//     })()

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleAddDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//   })

//   it('invalid entry key', async () => {
//     // GIVEN
//     const event = helper.lib.insertData(
//       [{ key: `device_aaa`, value: 'active' }],
//       helper.genesis
//     )

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleAddDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//   })

//   it('invalid entry value', async () => {
//     // GIVEN
//     const event = (async () => {
//       const deviceAddress = helper.lib.createAccount().address

//       await helper.lib.insertData(
//         [{ key: `device_${deviceAddress}`, value: 'hello' }],
//         helper.genesis
//       )
//     })()

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleAddDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//   })
// })
