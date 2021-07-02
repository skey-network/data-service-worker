import { BlockchainContainer } from '../Docker/BlockchainContainer'
import { DatabaseContainer } from '../Docker/DatabaseContainer'
import * as Factory from '../factory/Factory'
import { delay } from '../helper'

describe('e2e', () => {
  // it('creates context', async () => {
  //   const ctx = Factory.createBundle(5)
  //   await Factory.sponsorAccounts(ctx)
  //   await Factory.broadcastBundle(ctx)
  //   console.log(ctx)
  // })

  // it('docker', async () => {
  //   await delay(5000)
  //   const container = new BlockchainContainer(1)
  //   await container.run()
  //   await container.waitToBeResponsive()

  //   console.log(await container.fetchHeight())
  //   console.log('responsive')

  //   await container.rm(true)
  // })

  it('db', async () => {
    const container = new DatabaseContainer(1)
    await container.run()
    console.log(1)
    await container.waitToBeResponsive()
    console.log(2)
    await delay(10000)
    console.log(3)
    await container.rm(true)
  })
})
