import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export type KeyDocument = Key & Document
export type KeyModel = Model<KeyDocument>

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Key {
  id: string

  @Prop(String)
  assetId: string

  @Prop(String)
  issuer?: string

  @Prop(String)
  owner?: string

  @Prop(String)
  name?: string

  @Prop(String)
  device?: string

  @Prop(Number)
  validTo?: number

  @Prop(Number)
  issueTimestamp?: number

  @Prop(Boolean)
  burned?: boolean

  @Prop(Date)
  createdAt: Date

  @Prop(Date)
  updatedAt: Date
}

export const KeySchema = SchemaFactory.createForClass(Key)
