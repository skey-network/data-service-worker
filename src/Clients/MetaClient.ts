import { Collection } from 'mongoose'
import { Config } from '../Config'
import { Logger } from '../Logger'
import { DatabaseClient } from './DatabaseClient'

export class MetaClient {
  private static collectionName = 'meta'
  private static heightKey = 'height'

  collection: Collection
  config: Config

  constructor(config: Config, db: DatabaseClient) {
    this.config = config
    this.collection = db.connection.collection(MetaClient.collectionName)
  }

  get logger() {
    return new Logger(MetaClient.name, this.config.app.logs)
  }

  async getHeight(): Promise<number | null> {
    const result = await this.collection
      .findOne({ key: MetaClient.heightKey })
      .catch((err) => {
        this.logger.error('Error while retriving height from db')
        this.logger.error(err)

        return null
      })

    return result?.value ?? null
  }

  async setHeight(height: number): Promise<boolean> {
    const res = await this.collection
      .updateOne(
        { key: MetaClient.heightKey },
        { $set: { value: height } },
        { upsert: true }
      )
      .catch((err) => {
        this.logger.error('Error while saving height in db')
        this.logger.error(err)

        return null
      })

    return res?.result.n === 1
  }
}
