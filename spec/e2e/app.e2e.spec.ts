import { delay } from '../../src/Common'
import { Config } from '../../src/Config'
import { App } from '../../src/processes/App'
import { dbToCommonContext, bToCommonContext } from '../converter'
import * as Context from '../Docker/Context'
import { createBundle } from '../factory/Factory'

describe('e2e', () => {
  let e2e: Context.E2eContext
  let config: Config
  let app: App

  beforeAll(async () => {
    e2e = await Context.createE2eContext(0)
    config = Context.createConfig(e2e)
    app = new App(config)

    await app.init()
    await delay(2000)
  })

  afterAll(async () => {
    await app.destroy()
    await Context.removeE2eContext(e2e)
  })

  it('database data match blockchain data', async () => {
    const ctx = await createBundle(config, 10)

    await delay(10000)
    await app.processor.queue.whenCurrentJobsFinished()

    const dbContext = await dbToCommonContext(app.processor.db)
    const bContext = bToCommonContext(ctx)

    expect(dbContext).toEqual(bContext)

    console.log(dbContext)
  })
})
