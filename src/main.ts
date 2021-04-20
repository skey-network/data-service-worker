import { config as configure } from 'dotenv'
configure()

import 'reflect-metadata'
import { ReflectiveInjector } from 'injection-js'
import { ProtoLoader } from './ProtoLoader'
import { GrpcClient } from './GrpcClient'
import { Blockchain } from './Blockchain'

const injector = ReflectiveInjector.resolveAndCreate([
  ProtoLoader,
  GrpcClient,
  Blockchain
])
const blockchain = injector.get(Blockchain) as Blockchain

const _ = (async () => {
  const height = await blockchain.fetchHeight()
  console.log(height)
})()
