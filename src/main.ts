import { config as configure } from 'dotenv'
configure()

import * as Blockchain from './Blockchain'
import * as Database from './Database'
import { parseUpdate } from './UpdateParser'
import type { SubscribeEvent } from './Types'
import { queue } from './Queue'

const handle = async (chunk: SubscribeEvent) => {
  const update = parseUpdate(chunk)
  await queue.add(update)
}

const _ = (async () => {
  await Database.connect()
  const height = await Blockchain.fetchHeight()

  Blockchain.subscribe(handle, height)
})()
