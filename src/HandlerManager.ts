import type { Config } from './Config'
import type { DatabaseClient } from './Clients/DatabaseClient'
import type { BlockchainClient } from './Clients/BlockchainClient'

import { DeviceHandler } from './TxHandlers/DeviceHandler'
import { SupplierHandler } from './TxHandlers/SupplierHandler'
import { OrganisationHandler } from './TxHandlers/OrganisationHandler'
import { DappFatherHandler } from './TxHandlers/DappFatherHandler'
import { KeyHandler } from './TxHandlers/KeyHandler'
import { EventHandler } from './TxHandlers/EventHandler'

export const getClasses = () => [
  DappFatherHandler,
  SupplierHandler,
  OrganisationHandler,
  DeviceHandler,
  KeyHandler,
  EventHandler
]

export const getClassByName = (name: string) =>
  getClasses().find((ref) => ref.name === name) ?? null
