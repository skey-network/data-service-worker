import * as Crypto from '@waves/ts-lib-crypto'
import faker from 'faker'
import { Config } from '../../../src/Config'
import { Entity } from './Entity'

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
}
