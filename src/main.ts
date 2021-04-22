import { config as configure } from 'dotenv'
configure()

import 'reflect-metadata'

import { ReflectiveInjector } from 'injection-js'
import { GrpcClient } from './GrpcClient'
import { Blockchain } from './Blockchain'
import { Listener } from './Listener'
import { TxHandler } from './TxHandler'
import { Common } from './Common'
import { Logger } from './Logger'
import { Db } from './Db'

export const createApp = () => {
  const injector = ReflectiveInjector.resolveAndCreate([
    GrpcClient,
    Blockchain,
    Listener,
    TxHandler,
    Common,
    Logger,
    Db
  ])

  return {
    grpcClient: injector.get(GrpcClient) as GrpcClient,
    blockchain: injector.get(Blockchain) as Blockchain,
    listener: injector.get(Listener) as Listener,
    txHandler: injector.get(TxHandler) as TxHandler,
    common: injector.get(Common) as Common,
    logger: injector.get(Logger) as Logger,
    db: injector.get(Db) as Db
  }
}

const app = createApp()

const _ = (async () => {
  await app.db.connect()
  const height = await app.blockchain.fetchHeight()

  app.listener.subscribe((chunk) => app.txHandler.handleUpdateDevices(chunk), height)
})()
