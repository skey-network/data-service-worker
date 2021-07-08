export interface CommonContext {
  devices: {
    address: string
    name: string
    description: string
    keys: string[]
  }[]
  suppliers: {
    address: string
    name: string
    description: string
    devices: string[]
    organisations: string[]
  }[]
  organisations: {
    address: string
    name: string
    description: string
    users: string[]
  }[]
}
