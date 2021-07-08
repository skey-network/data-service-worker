import { Document, LeanDocument } from 'mongoose'
import { DatabaseClient } from '../src/Database'
import { CommonContext } from './e2e/CommonContext'
import { Context } from './factory/models/Context'

export const excludeProps = <T extends Object, Y extends (keyof T)[]>(
  obj: T,
  fields: Y
): Omit<T, Y[number]> =>
  Object.entries(obj)
    .filter(([key]) => !fields.includes(key as any))
    .map(([key, value]) => ({ [key]: value }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {}) as any

export type StrippedProps = '_id' | 'id' | '__v' | 'createdAt' | 'updatedAt'
export const strippedProps = ['id', '_id', '__v', 'createdAt', 'updatedAt']

export const sortByAddress = <T extends { address: string }>(arr: T[]): T[] =>
  arr.sort((a, b) => (a.address < b.address ? -1 : 1))

export const toObject = <T extends Document<any>>(
  doc: T
): Omit<LeanDocument<T>, StrippedProps> =>
  excludeProps(doc.toObject() as any, strippedProps) as any

export const bToCommonContext = (ctx: Context): CommonContext => {
  return {
    devices: sortByAddress(
      ctx.devices
        .map((device) => ({ ...device, data: undefined, ...device.data }))
        .map((device) => excludeProps(device, ['config', 'seed']))
    ),
    suppliers: sortByAddress(
      ctx.suppliers.map((supplier) => excludeProps({ ...supplier }, ['config', 'seed']))
    ),
    organisations: sortByAddress(
      ctx.organisations.map((organisation) =>
        excludeProps({ ...organisation }, ['config', 'seed'])
      )
    )
  }
}

export const dbToCommonContext = async (db: DatabaseClient): Promise<CommonContext> => {
  const devices = await db.models.deviceModel.find()
  const suppliers = await db.models.supplierModel.find()
  const organisations = await db.models.organisationModel.find()

  return {
    devices: sortByAddress(devices.map(toObject)) as any,
    suppliers: sortByAddress(suppliers.map(toObject)),
    organisations: sortByAddress(organisations.map(toObject))
  }
}
