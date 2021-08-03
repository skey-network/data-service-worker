import { ParsedUpdate, EntriesForAddress, ParsedEntry } from '../UpdateParser'
import { Handler } from './Handler'
import { Logger } from '../Logger'

interface OrganisationPayload {
  name?: string
  description?: string
  type?: string
}

export class OrganisationHandler extends Handler {
  get organisationModel() {
    return this.db.models.organisationModel
  }

  private logger = new Logger(OrganisationHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    this.logger.debug(OrganisationHandler.name, 'handle height', update.height)

    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const { address, entries } = item
    const payload = this.parseEntries(entries)

    const exists = await this.organisationModel.exists({ address })
    const func = exists ? this.updateOrganisation : this.createOrganisation

    return await func.bind(this)(address, payload)
  }

  parseEntries(entries: ParsedEntry[]): OrganisationPayload {
    const fields = ['name', 'description', 'type']

    return Object.fromEntries(
      entries
        .filter(({ key }) => fields.includes(key))
        .map(({ key, value }) => [key, value])
    )
  }

  async createOrganisation(address: string, payload: OrganisationPayload) {
    if (payload.type !== 'organisation') return

    const { name, description } = payload

    await this.organisationModel.create({
      address,
      name,
      description,
      whitelisted: false
    })

    this.logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, payload: OrganisationPayload) {
    const { type, ...update } = payload

    await this.organisationModel.updateOne({ address }, update)
    this.logger.log(`Organisation ${address} updated`)
  }
}
