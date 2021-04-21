import { Injectable } from 'injection-js'
import { Connection, createConnection, MongoRepository } from 'typeorm'
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions'
import config from '../config'
import { Device } from '../models/Device'
import { Key } from '../models/Key'

export const connectionOptions: MongoConnectionOptions = Object.freeze({
  name: 'default',
  type: 'mongodb',
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.username,
  password: config.db.password,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  validateOptions: true,
  entities: [Device, Key],
  synchronize: true
})

@Injectable()
export class Db {
  private connection: Connection
  private _deviceRepository: MongoRepository<Device>
  private _keyRepository: MongoRepository<Key>

  async connect() {
    this.connection = await createConnection(connectionOptions)
    this._deviceRepository = this.connection.getMongoRepository(Device)
    this._keyRepository = this.connection.getMongoRepository(Key)
  }

  async disconnect() {
    await this.connection.close()
  }

  get deviceRepository() {
    return this._deviceRepository
  }

  get keyRepository() {
    return this._keyRepository
  }
}
