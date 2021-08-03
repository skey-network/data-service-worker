export interface Config {
  app: {
    logs?: boolean
  }
  blockchain: {
    dappFatherAddress: string
    nodeUrl: string
    chainId: string
  }
  db: {
    name: string
    host: string
    port: number
    username: string
    password: string
  }
  grpc: {
    host: string
    updatesPort: number
    apiPort: number
  }
  redis: {
    queue: string
    host: string
    port: number
  }
}
