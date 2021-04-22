import '../setup'
import * as helper from '../helper'

const exampleEntries = [
  { key: 'name', value: 'name' },
  { key: 'type', value: 'type' },
  { key: 'description', value: 'description' },
  { key: 'additional_description', value: 'additional_description' },
  { key: 'asset_url', value: 'asset_url' },
  { key: 'url', value: 'url' },
  { key: 'contact', value: 'contact' },
  { key: 'visible', value: true },
  { key: 'lat', value: '50.12' },
  { key: 'lng', value: '30.54' },
  { key: 'alt', value: '11111' },
  { key: 'address_line_1', value: 'address_line_1' },
  { key: 'address_line_2', value: 'address_line_2' },
  { key: 'city', value: 'city' },
  { key: 'postcode', value: 'postcode' },
  { key: 'state', value: 'state' },
  { key: 'country', value: 'country' },
  { key: 'number', value: 'number' },
  { key: 'floor', value: 'floor' },
  { key: 'active', value: 'false' },
  { key: 'connected', value: false },
  { key: 'dapp', value: 'dapp' },
  { key: 'owner', value: 'owner' },
  { key: 'device_model', value: 'device_model' },
  { key: 'custom_val1', value: 'val1' },
  { key: 'custom_val2', value: 'val2' }
]

const exampleObject = {
  name: 'name',
  description: 'description',
  type: 'type',
  additionalDescription: 'additional_description',
  assetUrl: 'asset_url',
  url: 'url',
  visible: true,
  active: false,
  connected: false,
  dapp: 'dapp',
  owner: 'owner',
  deviceModel: 'device_model',
  custom: { val2: 'val2', val1: 'val1' },
  location: { lat: 50.12, lng: 30.54, alt: 11111 },
  physicalAddress: {
    addressLine1: 'address_line_1',
    addressLine2: 'address_line_2',
    city: 'city',
    postcode: 'postcode',
    state: 'state',
    country: 'country',
    number: 'number'
  }
}

describe('handleUpdateDevice', () => {
  let app = helper.createApp()

  beforeEach(async () => {
    app = helper.createApp()
    await app.db.connect()
  })

  afterEach(async () => {
    await app.db.disconnect()
  })

  it('update device when its saved in db', async () => {
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

  it('nested update', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleUpdateDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')

    const device = helper.lib.createAccount()
    await helper.lib.transfer(device.address, 1, helper.genesis)

    await app.db.deviceRepository.save({ address: device.address })

    await helper.lib.insertData(exampleEntries, device.seed)

    await helper.waitForCall(spy)
    await promise.cancel()

    const result = await app.db.deviceRepository.findOne({ address: device.address })

    expect(result).toEqual({ id: result?.id, address: device.address, ...exampleObject })

    await helper.lib.waitForNBlocks(1)
  })

  it('device is not saved in db', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleUpdateDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')

    const device = helper.lib.createAccount()
    await helper.lib.transfer(device.address, 1, helper.genesis)

    await helper.lib.insertData([{ key: 'description', value: 'hello' }], device.seed)

    await helper.waitForCall(spy)
    await promise.cancel()

    const result = await app.db.deviceRepository.findOne({ address: device.address })

    expect(result?.whitelisted).toBe(false)

    await helper.lib.waitForNBlocks(1)
  })

  it('no updates', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleUpdateDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')
    spy.mockReset()

    await helper.waitForCall(spy)
    await promise.cancel()

    expect(spy).toHaveBeenCalledTimes(0)

    await helper.lib.waitForNBlocks(1)
  })

  it('invalid key entry', async () => {
    const height = await app.blockchain.fetchHeight()

    const promise = app.listener.subscribe(
      (chunk) => app.txHandler.handleUpdateDevices(chunk),
      height
    )

    const spy = jest.spyOn(app.db.deviceRepository, 'findOneAndUpdate')
    spy.mockReset()

    const device = helper.lib.createAccount()
    await helper.lib.transfer(device.address, 1, helper.genesis)

    await app.db.deviceRepository.save({ address: device.address })

    await helper.lib.insertData([{ key: 'lammas', value: 'test lamma' }], device.seed)

    await helper.waitForCall(spy)
    await promise.cancel()

    expect(spy).toHaveBeenCalledTimes(0)

    await helper.lib.waitForNBlocks(1)
  })
})
