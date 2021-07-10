import { getInstance } from 'skey-lib'
import { Config } from '../../../src/Config'

export class Entity {
  config: Config

  constructor(config: Config) {
    this.config = config
  }

  get lib() {
    return getInstance({
      nodeUrl: this.config.blockchain.nodeUrl,
      chainId: this.config.blockchain.chainId
    })
  }
}
