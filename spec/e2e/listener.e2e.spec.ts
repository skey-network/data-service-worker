import { Job } from 'bull'
import { delay } from '../../src/Common'
import { Config } from '../../src/Config'
import { Listener } from '../../src/Processes/Listener'
import { JobData } from '../../src/Types'
import { ParsedUpdate } from '../../src/UpdateParser'
import * as Context from '../Docker/Context'
import { createBundle } from '../factory/Factory'

describe('e2e', () => {
  let e2e: Context.E2eContext
  let config: Config
  let listener: Listener
  let updates: ParsedUpdate[] = []

  beforeAll(async () => {
    e2e = await Context.createE2eContext(0)
    config = Context.createConfig(e2e)
    listener = new Listener(config)

    listener.queue.process(async (job: Job<JobData>) => {
      updates.push(job.data.update)
    })

    await listener.init()
    await delay(2000)
  })

  afterAll(async () => {
    await listener.destroy()
    await Context.removeE2eContext(e2e)
  })

  it('updates are correct', async () => {
    const ctx = await createBundle(config, 10)

    await delay(10000)
    await listener.queue.whenCurrentJobsFinished()

    const text = JSON.stringify(updates)

    // validate if all data is present
    ctx.accounts.forEach((acc) => {
      expect(text.includes(acc.address)).toBe(true)
      expect(text.includes(acc.name)).toBe(true)
      expect(text.includes(acc.description)).toBe(true)
    })

    // validate update schema
    updates.forEach((update) => {
      expect(update.ids).toBeInstanceOf(Array)
      expect(typeof update.height).toBe('number')
      expect(update.height).toBeGreaterThan(0)

      update.entries.forEach((entry) => {
        expect(typeof entry.address).toBe('string')

        entry.entries.forEach((entry) => {
          expect(typeof entry.key).toBe('string')
          expect(entry.value).not.toBe(undefined)
        })
      })
    })
  })
})
