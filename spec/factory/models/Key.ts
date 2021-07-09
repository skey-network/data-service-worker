import { Entity } from './Entity'
import { Config } from '../../../src/Config'
import { randTimestamp } from '../FactoryHelpers'
import faker from 'faker'

export class Key extends Entity {
  assetId?: string
  issuerSeed: string
  owner: string
  name: string
  device: string
  validTo: number

  constructor(issuerSeed: string, owner: string, device: string, config: Config) {
    super(config)

    this.issuerSeed = issuerSeed
    this.owner = owner
    this.device = device
    this.name = faker.random.alphaNumeric(16)
    this.validTo = randTimestamp()
  }

  async broadcast() {
    this.assetId = await this.lib.generateKey(
      this.device,
      this.validTo,
      this.issuerSeed,
      this.name
    )
  }
}
