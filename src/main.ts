import { config as configure } from 'dotenv'
configure()

import * as Blockchain from './Blockchain'
import * as Database from './Database'
import { parseUpdate } from './UpdateParser'
import type { SubscribeEvent } from './Types'
import { queue } from './Queue'
import { createLogger } from './Logger'

const logger = createLogger('main')

const hasTransactions = (chunk: SubscribeEvent) =>
  (chunk.update?.append?.transaction_ids ?? []).length > 0

const handle = async (chunk: SubscribeEvent) => {
  if (!hasTransactions(chunk)) return

  const update = parseUpdate(chunk)
  if (!update) return

  const job = await queue.add(update)
  logger.debug('Processing block update', update.height, 'with job id', Number(job.id))
}

const _ = (async () => {
  // TODO Remove those later
  await Database.connect()
  await Database.dropAllCollections()
  await queue.empty()
  await queue.clean(0, 'completed')
  await queue.clean(0, 'failed')

  // const height = await Blockchain.fetchHeight()
  Blockchain.subscribe(handle, 98032)
})()
