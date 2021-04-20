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

const injector = ReflectiveInjector.resolveAndCreate([
  ProtoLoader,
  GrpcClient,
  Blockchain,
  Listener,
  TxHandler,
  Common
])

const blockchain = injector.get(Blockchain) as Blockchain
const txHandler = injector.get(TxHandler) as TxHandler

const _ = (async () => {
  const height = await blockchain.fetchHeight()

  const promise = blockchain.onBlockchainUpdate((chunk) => {
    console.log(txHandler.handleAddDevices(chunk))
  }, height)
})()
