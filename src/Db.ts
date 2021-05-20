import { Injectable } from 'injection-js'
import { Connection, createConnection, MongoRepository } from 'typeorm'
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions'
import config from '../config'
import { Device } from '../models/Device'
import { Key } from '../models/Key'
import { Supplier } from '../models/Supplier'

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
  entities: [Device, Key, Supplier],
  synchronize: true
})

@Injectable()
export class Db {
  private connection: Connection
  private _deviceRepository: MongoRepository<Device>
  private _keyRepository: MongoRepository<Key>
  private _supplierRepository: MongoRepository<Supplier>

  async connect() {
    this.connection = await createConnection(connectionOptions)
    this._deviceRepository = this.connection.getMongoRepository(Device)
    this._keyRepository = this.connection.getMongoRepository(Key)
    this._supplierRepository = this.connection.getMongoRepository(Supplier)
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

  get supplierRepository() {
    return this._supplierRepository
  }
}
