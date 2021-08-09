export interface AppConfig {
  logs: boolean
  minHeight: 1
}

export interface BlockchainConfig {
  dappFatherAddress: string
  nodeUrl: string
  chainId: string
}

export interface DbConfig {
  name: string
  host: string
  port: number
  username: string
  password: string
}

export interface GrpcConfig {
  host: string
  updatesPort: number
  apiPort: number
}

export interface RedisConfig {
  queue: string
  host: string
  port: number
}

export interface TestConfig {
  dappFatherSeed: string
  genesisSeed: string
  integrationDelay: number
}

export interface Config {
  app: AppConfig
  blockchain: BlockchainConfig
  db: DbConfig
  grpc: GrpcConfig
  redis: RedisConfig
  test: TestConfig
}
