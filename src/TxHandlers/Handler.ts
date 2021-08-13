import { CollectionName } from '../../schemas/Schemas'
import { BlockchainClient } from '../Clients/BlockchainClient'
import { DatabaseClient } from '../Clients/DatabaseClient'
import { Config } from '../Config'
import { Logger } from '../Logger'
import { ParsedEntry, ParsedUpdate } from '../UpdateParser'

export interface ListItem {
  id: string
  whitelisted: boolean
}

export interface EntryMap {
  [key: string]: string[]
}

export interface ExtractWhitelistPayload {
  entries: ParsedEntry[]
  regex: RegExp
  prefix: string
  compareFunc: (value: any) => boolean
}

export interface UpdateItemPayload {
  collection: CollectionName
  type: string
  idField: string
  id: string
}

export interface UpdatePropsPayload extends UpdateItemPayload {
  data: any
}

export interface UpdateListPayload extends UpdateItemPayload {
  whitelistName: string
  list: ListItem[]
}

export abstract class Handler {
  protected logger: Logger
  config: Config
  db: DatabaseClient
  blockchain: BlockchainClient

  constructor(config: Config, db: DatabaseClient, blockchain: BlockchainClient) {
    this.config = config
    this.db = db
    this.blockchain = blockchain
    this.logger = new Logger(Handler.name, this.config.app.logs)
  }

  async handleUpdate(update: ParsedUpdate) {
    throw new Error('handleUpdate not implemented')
  }

  idsFromWhitelist(list: ListItem[]): string[] {
    return list.filter((item) => item.whitelisted).map((item) => item.id)
  }

  async updateProps(p: UpdatePropsPayload) {
    if (!p.data) return

    // MUTABLE
    // Delete undefined entries to prevent database from updating
    for (const [key, value] of Object.entries(p.data)) {
      if (value !== undefined) continue

      delete p.data[key]
    }

    const $set = p.data
    const query = { [p.idField]: p.id }

    const success = await this.db.safeUpdateOne(query, { $set }, p.collection)
    if (!success) return

    this.logger.log(`Updated ${p.type} ${p.id} attributes`)
  }

  async updateList(p: UpdateListPayload) {
    const whitelisted = p.list.filter((i) => i.whitelisted).map((i) => i.id)
    const blacklisted = p.list.filter((i) => !i.whitelisted).map((i) => i.id)

    const $pull = { [p.whitelistName]: { $in: blacklisted } }
    const $addToSet = { [p.whitelistName]: { $each: whitelisted } }

    const query = { [p.idField]: p.id }

    // TODO Can i pull and add to set in one query?

    blacklisting: if (blacklisted.length) {
      const success = await this.db.safeUpdateOne(query, { $pull }, p.collection)
      if (!success) break blacklisting

      this.logger.log(
        `Removed ${blacklisted.length} from ${p.type} ${p.id} ${p.whitelistName}`
      )
    }

    whitelisting: if (whitelisted.length) {
      const success = await this.db.safeUpdateOne(query, { $addToSet }, p.collection)
      if (!success) break whitelisting

      this.logger.log(
        `Appended ${whitelisted.length} to ${p.type} ${p.id} ${p.whitelistName}`
      )
    }
  }

  extractWhitelist(payload: ExtractWhitelistPayload): ListItem[] {
    return payload.entries
      .filter(({ key }) => payload.regex.test(key))
      .map(({ key, value }) => ({
        id: key.replace(payload.prefix, ''),
        whitelisted: payload.compareFunc(value)
      }))
  }
}
