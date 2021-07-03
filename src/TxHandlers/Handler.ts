import { BlockchainClient } from '../BlockchainClient'
import { DatabaseClient } from '../Database'
import { Update } from '../UpdateParser'

export interface IHandler {
  handleUpdate: (chunk: Update) => Promise<void>
}

export abstract class Handler {
  db: DatabaseClient
  blockchain: BlockchainClient

  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    this.db = db
    this.blockchain = blockchain
  }
}
