import { App } from '../../src/App'
import { delay } from '../../src/Common'
import { Config } from '../../src/Config'
import { createE2eContext, removeE2eContext, E2eContext } from '../Docker/Context'
import { Factory } from '../factory/Factory'

const createConfig = (e2e: E2eContext): Config => ({
  app: { logs: false },
  blockchain: {
    dappFatherAddress: '3MLiRijBGgFLZeXMm6DxHCAVkRnCTxS7hog',
    nodeUrl: `http://localhost:${e2e.blockchain.ports.http}`,
    chainId: 'R'
  },
  db: {
    name: 'admin',
    host: 'localhost',
    port: e2e.db.port,
    username: 'root',
    password: 'password'
  },
  grpc: {
    host: 'localhost',
    updatesPort: e2e.blockchain.ports.updates,
    apiPort: e2e.blockchain.ports.grpc
  },
  redis: {
    host: 'localhost',
    port: e2e.redis.port
  }
})

describe('e2e', () => {
  let e2e: E2eContext
  let config: Config
  let app: App

  beforeAll(async () => {
    e2e = await createE2eContext(0)
    config = createConfig(e2e)
    app = new App(config)

    await app.init()
    await app.startListener()

    await delay(1000)
  })

  afterAll(async () => {
    await app.destroy()
    await removeE2eContext(e2e)
  })

  it('aaa', async () => {
    await app.queue.pause()

    const factory = new Factory(config)
    factory.createBundle(5)
    await factory.sponsorAccounts()
    await factory.broadcast()

    console.log('tasks in queue', await app.queue.getJobCounts())

    await app.queue.resume()
    await delay(10000)

    console.log('tasks in queue', await app.queue.getJobCounts())

    await delay(2000)

    console.log(await app.db.models.supplierModel.estimatedDocumentCount())
    console.log(await app.db.models.deviceModel.estimatedDocumentCount())
    console.log(await app.db.models.organisationModel.estimatedDocumentCount())
  })
})
