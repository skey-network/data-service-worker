import { readFileSync } from 'fs'
import { Config } from '../../../src/Config'
import { Account } from './Account'

export class Device extends Account {
  keys: string[] = []
  supplier?: string
  owner?: string

  constructor(config: Config) {
    super('device', config)
  }

  get script() {
    return readFileSync('./artifacts/device.txt', 'utf-8')
  }

  async broadcast() {
    await Promise.all([
      this.lib.insertData(
        [
          { key: 'type', value: 'device' },
          { key: 'name', value: this.name },
          { key: 'description', value: this.description }
        ],
        this.seed
      ),
      this.lib.setScript(this.script, this.seed)
    ])
  }
}
