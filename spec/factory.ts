import * as helper from './helper'
import faker from 'faker'
import { ExtractProps } from 'ts-mongoose'

import { DeviceSchema, deviceTypes } from '../models/Device'
import { SupplierSchema } from '../models/Supplier'
import { KeySchema } from '../models/Key'
import { EventSchema } from '../models/Event'

export namespace Types {
  type OmitProps<T> = Omit<T, '_id' | '__v' | 'createdAt' | 'updatedAt'>
  type Props<T extends Record<'definition', any>> = OmitProps<ExtractProps<T>>

  export type DeviceProps = Props<typeof DeviceSchema>
  export type SupplierProps = Props<typeof SupplierSchema>
  export type KeyProps = Props<typeof KeySchema>
  export type EventProps = Props<typeof EventSchema>

  export type Meta = {
    toString: () => string
    seed?: string
  }
}

export namespace Helpers {
  export const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * max + min)

  export const randElement = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)]

  export const randBool = () => Math.random() < 0.5

  export const randTimestamp = () => {
    const day = 3600 * 24 * 1000
    const year = 365 * day

    const min = Date.now() + day
    const max = Date.now() + year

    return randInt(min, max)
  }

  export const multiple = <T>(func: () => T) => {
    return (count: number) =>
      Array(count)
        .fill(null)
        .map(() => func())
  }

  export const randTxHash = () => {
    return Array(2)
      .fill(null)
      .map(() => helper.createAccount().address)
      .join('')
      .substring(0, 44)
  }
}

export namespace Factory {
  export const createSingleSupplier = () => {
    const acc = helper.createAccount()

    const props: Types.SupplierProps = {
      address: acc.address,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      devices: helper.createMultipleAccounts(3).map((d) => d.address),
      whitelisted: false
    }

    const meta: Types.Meta = {
      toString: () => `[supplier] ${props.address}`,
      seed: acc.seed
    }

    return { props, meta }
  }

  export const createSingleEvent = () => {
    const props: Types.EventProps = {
      txHash: Helpers.randTxHash(),
      sender: helper.createAccount().address,
      assetId: Helpers.randTxHash(),
      action: faker.random.word(),
      status: faker.random.word()
    }

    const meta = {
      toStirng: () => `[event] ${props.txHash}`
    }

    return { props, meta }
  }

  export const createSingleKey = () => {
    const props: Types.KeyProps = {
      assetId: Helpers.randTxHash(),
      issuer: helper.createAccount().address,
      owner: helper.createAccount().address,
      name: faker.random.word(),
      device: helper.createAccount().address,
      validTo: Helpers.randTimestamp(),
      issueTimestamp: Date.now()
    }

    const meta: Types.Meta = {
      toString: () => `[key] ${props.assetId}`
    }

    return { props, meta }
  }

  export const createSingleDevice = () => {
    const acc = helper.createAccount()

    const props: Types.DeviceProps = {
      address: acc.address,
      supplier: helper.createAccount().address,
      owner: helper.createAccount().address,
      name: faker.random.alphaNumeric(10),
      description: faker.lorem.paragraph(2),
      lat: Number(faker.address.latitude()),
      lng: Number(faker.address.longitude()),
      alt: Math.random() * 1000,
      active: Helpers.randBool(),
      visible: Helpers.randBool(),
      connected: Helpers.randBool(),
      details: {
        deviceType: Helpers.randElement(deviceTypes as any),
        deviceModel: faker.vehicle.model(),
        additionalDescription: faker.lorem.paragraph(5),
        assetUrl: faker.internet.url(),
        url: faker.internet.url(),
        contactInfo: faker.lorem.paragraph(2),
        physicalAddress: {
          addressLine1: faker.address.streetAddress(),
          addressLine2: `${faker.address.state()} ${faker.address.zipCode()}`,
          city: faker.address.city(),
          postcode: faker.address.zipCode(),
          state: faker.address.state(),
          country: faker.address.country(),
          number: Helpers.randInt(1, 40).toString(),
          floor: Helpers.randInt(0, 10).toString()
        }
      },
      custom: {
        powerLevel: Helpers.randInt(0, 100),
        [faker.random.word()]: faker.random.word(),
        [faker.random.word()]: Helpers.randBool()
      },
      keys: []
    }

    const meta: Types.Meta = {
      toString: () => `[device] ${props.address}`,
      seed: acc.seed
    }

    return { props, meta }
  }

  export const createMultipleSuppliers = Helpers.multiple(createSingleSupplier)
  export const createMultipleDevices = Helpers.multiple(createSingleDevice)
  export const createMultipleKeys = Helpers.multiple(createSingleKey)
  export const createMultipleEvents = Helpers.multiple(createSingleEvent)
}
