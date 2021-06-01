import { createSchema, Type, typedModel } from 'ts-mongoose'

export const OrganisationSchema = createSchema(
  {
    address: Type.string({ required: true, index: true, unique: true }),
    whitelisted: Type.boolean({ default: false }),
    name: Type.string(),
    description: Type.string()
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export const Organisation = typedModel('Organisation', OrganisationSchema)
