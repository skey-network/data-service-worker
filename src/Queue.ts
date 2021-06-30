import Queue, { QueueOptions } from 'bull'
import config from '../config'
import type { Update } from './UpdateParser'

import { handleDappFatherUpdates } from './TxHandlers/DappFatherHandler'
import { handleDeviceUpdates } from './TxHandlers/DeviceHandler'
import { handleEventUpdates } from './TxHandlers/EventHandler'
import { handleKeyUpdates } from './TxHandlers/KeyHandler'
import { handleOrganisationUpdates } from './TxHandlers/OrganisationHandler'
import { handleSupplierUpdates } from './TxHandlers/SupplierHandler'

export const QUEUE_NAME = 'queue'

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

queue.process(async (job) => {
  const percentPerTask = Math.floor(100 / tasks.length)

  for (const item of tasks.map((task, index) => ({ task, index }))) {
    await item.task(job.data)
    job.progress(item.index * percentPerTask)
  }
})
