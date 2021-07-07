import { Job } from 'bull'
import { delay } from '../../src/Common'
import { Config } from '../../src/Config'
import { Listener, JobData } from '../../src/Listener'
import { ParsedUpdate } from '../../src/UpdateParser'
import { createE2eContext, E2eContext, removeE2eContext } from '../Docker/Context'
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
    queue: 'default',
    host: 'localhost',
    port: e2e.redis.port
  }
})

describe('e2e', () => {
  let e2e: E2eContext
  let config: Config
  let app: Listener
  let updates: ParsedUpdate[] = []

  beforeAll(async () => {
    e2e = await createE2eContext(0)
    config = createConfig(e2e)
    app = new Listener(config)

    app.queue.process(async (job: Job<JobData>) => {
      updates.push(job.data.update)
    })

    await app.startListener()
    await delay(2000)
  })

  afterAll(async () => {
    await app.destroy()
    await removeE2eContext(e2e)
  })

  it('aaa', async () => {
    const factory = new Factory(config)
    factory.createBundle(5)
    await factory.sponsorAccounts()
    await factory.broadcast()

    await delay(30000)
  })
})
