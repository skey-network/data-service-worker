import { Config } from './src/Config'

const { env } = process

export default () =>
  ({
    app: {
      logs: env.APP_LOGS === 'true'
    },
    blockchain: {
      dappFatherAddress: env.BLOCKCHAIN_DAPP_FATHER_ADDRESS!,
      nodeUrl: env.BLOCKCHAIN_NODE_URL ?? 'http://localhost:6869',
      chainId: env.BLOCKCHAIN_CHAIN_ID ?? 'R'
    },
    db: {
      name: env.DB_NAME ?? 'admin',
      host: env.DB_HOST ?? 'localhost',
      port: Number(env.DB_PORT ?? '27017'),
      username: env.DB_USERNAME ?? 'root',
      password: env.DB_PASSWORD ?? 'password'
    },
    grpc: {
      host: env.GRPC_HOST ?? 'localhost',
      updatesPort: Number(env.GRPC_UPDATES_PORT ?? '6881'),
      apiPort: Number(env.GRPC_API_PORT ?? '6877')
    },
    redis: {
      queue: env.REDIS_QUEUE ?? 'default',
      host: env.REDIS_HOST ?? 'localhost',
      port: Number(env.REDIS_PORT ?? '6379')
    }
  } as Config)

export const requiredFields = ['BLOCKCHAIN_DAPP_FATHER_ADDRESS']

export const validateEnv = () => {
  requiredFields.forEach((field) => {
    if (!process.env[field]) {
      throw new Error(`${field} is not defined in the environment`)
    }
  })
}
