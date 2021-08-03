import mongoose from 'mongoose'
import { CollectionName, Models, createModels } from '../../schemas/Schemas'
import { Config } from '../Config'
import { Logger } from '../Logger'

export interface ConnectionParams {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const defaultOptions: mongoose.ConnectOptions = Object.freeze({
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  validateOptions: true
})

export class DatabaseClient {
  connection: mongoose.Connection
  params: ConnectionParams
  options: mongoose.ConnectOptions
  models: Models
  config: Config

  constructor(config: Config, options?: mongoose.ConnectOptions) {
    this.options = options ?? defaultOptions
    this.params = config.db
    this.config = config
  }

  get logger() {
    return new Logger(DatabaseClient.name, this.config.app.logs)
  }

  async connect() {
    const uri = DatabaseClient.createUri(this.params)
    this.connection = await mongoose.createConnection(uri, this.options)
    this.models = await createModels(this.connection)
  }

  async disconnect() {
    await this.connection.close(true)
  }

  async safeInsertOne(doc: any, collection: CollectionName) {
    try {
      await this.models[collection].create(doc)
      return true
    } catch (err) {
      this.logger.error('Failed to insert document')
      this.logger.error(err)

      return false
    }
  }

  async safeUpdateOne(query: any, update: any, collection: CollectionName) {
    try {
      await this.models[collection].updateOne(query, update)
      return true
    } catch (err) {
      this.logger.error('Failed to update document')
      this.logger.error(err)

      return false
    }
  }

  async safeFindOne(query: any, collection: CollectionName): Promise<null | any> {
    try {
      return await this.models[collection].findOne(query)
    } catch (err) {
      this.logger.error('Failed to fetch document')
      this.logger.error(err)

      return null
    }
  }

  static createUri(params: ConnectionParams) {
    const { host, port, name, username, password } = params
    return `mongodb://${username}:${password}@${host}:${port}/${name}`
  }

  async dropAllCollections() {
    const whitelist = ['system.version', 'system.users', 'events']

    const collections = await this.connection.db.collections()

    const promises = collections
      .filter((collection) => !whitelist.includes(collection.collectionName))
      .map((collection) => collection.drop())

    await Promise.all(promises)
  }
}
