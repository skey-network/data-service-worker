// import '../setup'
// import * as helper from '../helper'
// import * as fixtures from '../fixtures'

// describe('handleUpdateDevices', () => {
//   let app = helper.createApp()
//   let save: jest.SpyInstance
//   let update: jest.SpyInstance

//   beforeEach(async () => {
//     app = helper.createApp()
//     await app.db.connect()

//     save = jest.spyOn(app.db.deviceRepository, 'save')
//     update = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')
//   })

//   afterEach(async () => {
//     await app.db.disconnect()
//     await helper.lib.waitForNBlocks(1)
//   })

//   it('update device when its saved in db', async () => {
//     // GIVEN
//     const device = helper.lib.createAccount()
//     await app.db.deviceRepository.save({ address: device.address })
//     await helper.lib.transfer(device.address, 1, helper.genesis)

//     const event = helper.lib.insertData(
//       [{ key: 'name', value: 'test name' }],
//       device.seed
//     )

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleUpdateDevices.bind(app.txHandler),
//       event,
//       update
//     )

//     // THEN
//     const result = await app.db.deviceRepository.findOne({ address: device.address })

//     expect(result?.name).toBe('test name')
//   })

//   it('nested update', async () => {
//     // GIVEN
//     const device = helper.lib.createAccount()
//     await helper.lib.transfer(device.address, 1, helper.genesis)
//     await app.db.deviceRepository.save({ address: device.address })

//     const event = helper.lib.insertData(fixtures.exampleDeviceEntries, device.seed)

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleUpdateDevices.bind(app.txHandler),
//       event,
//       update
//     )

//     // THEN
//     const result = await app.db.deviceRepository.findOne({ address: device.address })

//     expect(result).toEqual({
//       id: result?.id,
//       address: device.address,
//       ...fixtures.exampleDeviceObject
//     })
//   })

//   it('device is not saved in db', async () => {
//     // GIVEN
//     const device = helper.lib.createAccount()
//     await helper.lib.transfer(device.address, 1, helper.genesis)

//     const event = helper.lib.insertData(
//       [
//         { key: 'description', value: 'hello' },
//         { key: 'dapp', value: 'addr' }
//       ],
//       device.seed
//     )

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleUpdateDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     const result = await app.db.deviceRepository.findOne({ address: device.address })

//     expect(result?.whitelisted).toBe(false)
//   })

//   it('no updates', async () => {
//     // GIVEN
//     const event = helper.lib.delay(2000)

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleUpdateDevices.bind(app.txHandler),
//       event,
//       save
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//     expect(update).toHaveBeenCalledTimes(0)
//   })

//   it('invalid key entry', async () => {
//     // GIVEN
//     const device = helper.lib.createAccount()
//     await helper.lib.transfer(device.address, 1, helper.genesis)
//     await app.db.deviceRepository.save({ address: device.address })

//     save.mockClear()

//     const event = helper.lib.insertData(
//       [{ key: 'lammas', value: 'test lamma' }],
//       device.seed
//     )

//     // WHEN
//     await helper.testListener(
//       app,
//       app.txHandler.handleUpdateDevices.bind(app.txHandler),
//       event,
//       update
//     )

//     // THEN
//     expect(save).toHaveBeenCalledTimes(0)
//     expect(update).toHaveBeenCalledTimes(0)
//   })
// })
