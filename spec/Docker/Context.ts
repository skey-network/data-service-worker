import { Config } from '../../src/Config'
import { BlockchainContainer } from './BlockchainContainer'
import { Container } from './Container'
import { DatabaseContainer } from './DatabaseContainer'
import { RedisContainer } from './RedisContainer'

export const createConfig = (e2e: E2eContext): Config => ({
  app: { logs: false, minHeight: 1 },
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
  },
  test: {
    dappFatherSeed:
      'seed seed seed seed seed seed seed seed seed seed seed seed seed seed seed',
    genesisSeed:
      'seed seed seed seed seed seed seed seed seed seed seed seed seed seed seed',
    integrationDelay: 0
  }
})

export const runContainers = async (containers: Container[]) => {
  await Promise.all(
    containers.map(async (container) => {
      await container.run()
      await container.waitToBeResponsive()
    })
  )
}

export const removeContainers = async (containers: Container[]) => {
  await Promise.all(
    containers.map(async (container) => {
      await container.rm(true)
      container.removeVolume()
    })
  )
}

export interface E2eContext {
  blockchain: BlockchainContainer
  db: DatabaseContainer
  redis: RedisContainer
}

export const createE2eContext = async (id: number): Promise<E2eContext> => {
  const blockchain = new BlockchainContainer(id)
  const db = new DatabaseContainer(id)
  const redis = new RedisContainer(id)

  await runContainers([blockchain, db, redis])

  return { blockchain, db, redis }
}

export const removeE2eContext = async (e2e: E2eContext) => {
  await removeContainers([e2e.blockchain, e2e.db, e2e.redis])
}
