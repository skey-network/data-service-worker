import { Collection, Connection } from 'mongoose'

export type CollectionName = 'devices' | 'events' | 'keys' | 'suppliers' | 'organisations'

import { DeviceModel, DeviceSchema, Device } from './Device'
import { EventModel, EventSchema, Event } from './Event'
import { KeyModel, KeySchema, Key } from './Key'
import { OrganisationModel, OrganisationSchema, Organisation } from './Organisation'
import { SupplierModel, SupplierSchema, Supplier } from './Supplier'

export interface Models {
  devices: DeviceModel
  events: EventModel
  keys: KeyModel
  organisations: OrganisationModel
  suppliers: SupplierModel
}

export const createModels = (connection: Connection): Models => ({
  devices: connection.model(Device.name, DeviceSchema) as any,
  events: connection.model(Event.name, EventSchema) as any,
  keys: connection.model(Key.name, KeySchema) as any,
  organisations: connection.model(Organisation.name, OrganisationSchema) as any,
  suppliers: connection.model(Supplier.name, SupplierSchema) as any
})
