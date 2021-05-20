import { Injectable } from 'injection-js'
import config from '../config'
import mongoose from 'mongoose'

export interface DatabaseOptions {
  host: string
  port: number
  name: string
  username: string
  password: string
}

const databaseOptions: DatabaseOptions = config.db

const connectOptions: mongoose.ConnectOptions = Object.freeze({
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  validateOptions: true
})

@Injectable()
export class Database {
  async connect() {
    if ([1, 2].includes(mongoose.connection.readyState)) return

    const uri = this.createUri(databaseOptions)
    await mongoose.connect(uri, connectOptions)
  }

  async disconnect() {
    if ([0, 3].includes(mongoose.connection.readyState)) return

    await mongoose.disconnect()
  }

  private createUri(options: DatabaseOptions) {
    const { host, port, name, username, password } = options
    return `mongodb://${username}:${password}@${host}:${port}/${name}`
  }
}
