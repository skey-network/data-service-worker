import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export type OrganisationDocument = Organisation & Document
export type OrganisationModel = Model<OrganisationDocument>

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Organisation {
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
  users: string[]

  @Prop(Date)
  createdAt: Date

  @Prop(Date)
  updatedAt: Date
}

export const OrganisationSchema = SchemaFactory.createForClass(Organisation)
