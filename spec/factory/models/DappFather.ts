import { Config } from '../../../src/Config'
import { Account } from './Account'

export class DappFather extends Account {
  suppliers: string[] = []
  organisations: string[] = []

  constructor(config: Config) {
    super('dappFather', config)
  }

  async broadcast() {
    await Promise.all([
      this.lib.insertData(
        [
          { key: 'type', value: 'dappFather' },
          { key: 'name', value: this.name },
          { key: 'description', value: this.description }
        ],
        this.seed
      )
    ])
  }

  async whitelistSuppliers(ids: string[]) {
    await this.modifyListItems('supplier', ids, true, this.suppliers)
  }

  async whitelistOrganisations(ids: string[]) {
    await this.modifyListItems('org', ids, true, this.organisations)
  }
}
