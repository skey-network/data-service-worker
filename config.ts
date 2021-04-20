export default () => ({
  // blockchain: {
  //   dappFatherAddress: process.env.BLOCKCHAIN_DAPP_FATHER_ADDRESS!,
  //   nodeUrl: process.env.BLOCKCHAIN_NODE_URL ?? 'http://localhost:6869',
  //   chainId: process.env.BLOCKCHAIN_CHAIN_ID ?? 'R'
  // },
  db: {
    name: process.env.DB_NAME ?? 'admin',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? '27017'),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'password'
  },
  grpc: {
    host: process.env.GRPC_HOST ?? 'localhost',
    updatesPort: Number(process.env.GRPC_UPDATES_PORT ?? '6881'),
    apiPort: Number(process.env.GRPC_API_PORT ?? '6877')
  }
})

export const requiredFields = ['BLOCKCHAIN_DAPP_FATHER_ADDRESS']

export const validateEnv = () => {
  requiredFields.forEach((field) => {
    if (!process.env[field]) {
      throw new Error(`${field} is not defined in the environment`)
    }
  })
}
