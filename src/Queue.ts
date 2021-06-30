import Queue, { QueueOptions, JobStatus } from 'bull'
import config from '../config'
import type { Update } from './UpdateParser'
import * as Telegraf from './Telegraf'
import Util from 'util'

import { handleDappFatherUpdates } from './TxHandlers/DappFatherHandler'
import { handleDeviceUpdates } from './TxHandlers/DeviceHandler'
import { handleEventUpdates } from './TxHandlers/EventHandler'
import { handleKeyUpdates } from './TxHandlers/KeyHandler'
import { handleOrganisationUpdates } from './TxHandlers/OrganisationHandler'
import { handleSupplierUpdates } from './TxHandlers/SupplierHandler'
import { createLogger } from './Logger'

export const QUEUE_NAME = 'queue'

const logger = createLogger('Queue')

export const tasks = Object.freeze([
  handleDappFatherUpdates,
  handleDeviceUpdates,
  handleEventUpdates,
  handleKeyUpdates,
  handleOrganisationUpdates,
  handleSupplierUpdates
])

export const options: QueueOptions = {
  redis: config().redis
}

export const queue = new Queue<Update>(QUEUE_NAME, options)

setInterval(async () => {
  console.log(await queue.getJobCounts())
}, 2000)

queue.process(async (job) => {
  const percentPerTask = Math.floor(100 / tasks.length)

  for (const item of tasks.map((task, index) => ({ task, index }))) {
    try {
      await item.task(job.data)
      job.progress(item.index * percentPerTask)
    } catch (err) {
      logger.error(err)
      // await Telegraf.message(Util.inspect(err))
      job.moveToFailed(err)
    }
  }
})
