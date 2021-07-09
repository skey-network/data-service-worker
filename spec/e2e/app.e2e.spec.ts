import { delay } from '../../src/Common'
import { Config } from '../../src/Config'
import { App } from '../../src/Processes/App'
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
    await app.processor.queue.pause()
  })

  afterAll(async () => {
    await app.destroy()
    // await Context.removeE2eContext(e2e)
  })

  it('database data match blockchain data', async () => {
    const ctx = await createBundle(config, 10)
    process.env.BLOCKCHAIN_DAPP_FATHER_ADDRESS = ctx.dappFather.address
    await app.processor.queue.resume()

    await delay(10000)
    await app.processor.queue.whenCurrentJobsFinished()
    await delay(3000)

    const dbContext = await dbToCommonContext(app.processor.db)
    const bContext = bToCommonContext(ctx)

    console.log(dbContext.events)
    console.log(bContext.events)

    expect(dbContext).toEqual(bContext)
  })
})
