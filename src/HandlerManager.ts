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
