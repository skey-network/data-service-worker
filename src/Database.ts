import config from '../config'
import mongoose from 'mongoose'

export interface DatabaseOptions {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const databaseOptions: DatabaseOptions = config().db

export const connectOptions: mongoose.ConnectOptions = Object.freeze({
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  validateOptions: true
})

export const connect = async () => {
  if ([1, 2].includes(mongoose.connection.readyState)) return

  const uri = createUri(databaseOptions)
  await mongoose.connect(uri, connectOptions)
}

export const disconnect = async () => {
  if ([0, 3].includes(mongoose.connection.readyState)) return

  await mongoose.disconnect()
}

export const createUri = (options: DatabaseOptions) => {
  const { host, port, name, username, password } = options
  return `mongodb://${username}:${password}@${host}:${port}/${name}`
}
