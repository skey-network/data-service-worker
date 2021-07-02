import { Connection } from 'mongoose'

import { DeviceModel, DeviceSchema, Device } from './Device'
import { EventModel, EventSchema, Event } from './Event'
import { KeyModel, KeySchema, Key } from './Key'
import { OrganisationModel, OrganisationSchema, Organisation } from './Organisation'
import { SupplierModel, SupplierSchema, Supplier } from './Supplier'

export interface Models {
  deviceModel: DeviceModel
  eventModel: EventModel
  keyModel: KeyModel
  organisationModel: OrganisationModel
  supplierModel: SupplierModel
}

export const createModels = (connection: Connection): Models => ({
  deviceModel: connection.model(Device.name, DeviceSchema),
  eventModel: connection.model(Event.name, EventSchema),
  keyModel: connection.model(Key.name, KeySchema),
  organisationModel: connection.model(Organisation.name, OrganisationSchema),
  supplierModel: connection.model(Supplier.name, SupplierSchema)
})
