export interface Context {
  dappFather: DappFather
  suppliers: Supplier[]
  organisations: Organisation[]
  devices: Device[]
  users: User[]
  keys: Key[]
  events: Event[]
}

export interface DeviceSupplierConn {
  supplier: string
  device: string
}

export interface OrganisationSupplierConn {
  organisation: string
  supplier: string
}

export interface OrganisationUserConn {
  user: string
  organisation: string
}

export interface KeyDeviceConn {
  key: string
  device: string
}

export interface Account {
  address: string
  seed: string
  type: string
  name: string
  description: string
}

export interface DappFather extends Account {
  suppliers: string[]
  organisations: string[]
}

export interface Supplier extends Account {
  devices: string[]
  organisations: string[]
}

export interface Organisation extends Account {
  users: string[]
}

export interface User extends Account {}

export interface Key {
  assetId?: string
  issuer: string
  owner: string
  device: string
  validTo: number
  name: string
}

export interface Event {
  txHash?: string
  supplier: string
  device: string
  key: string
  action: string
}

export interface Device extends Account {
  supplier?: string
  owner?: string
  active: boolean
  visible: boolean
  connected: boolean
  lat?: number
  lng?: number
  alt?: number
  details?: {
    deviceType?: string
    deviceModel?: string
    additionalDescription?: string
    url?: string
    physicalAddress?: {
      city?: string
      country?: string
    }
  }
  custom?: {
    [key: string]: string | number | boolean
  }
}
