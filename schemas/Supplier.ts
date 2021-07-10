import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export type SupplierDocument = Supplier & Document
export type SupplierModel = Model<SupplierDocument>

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Supplier {
  id: string

  @Prop(String)
  address: string

  @Prop(Boolean)
  whitelisted: boolean

  @Prop(String)
  name: string

  @Prop(String)
  description: string

  @Prop([String])
  devices: string[]

  @Prop([String])
  organisations: string[]

  @Prop(Date)
  createdAt: Date

  @Prop(Date)
  updatedAt: Date
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier)
