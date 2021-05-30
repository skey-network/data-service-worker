import '../setup'

import { Factory, Helpers, Types } from '../factory'
import * as Database from '../../src/Database'
import * as helper from '../helper'
import { handleDeviceUpdates } from '../../src/TxHandlers/DeviceHandler'
import { Device } from '../../models/Device'

const cases = Factory.createMultipleDevices(3).map((c) => ({
  ...c,
  props: {
    ...c.props,
    keys: Array(2)
      .fill(0)
      .map(() => Helpers.randTxHash())
  },
  toString: c.meta.toString
}))

const steps = [
  {
    toString: () => 'create devices',
    transfer: true,
    entries: (props: Types.DeviceProps) => [{ key: 'type', value: 'device' }],
    expected: (props: Types.DeviceProps) => ({
      address: props.address,
      keys: []
    })
  },
  {
    toString: () => 'update devices',
    transfer: false,
    entries: (props: Types.DeviceProps) => [
      { key: 'name', value: props.name! },
      { key: 'description', value: props.description! }
    ],
    expected: (props: Types.DeviceProps) => ({
      address: props.address,
      name: props.name,
      description: props.description,
      keys: []
    })
  },
  {
    toString: () => 'whitelist keys',
    transfer: false,
    entries: (props: Types.DeviceProps) =>
      props.keys.map((key) => ({ key: `key_${key}`, value: 'active' })),
    expected: (props: Types.DeviceProps) => ({
      address: props.address,
      name: props.name,
      description: props.description,
      keys: props.keys
    })
  },
  {
    toString: () => 'blacklist keys',
    transfer: false,
    entries: (props: Types.DeviceProps) =>
      props.keys.map((key) => ({ key: `key_${key}`, value: 'inactive' })),
    expected: (props: Types.DeviceProps) => ({
      address: props.address,
      name: props.name,
      description: props.description,
      keys: []
    })
  }
]

describe('DeviceHandler', () => {
  let cancelSubscription = async () => {}

  beforeAll(async () => {
    await Database.connect()

    cancelSubscription = await helper.getListenerInstance(handleDeviceUpdates)
  })

  afterAll(async () => {
    await cancelSubscription()
    await Database.disconnect()
  })

  describe.each(steps)('%s', (step) => {
    beforeAll(async () => {
      if (step.transfer) {
        await Promise.all(cases.map((device) => helper.sponsor(device.props.address)))
      }

      await Promise.all(
        cases.map((device) => {
          return helper.lib.insertData(step.entries(device.props), device.meta.seed!)
        })
      )

      await helper.delay(2000)
    })

    test.each(cases)('%s', async (args) => {
      const expected = step.expected(args.props)
      const doc = (await Device.findOne({ address: expected.address }))!

      const picked = ((obj) => ({
        address: obj.address,
        name: obj.name,
        description: obj.description,
        keys: Array.from(obj.keys)
      }))(doc)

      expect(picked).toEqual(expected)
    })
  })
})
