import { readFileSync } from 'fs'
import { Config } from '../../../src/Config'
import { Account } from './Account'
import faker from 'faker'
import * as FactoryHelpers from '../FactoryHelpers'
import { deviceTypeValues, DeviceType } from '../../../schemas/Device'

export interface DeviceRandomDetails {
  physicalAddress: DeviceRandomPhysicalAddress
  deviceType: DeviceType
  deviceModel: string
  additionalDescription: string
  assetUrl: string
  url: string
  contactInfo: string
}

export interface DeviceRandomPhysicalAddress {
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  state: string
  country: string
  number: string
  floor: string
}

export type DeviceRandomCustomData = { [key: string]: string | number | boolean }

export interface DeviceRandomData {
  active: boolean
  connected: boolean
  visible: boolean
  lat: number
  lng: number
  alt: number
  details: DeviceRandomDetails
  custom: DeviceRandomCustomData
}

export interface Entry {
  key: string
  value: string | boolean | number
}

export const keysMap = {
  strings: [] as string[],
  floats: ['lat', 'lng', 'alt'],
  booleans: ['active', 'connected', 'visible'],
  json: ['details', 'custom']
}

export class Device extends Account {
  keys: string[] = []
  supplier?: string
  owner?: string
  data: DeviceRandomData

  constructor(config: Config) {
    super('device', config)
    this.data = this.randomData()
  }

  get script() {
    return readFileSync('./artifacts/device.txt', 'utf-8')
  }

  async broadcast() {
    await Promise.all([
      this.lib.insertData(
        [
          { key: 'type', value: 'device' },
          { key: 'name', value: this.name },
          { key: 'description', value: this.description },
          ...this.dataEntries()
        ],
        this.seed
      ),
      this.lib.setScript(this.script, this.seed)
    ])
  }

  async whiteListKeys(ids: string[]) {
    await this.modifyListItems('key', ids, true, this.keys)
  }

  async setSupplier(address: string) {
    await this.lib.insertData(
      [
        { key: 'supplier', value: address },
        { key: 'owner', value: address }
      ],
      this.seed
    )

    this.supplier = address
    this.owner = address
  }

  dataEntries(): Entry[] {
    return Object.entries(this.data).map(([key, value]) => {
      if (keysMap.strings.includes(key)) {
        return { key, value }
      }

      if (keysMap.floats.includes(key)) {
        return { key, value: value.toString() }
      }

      if (keysMap.booleans.includes(key)) {
        return { key, value }
      }

      if (keysMap.json.includes(key)) {
        return { key, value: JSON.stringify(value) }
      }
      return { key, value: null }
    })
  }

  randomData(): DeviceRandomData {
    return {
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
      alt: Math.random() * 1000,
      active: FactoryHelpers.randBool(),
      visible: FactoryHelpers.randBool(),
      connected: FactoryHelpers.randBool(),
      details: this.randomDetails(),
      custom: this.randomCustomData()
    }
  }

  randomCustomData(): DeviceRandomCustomData {
    return {
      powerLevel: FactoryHelpers.randInt(0, 100),
      [faker.random.word()]: faker.random.word(),
      [faker.random.word()]: FactoryHelpers.randBool()
    }
  }

  randomPhysicalAddress(): DeviceRandomPhysicalAddress {
    return {
      addressLine1: faker.address.streetAddress(),
      addressLine2: `${faker.address.state()} ${faker.address.zipCode()}`,
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      state: faker.address.state(),
      country: faker.address.country(),
      number: FactoryHelpers.randInt(1, 40).toString(),
      floor: FactoryHelpers.randInt(0, 10).toString()
    }
  }

  randomDetails(): DeviceRandomDetails {
    return {
      deviceType: FactoryHelpers.randElement(deviceTypeValues as DeviceType[]),
      deviceModel: faker.vehicle.model(),
      additionalDescription: faker.lorem.paragraph(5),
      assetUrl: faker.internet.url(),
      url: faker.internet.url(),
      contactInfo: faker.lorem.paragraph(2),
      physicalAddress: this.randomPhysicalAddress()
    }
  }
}
