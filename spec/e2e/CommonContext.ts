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
    whitelisted: boolean
  }[]
  organisations: {
    address: string
    name: string
    description: string
    users: string[]
    whitelisted: boolean
  }[]
  keys: {
    assetId: string
    issuer: string
    owner: string
    name: string
    device: string
    validTo: number
    issueTimestamp: number
    burned: boolean
  }[]
  events: {
    txHash: string
    sender: string
    assetId: string
    action: string
    status: string
  }[]
}
