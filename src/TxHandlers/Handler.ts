import { BlockchainClient } from '../BlockchainClient'
import { DatabaseClient } from '../Database'
import { Update } from '../UpdateParser'

export abstract class Handler {
  db: DatabaseClient
  blockchain: BlockchainClient

  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    this.db = db
    this.blockchain = blockchain
  }

  async handleUpdate(update: Update) {
    throw new Error('not implemented')
  }
}
