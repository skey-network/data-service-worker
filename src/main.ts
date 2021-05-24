import { config as configure } from 'dotenv'
configure()

import { Blockchain } from './Blockchain'
import { Database } from './Database'
import { UpdateDeviceHandler } from './TxHandlers/UpdateDeviceHandler'
import { SubscribeEvent } from './Types'
import { DappFatherHandler } from './TxHandlers/DappFatherHandler'
import { UpdateSupplierHandler } from './TxHandlers/UpdateSupplierHandler'
import { handleKeyTransferUpdates, handleKeyUpdates } from './TxHandlers/KeyHandler'

const handle = async (chunk: SubscribeEvent) => {
  await DappFatherHandler.handle(chunk)
  await UpdateSupplierHandler.handle(chunk)
  await UpdateDeviceHandler.handle(chunk)
  await handleKeyUpdates(chunk)
  await handleKeyTransferUpdates(chunk)
}

const _ = (async () => {
  await Database.connect()

  const height = await Blockchain.fetchHeight()
  // const res = await Blockchain.fetchAsset('CGqeZZftS13JtEztuZFr7MwV2QLqLsNCwQpnQm3vNXT2')

  Blockchain.subscribe(handle, height)
})()
