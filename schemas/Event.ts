import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Model } from 'mongoose'

export type EventDocument = Event & Document
export type EventModel = Model<EventDocument>

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Event {
  id: string

  @Prop(String)
  txHash: string

  @Prop(String)
  sender?: string

  @Prop(String)
  device?: string

  @Prop(String)
  assetId?: string

  @Prop(String)
  action?: string

  @Prop(String)
  status?: string

  @Prop(Date)
  createdAt: Date

  @Prop(Date)
  updatedAt: Date
}

export const EventSchema = SchemaFactory.createForClass(Event)
