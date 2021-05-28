import { createSchema, Type, typedModel } from 'ts-mongoose'

export const EventSchema = createSchema(
  {
    txHash: Type.string({ required: true, index: true, unique: true }),
    sender: Type.string({ required: true, index: true }),
    device: Type.string({ required: true, index: true }),
    assetId: Type.string({ required: true, index: true }),
    action: Type.string({ required: true, index: true }),
    status: Type.string({ required: true, index: true })
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export const Event = typedModel('Event', EventSchema)
