import { readFileSync } from 'fs'
import { Config } from '../../../src/Config'
import { Account } from './Account'

export class Supplier extends Account {
  devices: string[] = []
  organisations: string[] = []

  constructor(config: Config) {
    super('supplier', config)
  }

  get script() {
    return readFileSync('./artifacts/supplier.txt', 'utf-8')
  }

  async broadcast() {
    await Promise.all([
      this.lib.insertData(
        [
          { key: 'type', value: 'supplier' },
          { key: 'name', value: this.name },
          { key: 'description', value: this.description }
        ],
        this.seed
      ),
      this.lib.setScript(this.script, this.seed)
    ])
  }
}
