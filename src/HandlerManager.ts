import type { Config } from './Config'
import type { DatabaseClient } from './Clients/DatabaseClient'
import type { BlockchainClient } from './Clients/BlockchainClient'

import { DeviceHandler } from './TxHandlers/DeviceHandler'
import { SupplierHandler } from './TxHandlers/SupplierHandler'
import { OrganisationHandler } from './TxHandlers/OrganisationHandler'
import { DappFatherHandler } from './TxHandlers/DappFatherHandler'
import { KeyHandler } from './TxHandlers/KeyHandler'
import { EventHandler } from './TxHandlers/EventHandler'
import { Handler } from './TxHandlers/Handler'

export const getClasses = () => [
  DappFatherHandler,
  SupplierHandler,
  OrganisationHandler,
  DeviceHandler,
  KeyHandler,
  EventHandler
]

export const getInstances = (
  config: Config,
  db: DatabaseClient,
  blockchain: BlockchainClient
): Handler[] => getClasses().map((classRef) => new classRef(config, db, blockchain))
