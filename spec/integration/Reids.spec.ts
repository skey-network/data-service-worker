import '../setup'

import Queue, { Queue as QueueType } from 'bull'
import config from '../../config'

describe('redis integration', () => {
  let queue: QueueType<number>

  beforeEach(async () => {
    queue = new Queue<number>('test', { redis: config().redis })

    queue.process(async (job) => {
      return job.data * 2
    })
  })

  afterEach(async () => {
    await queue.close()
  })

  it('performs simple job', async () => {
    const job = await queue.add(10)
    const result = await job.finished()

    expect(result).toBe(20)
  })
})
