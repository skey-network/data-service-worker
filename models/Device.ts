import { createSchema, Type, typedModel } from 'ts-mongoose'

export const deviceTypes = Object.freeze([
  'car barrier',
  'human barrier',
  'elevator',
  'human',
  'mobile',
  'other'
])

const DeviceSchema = createSchema(
  {
    // ADDRESSES
    address: Type.string({ required: true, index: true, unique: true }),
    supplier: Type.string({ index: true }),
    owner: Type.string({ index: true }),

    // BASIC INFO
    name: Type.string(),
    description: Type.string(),

    // LOCATION
    lat: Type.number(),
    lng: Type.number(),
    alt: Type.number(),

    // BOOLEANS
    visible: Type.boolean({ default: true }),
    active: Type.boolean({ default: true }),
    connected: Type.boolean({ default: true }),

    // ADDITIONAL INFO
    details: Type.object().of({
      deviceType: Type.string({ enum: deviceTypes }),
      deviceModel: Type.string(),
      additionalDescription: Type.string(),
      assetUrl: Type.string(),
      url: Type.string(),
      contactInfo: Type.string(),
      physicalAddress: Type.object().of({
        addressLine1: Type.string(),
        addressLine2: Type.string(),
        city: Type.string(),
        postcode: Type.string(),
        state: Type.string(),
        country: Type.string(),
        number: Type.string(),
        floor: Type.string()
      })
    }),

    // CUSTOM DATA
    custom: Type.mixed()
  },
  {
    // TIMESTAMPS
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export const Device = typedModel('Device', DeviceSchema)
