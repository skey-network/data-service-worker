import type { Account } from './Account'

import { Device } from './Device'
import { User } from './User'
import { Organisation } from './Organisation'
import { Supplier } from './Supplier'
import { Key } from './Key'
import { Event } from './Event'
import { DappFather } from './DappFather'

export class Context {
  dappFather: DappFather
  suppliers: Supplier[] = []
  devices: Device[] = []
  organisations: Organisation[] = []
  users: User[] = []
  keys: Key[] = []
  events: Event[] = []

  constructor(dappFather: DappFather) {
    this.dappFather = dappFather
  }

  get accounts(): Account[] {
    return [
      // this.dappFather,
      ...this.suppliers,
      ...this.devices,
      ...this.organisations
      // ...this.users
    ]
  }
}
