import { config as configure } from 'dotenv'
configure()

import 'reflect-metadata'

import { ReflectiveInjector } from 'injection-js'
import { ProtoLoader } from './ProtoLoader'
import { GrpcClient } from './GrpcClient'
import { Blockchain } from './Blockchain'
import { Listener } from './Listener'
import { TxHandler } from './TxHandler'
import { Common } from './Common'
import { Logger } from './Logger'
import { Db } from './Db'

const injector = ReflectiveInjector.resolveAndCreate([
  ProtoLoader,
  GrpcClient,
  Blockchain,
  Listener,
  TxHandler,
  Common,
  Logger,
  Db
])

const blockchain = injector.get(Blockchain) as Blockchain
const txHandler = injector.get(TxHandler) as TxHandler
const db = injector.get(Db) as Db

const _ = (async () => {
  await db.connect()
  // const height = await blockchain.fetchHeight()
})()
