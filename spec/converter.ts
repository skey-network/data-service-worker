import { Document, LeanDocument } from 'mongoose'
import { DatabaseClient } from '../src/Clients/DatabaseClient'
import { CommonContext } from './e2e/CommonContext'
import { Context } from './factory/models/Context'

// TODO handle issueTimestamp

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

export const sortByAssetId = <T extends { assetId: string }>(arr: T[]): T[] =>
  arr.sort((a, b) => (a.assetId < b.assetId ? -1 : 1))

export const sortByTxHash = <T extends { txHash: string }>(arr: T[]): T[] =>
  arr.sort((a, b) => (a.txHash < b.txHash ? -1 : 1))

export const toObject = <T extends Document<any>>(
  doc: T
): Omit<LeanDocument<T>, StrippedProps> =>
  excludeProps(doc.toObject() as any, strippedProps) as any

export const bToCommonContext = (ctx: Context): CommonContext => {
  return {
    devices: sortByAddress(
      ctx.devices.map((device) => ({
        ...excludeProps(device, ['config', 'seed', 'data']),
        ...device.data,
        keys: device.keys.sort()
      }))
    ),
    suppliers: sortByAddress(
      ctx.suppliers
        .map((supplier) => excludeProps({ ...supplier }, ['config', 'seed']))
        .map((supplier) => ({
          ...supplier,
          devices: supplier.devices.sort(),
          whitelisted: ctx.dappFather.suppliers.includes(supplier.address)
        }))
    ),
    organisations: sortByAddress(
      ctx.organisations
        .map((organisation) => excludeProps({ ...organisation }, ['config', 'seed']))
        .map((organisation) => ({
          ...organisation,
          whitelisted: ctx.dappFather.organisations.includes(organisation.address)
        }))
    ),
    keys: sortByAssetId(
      ctx.keys.map((key) =>
        excludeProps(
          { ...key, issuer: key.owner, issueTimestamp: 0, burned: false } as any,
          ['config', 'issuerSeed']
        )
      ) as any
    ),
    events: sortByTxHash(
      ctx.events
        .map((event) => excludeProps({ ...event }, ['senderSeed', 'config']))
        .map((event) => ({
          txHash: event.txHash!,
          sender: event.supplier,
          assetId: event.key,
          action: event.action,
          status: 'SUCCEEDED'
        }))
    )
  }
}

export const dbToCommonContext = async (db: DatabaseClient): Promise<CommonContext> => {
  const devices = await db.models.deviceModel.find()
  const suppliers = await db.models.supplierModel.find()
  const organisations = await db.models.organisationModel.find()
  const keys = await db.models.keyModel.find()
  const events = await db.models.eventModel.find()

  return {
    devices: sortByAddress(devices.map(toObject)) as any,
    suppliers: sortByAddress(
      suppliers
        .map(toObject)
        .map((supplier) => ({ ...supplier, devices: supplier.devices.sort() }))
    ),
    organisations: sortByAddress(organisations.map(toObject)),
    keys: sortByAssetId(
      keys.map(toObject).map((key) => ({ ...key, issueTimestamp: 0 }))
    ) as any,
    events: sortByTxHash(events.map(toObject)) as any
  }
}
