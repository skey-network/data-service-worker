import { App } from '../../src/App'
import { Config } from '../../src/Config'
import { BlockchainContainer } from '../Docker/BlockchainContainer'
import { createE2eContext, removeE2eContext, E2eContext } from '../Docker/Context'
import { DatabaseContainer } from '../Docker/DatabaseContainer'
import { RedisContainer } from '../Docker/RedisContainer'
import * as Factory from '../factory/Factory'

const createConfig = (e2e: E2eContext): Config => ({
  app: { logs: true },
  blockchain: {
    dappFatherAddress: '3MLiRijBGgFLZeXMm6DxHCAVkRnCTxS7hog',
    nodeUrl: `http://localhost:${BlockchainContainer.getPorts(e2e.blockchain.id).http}`,
    chainId: 'R'
  },
  db: {
    name: 'admin',
    host: 'localhost',
    port: DatabaseContainer.getPort(e2e.db.id),
    username: 'root',
    password: 'password'
  },
  grpc: {
    host: 'localhost',
    updatesPort: BlockchainContainer.getPorts(e2e.blockchain.id).updates,
    apiPort: BlockchainContainer.getPorts(e2e.blockchain.id).grpc
  },
  redis: {
    host: 'localhost',
    port: RedisContainer.getPort(e2e.redis.id)
  }
})

describe('e2e', () => {
  let e2e: E2eContext
  let app: App

  beforeAll(async () => {
    e2e = await createE2eContext(0)
    app = new App(createConfig(e2e))
    await app.init()
    await app.startListener()
  })

  afterAll(async () => {
    await app.destroy()
    await removeE2eContext(e2e)
  })

  it('', async () => {
    // const ctx = Factory.createBundle(5)
    // await Factory.sponsorAccounts(ctx)
    // await Factory.broadcastBundle(ctx)
    // console.log(ctx)
    // await delay(3600000)
  })
})
