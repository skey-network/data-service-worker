import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export type DeviceDocument = Device & Document
export type DeviceModel = Model<DeviceDocument>

export type DeviceType =
  | 'car barrier'
  | 'human barrier'
  | 'elevator'
  | 'human'
  | 'mobile'
  | 'other'

export const deviceTypeValues = Object.freeze([
  'car barrier',
  'human barrier',
  'elevator',
  'human',
  'mobile',
  'other'
])

@Schema()
export class Location {
  @Prop(() => ({
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  }))
  type?: string

  @Prop(() => ({
    type: [Number],
    required: true
  }))
  coordinates: number[]
}

@Schema()
export class PhysicalAddress {
  @Prop(String)
  addressLine1?: string

  @Prop(String)
  addressLine2?: string

  @Prop(String)
  city?: string

  @Prop(String)
  postcode?: string

  @Prop(String)
  state?: string

  @Prop(String)
  country?: string

  @Prop(String)
  number?: string

  @Prop(String)
  floor?: string
}

@Schema()
export class Details {
  @Prop(String)
  deviceType?: string

  @Prop(String)
  deviceModel?: string

  @Prop(String)
  additionalDescription?: string

  @Prop(String)
  assetUrl?: string

  @Prop(String)
  url?: string

  @Prop(String)
  contactInfo?: string

  @Prop(PhysicalAddress)
  physicalAddress?: PhysicalAddress
}

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Device {
  // ==============================
  // ADDRESSES
  // ==============================

  @Prop(String)
  address: string

  @Prop(String)
  supplier?: string

  @Prop(String)
  owner?: string

  // ==============================
  // BASIC INFO
  // ==============================

  @Prop(String)
  name?: string

  @Prop(String)
  description?: string

  // ==============================
  // LOCATION
  // ==============================

  @Prop(Number)
  lat?: number

  @Prop(Number)
  lng?: number

  @Prop(Number)
  alt?: number

  @Prop(Location)
  location?: Location

  // ==============================
  // BOOLEANS
  // ==============================

  @Prop(Boolean)
  visible?: boolean

  @Prop(Boolean)
  active?: boolean

  @Prop(Boolean)
  connected?: boolean

  // ==============================
  // ADDITIONAL INFO
  // ==============================

  @Prop(Details)
  details?: Details

  // ==============================
  // CUSTOM DATA
  // ==============================

  @Prop(String)
  custom?: string

  // ==============================
  // KEYS
  // ==============================

  @Prop([String])
  whitelist?: string[]

  // ==============================
  // TIMESTAMPS
  // ==============================

  @Prop(Date)
  createdAt: Date

  @Prop(Date)
  updatedAt: Date
}

export const DeviceSchema = SchemaFactory.createForClass(Device)

DeviceSchema.index({ location: '2dsphere' }, { unique: false })
