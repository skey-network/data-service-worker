import { createSchema, Type, typedModel } from 'ts-mongoose'

export const KeySchema = createSchema(
  {
    assetId: Type.string({ required: true, index: true, unique: true }),
    name: Type.string({ required: true }),
    device: Type.string({ required: true, index: true }),
    owner: Type.string({ required: true, index: true }),
    issuer: Type.string({ required: true, index: true }),
    validTo: Type.number({ required: true }),
    issueTimestamp: Type.number({ required: true })
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export const Key = typedModel('Key', KeySchema)
