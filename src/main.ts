import { config as configure } from 'dotenv'
configure()

import * as Blockchain from './Blockchain'
import * as Database from './Database'
import * as Telegraf from './Telegraf'
import { parseUpdate } from './UpdateParser'
import type { SubscribeEvent } from './Types'

import { handleDappFatherUpdates } from './TxHandlers/DappFatherHandler'
import { handleDeviceUpdates } from './TxHandlers/DeviceHandler'
import { handleEventUpdates } from './TxHandlers/EventHandler'
import { handleKeyUpdates } from './TxHandlers/KeyHandler'
import { handleOrganisationUpdates } from './TxHandlers/OrganisationHandler'
import { handleSupplierUpdates } from './TxHandlers/SupplierHandler'

const handle = async (chunk: SubscribeEvent) => {
  const update = parseUpdate(chunk)

  await handleDappFatherUpdates(update)
  await handleDeviceUpdates(update)
  await handleEventUpdates(update)
  await handleKeyUpdates(update)
  await handleOrganisationUpdates(update)
  await handleSupplierUpdates(update)
}

const _ = (async () => {
  await Database.connect()

  const height = await Blockchain.fetchHeight()
  Blockchain.subscribe(handle, height)
})()
