import { BlockchainClient } from '../Clients/BlockchainClient'
import { DatabaseClient } from '../Clients/DatabaseClient'
import { Config } from '../Config'
import { ParsedUpdate } from '../UpdateParser'

export abstract class Handler {
  config: Config
  db: DatabaseClient
  blockchain: BlockchainClient

  constructor(config: Config, db: DatabaseClient, blockchain: BlockchainClient) {
    this.config = config
    this.db = db
    this.blockchain = blockchain
  }

  async handleUpdate(update: ParsedUpdate) {
    throw new Error('handleUpdate not implemented')
  }
}
