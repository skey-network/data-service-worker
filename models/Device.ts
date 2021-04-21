import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

export const types = Object.freeze([
  'car barrier',
  'human barrier',
  'elevator',
  'human',
  'mobile',
  'other'
])

export class Location {
  @Column({ nullable: false, type: 'number' })
  lat: number

  @Column({ nullable: false, type: 'number' })
  lng: number

  @Column({ type: 'number' })
  alt?: number
}

export class PhysicalAddress {
  @Column({ type: 'string' })
  addressLine1?: string

  @Column({ type: 'string' })
  addressLine2?: string

  @Column({ type: 'string' })
  city?: string

  @Column({ type: 'string' })
  postcode?: string

  @Column({ type: 'string' })
  state?: string

  @Column({ type: 'string' })
  country?: string

  @Column({ type: 'string' })
  number?: string

  @Column({ type: 'string' })
  floor?: string
}

@Entity()
export class Device {
  @ObjectIdColumn()
  id: ObjectID

  @Column({ nullable: false, unique: true, type: 'string' })
  address: string

  @Column({ type: 'string' })
  name?: string

  @Column({ type: 'string' })
  description?: string

  @Column({ enum: types })
  type?: string

  @Column({ type: 'string' })
  additionalDescription?: string

  @Column({ type: 'string' })
  assetUrl?: string

  @Column({ type: 'string' })
  url?: string

  @Column({ type: 'string' })
  contactInfo?: string

  @Column({ default: true, type: 'boolean' })
  visible?: boolean

  @Column(() => Location)
  location?: Location

  @Column(() => PhysicalAddress)
  physicalAddress?: PhysicalAddress

  @Column({ default: true, type: 'boolean' })
  active: boolean

  @Column({ default: true, type: 'boolean' })
  connected: boolean

  @Column({ nullable: false, type: 'string' })
  dapp: string

  @Column({ nullable: false, type: 'string' })
  owner: string

  @Column({ type: 'string' })
  deviceModel?: string

  @Column({ type: 'simple-json' })
  custom: {
    [key: string]: string | number | boolean
  }
}
