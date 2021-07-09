import config from '../../config'
import {
  ACTIVE_KEYWORD,
  SUPPLIER_PREFIX,
  SUPPLIER_REGEX,
  ORGANISATION_REGEX,
  ORGANISATION_PREFIX
} from '../Constants'
import { Handler } from './Handler'
import { DatabaseClient } from '../Clients/DatabaseClient'
import { BlockchainClient } from '../Clients/BlockchainClient'
import { Logger } from '../Logger'
import { EntriesForAddress, ParsedEntry, ParsedUpdate } from '../UpdateParser'

export class DappFatherHandler extends Handler {
  private logger = new Logger(DappFatherHandler.name)

  get supplierModel() {
    return this.db.models.supplierModel
  }

  get organisationModel() {
    return this.db.models.organisationModel
  }

  async handleUpdate(update: ParsedUpdate) {
    for (const entries of update.entries) {
      await this.handleSingleUpdate(entries)
    }
  }

  async handleSingleUpdate({ address, entries }: EntriesForAddress) {
    const { dappFatherAddress } = config().blockchain
    this.logger.debug('dappFather address', dappFatherAddress)
    this.logger.debug('entry address', dappFatherAddress)

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

    const exists = await this.supplierModel.exists({ address })

    const func = exists ? this.updateSupplier : this.createSupplier
    return await func.bind(this)(address, whitelisted)
  }

  async handleOrganisationEntry({ key, value }: ParsedEntry) {
    if (!ORGANISATION_REGEX.test(key)) return

    const address = key.replace(ORGANISATION_PREFIX, '')
    const whitelisted = value === ACTIVE_KEYWORD

    const exists = await this.organisationModel.exists({ address })

    const func = exists ? this.updateOrganisation : this.createOrganisation
    return await func.bind(this)(address, whitelisted)
  }

  async createSupplier(address: string, whitelisted: boolean) {
    await this.supplierModel.create({
      address,
      devices: [],
      organisations: [],
      whitelisted
    })
    this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, whitelisted: boolean) {
    await this.supplierModel.updateOne({ address }, { whitelisted })
    this.logger.log(`Supplier ${address} updated`)
  }

  async createOrganisation(address: string, whitelisted: boolean) {
    await this.organisationModel.create({ address, whitelisted, users: [] })
    this.logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, whitelisted: boolean) {
    await this.organisationModel.updateOne({ address }, { whitelisted })
    this.logger.log(`Organisation ${address} updated`)
  }
}
