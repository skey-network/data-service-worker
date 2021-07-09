import * as Crypto from '@waves/ts-lib-crypto'
import faker from 'faker'
import { Config } from '../../../src/Config'
import { Entity } from './Entity'

export const pushUniq = <T>(items: T[], arr: T[]) => {
  items.forEach((item) => {
    const exists = arr.findIndex((x) => x === item) !== -1
    if (exists) return

    arr.push(item)
  })
}

export abstract class Account extends Entity {
  address: string
  seed: string
  name: string
  description: string

  constructor(prefix: string, config: Config) {
    super(config)

    this.seed = Crypto.randomSeed()
    this.address = Crypto.address(this.seed, config.blockchain.chainId)

    this.name = `${prefix} ${faker.random.alphaNumeric(16)}`
    this.description = faker.lorem.paragraph(2)
  }

  async broadcast() {
    throw new Error('not implemented')
  }

  async modifyListItems(prefix: string, ids: string[], active: boolean, array: string[]) {
    const keyword = active ? 'active' : 'inactive'

    await Promise.all(
      ids.map((id) =>
        this.lib.insertData([{ key: `${prefix}_${id}`, value: keyword }], this.seed)
      )
    )

    pushUniq(ids, array)
  }
}
