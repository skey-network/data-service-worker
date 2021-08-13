import { ParsedUpdate, EntriesForAddress, ParsedEntry } from '../UpdateParser'
import { Handler, UpdateItemPayload } from './Handler'
import { Logger } from '../Logger'
import { ACTIVE_KEYWORD, USER_PREFIX, USER_REGEX } from '../Constants'

interface OrganisationPayload {
  name?: string
  description?: string
  type?: string
  users: {
    id: string
    whitelisted: boolean
  }[]
}

export class OrganisationHandler extends Handler {
  protected logger = new Logger(OrganisationHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    this.logger.debug(OrganisationHandler.name, 'handle height', update.height)

    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate(item: EntriesForAddress) {
    const { address, entries } = item
    const payload = this.parseEntries(entries)

    const exists = await this.db.safeFindOne({ address }, 'organisations')
    const func = exists ? this.updateOrganisation : this.createOrganisation

    return await func.bind(this)(address, payload)
  }

  parseEntries(entries: ParsedEntry[]): OrganisationPayload {
    const fields = ['name', 'description', 'type']

    const props = Object.fromEntries(
      entries
        .filter(({ key }) => fields.includes(key))
        .map(({ key, value }) => [key, value])
    )

    const users = this.extractWhitelist({
      entries,
      regex: USER_REGEX,
      prefix: USER_PREFIX,
      compareFunc: (value) => value === ACTIVE_KEYWORD
    })

    return { ...props, users }
  }

  async createOrganisation(address: string, payload: OrganisationPayload) {
    if (payload.type !== 'organisation') return

    const { name, description } = payload

    await this.db.safeInsertOne(
      {
        address,
        name,
        description,
        users: this.idsFromWhitelist(payload.users),
        whitelisted: false
      },
      'organisations'
    )

    this.logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, payload: OrganisationPayload) {
    const { name, description, users } = payload

    const commonUpdateProps: UpdateItemPayload = {
      collection: 'organisations',
      type: 'organisation',
      idField: 'address',
      id: address
    }

    await this.updateList({
      ...commonUpdateProps,
      whitelistName: 'users',
      list: users
    })

    await this.updateProps({
      ...commonUpdateProps,
      data: { name, description }
    })
  }
}
