import '../setup'
import * as helper from '../helper'

describe('handleUpdateDevice', () => {
  let app = helper.createApp()

  beforeAll(async () => {
    await app.db.connect()
  })

  afterAll(async () => {
    await app.db.disconnect()
  })

  it('update device', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleUpdateDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')

    const device = helper.lib.createAccount()
    await helper.lib.transfer(device.address, 1, helper.genesis)

    await app.db.deviceRepository.save({ address: device.address })

    await helper.lib.insertData([{ key: 'name', value: 'test name' }], device.seed)

    await helper.waitForCall(spy)
    await promise.cancel()

    const result = await app.db.deviceRepository.findOne({ address: device.address })

    expect(result?.name).toBe('test name')

    await helper.lib.waitForNBlocks(1)
  })
})
