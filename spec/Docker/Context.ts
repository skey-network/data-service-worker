import { BlockchainContainer } from './BlockchainContainer'
import { Container } from './Container'
import { DatabaseContainer } from './DatabaseContainer'
import { RedisContainer } from './RedisContainer'

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
