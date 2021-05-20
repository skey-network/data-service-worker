import { createSchema, Type, typedModel } from 'ts-mongoose'

export const SupplierSchema = createSchema(
  {
    address: Type.string({ required: true, index: true, unique: true }),
    name: Type.string(),
    description: Type.string(),
    devices: Type.array({
      index: true,
      required: true
    }).of(Type.string({ required: true }))
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
)

export const Supplier = typedModel('Supplier', SupplierSchema)
