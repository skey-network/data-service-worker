import { Config } from '../../../src/Config'
import { Account } from './Account'

export class User extends Account {
  constructor(config: Config) {
    super('user', config)
  }

  async broadcast() {
    await this.lib.insertData(
      [
        { key: 'type', value: 'user' },
        { key: 'name', value: this.name },
        { key: 'description', value: this.description }
      ],
      this.seed
    )
  }
}
