import { Update, DataUpdate } from '../UpdateParser'
import { createLogger } from '../Logger'
import { bufferToString } from '../Common'
import { Entry } from '../Types'
import { Handler } from './Handler'
import { DatabaseClient } from '../Database'
import { BlockchainClient } from '../BlockchainClient'

interface OrganisationPayload {
  name: string
  description: string
  type: string
}

const logger = createLogger('OrganisationHandler')

export class OrganisationHandler extends Handler {
  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    super(db, blockchain)
  }

  get organisationModel() {
    return this.db.models.organisationModel
  }

  async handleUpdate(update: Update) {
    console.log('parse organisation')
    for (const item of update.dataUpdates) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: DataUpdate) {
    const address = bufferToString(item.address ?? [])
    const payload = this.parseEntries(item.entries)

    const exists = await this.organisationModel.exists({ address })
    const func = exists ? this.updateOrganisation : this.createOrganisation

    return await func.bind(this)(address, payload)
  }

  parseEntries(entries: Entry[]): OrganisationPayload {
    const fields = ['name', 'description', 'type']

    return Object.fromEntries(
      entries
        .filter((entry) => fields.includes(entry.key!))
        .map((entry) => [entry.key, entry.string_value])
    )
  }

  async createOrganisation(address: string, payload: OrganisationPayload) {
    if (payload.type !== 'organisation') {
      // return logger.debug('invalid type')
      return
    }

    const { name, description } = payload

    await this.organisationModel.create({ address, name, description })
    logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, payload: OrganisationPayload) {
    const { name, description } = payload

    await this.organisationModel.updateOne({ address }, { name, description })
    logger.log(`Organisation ${address} updated`)
  }
}
