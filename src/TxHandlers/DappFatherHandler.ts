import config from '../../config'
import {
  ACTIVE_KEYWORD,
  SUPPLIER_PREFIX,
  SUPPLIER_REGEX,
  ORGANISATION_REGEX,
  ORGANISATION_PREFIX
} from '../Constants'
import { Handler } from './Handler'
import { Logger } from '../Logger'
import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'

export class DappFatherHandler extends Handler {
  protected logger = new Logger(DappFatherHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate({ address, entries }: EntriesForAddress) {
    const { dappFatherAddress } = config().blockchain

    if (address !== dappFatherAddress) return

    for (const entry of entries) {
      await this.handleSupplierEntry(entry)
      await this.handleOrganisationEntry(entry)
    }
  }

  async handleSupplierEntry({ key, value }: ParsedEntry) {
    if (!SUPPLIER_REGEX.test(key)) return

    const address = key.replace(SUPPLIER_PREFIX, '')
    const whitelisted = value === ACTIVE_KEYWORD

    const exists = await this.db.safeFindOne({ address }, 'suppliers')

    const func = exists ? this.updateSupplier : this.createSupplier
    return await func.bind(this)(address, whitelisted)
  }

  async handleOrganisationEntry({ key, value }: ParsedEntry) {
    if (!ORGANISATION_REGEX.test(key)) return

    const address = key.replace(ORGANISATION_PREFIX, '')
    const whitelisted = value === ACTIVE_KEYWORD

    const exists = await this.db.safeFindOne({ address }, 'organisations')

    const func = exists ? this.updateOrganisation : this.createOrganisation
    return await func.bind(this)(address, whitelisted)
  }

  async createSupplier(address: string, whitelisted: boolean) {
    const success = await this.db.safeInsertOne(
      {
        address,
        devices: [],
        organisations: [],
        whitelisted
      },
      'suppliers'
    )

    success && this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, whitelisted: boolean) {
    const success = await this.db.safeUpdateOne({ address }, { whitelisted }, 'suppliers')
    success && this.logger.log(`Supplier ${address} updated`)
  }

  async createOrganisation(address: string, whitelisted: boolean) {
    const success = await this.db.safeInsertOne(
      { address, whitelisted, users: [] },
      'organisations'
    )
    success && this.logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, whitelisted: boolean) {
    const success = await this.db.safeUpdateOne(
      { address },
      { whitelisted },
      'organisations'
    )
    success && this.logger.log(`Organisation ${address} updated`)
  }
}
