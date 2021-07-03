import { Account } from './Account'
import { readFileSync } from 'fs'
import { Config } from '../../../src/Config'

export class Organisation extends Account {
  users: string[] = []

  constructor(config: Config) {
    super('organisation', config)
  }

  get script() {
    return readFileSync('./artifacts/organisation.txt', 'utf-8')
  }

  async broadcast() {
    await Promise.all([
      this.lib.insertData(
        [
          { key: 'type', value: 'organisation' },
          { key: 'name', value: this.name },
          { key: 'description', value: this.description }
        ],
        this.seed
      ),
      this.lib.setScript(this.script, this.seed)
    ])
  }
}
