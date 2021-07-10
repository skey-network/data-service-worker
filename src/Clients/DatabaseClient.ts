import mongoose from 'mongoose'
import { createModels, Models } from '../../schemas/Schemas'

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

  constructor(params: ConnectionParams, options?: mongoose.ConnectOptions) {
    this.params = params
    this.options = options ?? defaultOptions
  }

  async connect() {
    const uri = DatabaseClient.createUri(this.params)
    this.connection = await mongoose.createConnection(uri, this.options)
    this.models = createModels(this.connection)
  }

  async disconnect() {
    await this.connection.close(true)
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
