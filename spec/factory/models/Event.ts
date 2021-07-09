import { Config } from '../../../src/Config'
import { randElement } from '../FactoryHelpers'
import { Entity } from './Entity'

export class Event extends Entity {
  txHash?: string
  senderSeed: string
  supplier: string
  key: string
  action: string
  device: string

  constructor(senderSeed: string, supplier: string, key: string, config: Config) {
    super(config)

    this.senderSeed = senderSeed
    this.supplier = supplier
    this.key = key
    this.action = randElement(['open', 'close', 'location'])
  }

  async broadcast() {
    this.txHash = await this.lib.interactWithDevice(
      this.key,
      this.supplier,
      this.action,
      this.senderSeed
    )
  }
}
