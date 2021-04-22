import '../setup'
import * as helper from '../helper'

describe('handleAddDevices', () => {
  let app = helper.createApp()

  beforeAll(async () => {
    await app.db.connect()
  })

  afterAll(async () => {
    await app.db.disconnect()
  })

  it('adds devices to database', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleAddDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'save')

    const device1Address = helper.lib.createAccount().address
    const device2Address = helper.lib.createAccount().address

    await helper.lib.insertData(
      [
        { key: `device_${device1Address}`, value: 'active' },
        { key: `device_${device2Address}`, value: 'active' }
      ],
      helper.genesis
    )

    await helper.waitForCall(spy)
    await promise.cancel()

    const dev1 = await app.db.deviceRepository.findOne({ address: device1Address })
    const dev2 = await app.db.deviceRepository.findOne({ address: device2Address })

    expect(dev1).toBeDefined()
    expect(dev1?.address).toBeDefined()
    expect(dev1?.dapp).toBeDefined()
    expect(dev1?.owner).toBeDefined()

    expect(dev2).toBeDefined()

    await helper.lib.waitForNBlocks(1)
  })

  it('no updates', async () => {
    const height = await app.blockchain.fetchHeight()
    const count = await app.db.deviceRepository.count()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleAddDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'save')

    await helper.waitForCall(spy)
    await promise.cancel()

    expect(await app.db.deviceRepository.count()).toBe(count)

    await helper.lib.waitForNBlocks(1)
  })

  it('is not dapp', async () => {
    const sender = helper.lib.createAccount()
    const deviceAddress = helper.lib.createAccount().address

    const height = await app.blockchain.fetchHeight()
    const count = await app.db.deviceRepository.count()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleAddDevices(chunk),
      height
    )

    await helper.lib.transfer(sender.address, 1, helper.genesis)

    await helper.lib.insertData(
      [{ key: `device_${deviceAddress}`, value: 'active' }],
      sender.seed
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'save')

    await helper.waitForCall(spy)
    await promise.cancel()

    expect(await app.db.deviceRepository.count()).toBe(count)

    await helper.lib.waitForNBlocks(1)
  })

  it('invalid entry key', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleAddDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'save')

    await helper.lib.insertData([{ key: `device_aaa`, value: 'active' }], helper.genesis)

    await helper.waitForCall(spy)
    await promise.cancel()

    await helper.lib.waitForNBlocks(1)
  })

  it('invalid entry value', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleAddDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'save')

    const deviceAddress = helper.lib.createAccount().address

    await helper.lib.insertData(
      [{ key: `device_${deviceAddress}`, value: 'hello' }],
      helper.genesis
    )

    await helper.waitForCall(spy)
    await promise.cancel()

    await helper.lib.waitForNBlocks(1)
  })
})
