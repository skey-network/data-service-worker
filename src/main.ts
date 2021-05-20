import { config as configure } from 'dotenv'
configure()

import { Blockchain } from './Blockchain'
import { Database } from './Database'
import { UpdateDeviceHandler } from './TxHandlers/UpdateDeviceHandler'
import { SubscribeEvent } from './Types'
import { UpdateSupplierHandler } from './TxHandlers/UpdateSupplierHandler'

const handle = async (chunk: SubscribeEvent) => {
  await UpdateDeviceHandler.handle(chunk)
  await UpdateSupplierHandler.handle(chunk)
}

const _ = (async () => {
  await Database.connect()

  const height = await Blockchain.fetchHeight()
  Blockchain.subscribe(handle, height)
})()
