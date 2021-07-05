import { Update, DataUpdate } from '../UpdateParser'
import { Entry } from '../Types'
import config from '../../config'
import {
  ACTIVE_KEYWORD,
  SUPPLIER_PREFIX,
  SUPPLIER_REGEX,
  ORGANISATION_REGEX,
  ORGANISATION_PREFIX
} from '../Constants'
import { bufferToString } from '../Common'
import { Handler } from './Handler'
import { DatabaseClient } from '../Database'
import { BlockchainClient } from '../BlockchainClient'
import { Logger } from '../Logger'

export class DappFatherHandler extends Handler {
  constructor(db: DatabaseClient, blockchain: BlockchainClient) {
    super(db, blockchain)
  }

  private logger = new Logger(DappFatherHandler.name)

  get supplierModel() {
    return this.db.models.supplierModel
  }

  get organisationModel() {
    return this.db.models.organisationModel
  }

  async handleUpdate(update: Update) {
    for (const item of update.dataUpdates) {
      await this.handleSingleUpdate(item)
    }
  }

  async handleSingleUpdate(item: DataUpdate) {
    const { dappFatherAddress } = config().blockchain
    const address = bufferToString(item.address)

    if (address !== dappFatherAddress) {
      return
      // return logger.debug('address is not dapp father')
    }

    for (const entry of item.entries) {
      await this.handleSupplierEntry(entry)
      await this.handleOrganisationEntry(entry)
    }
  }

  async handleSupplierEntry(entry: Entry) {
    if (!SUPPLIER_REGEX.test(entry.key ?? '')) {
      return
      // return logger.debug('invalid key')
    }

    const address = entry.key!.replace(SUPPLIER_PREFIX, '')
    const whitelisted = entry.string_value === ACTIVE_KEYWORD

    const exists = await this.supplierModel.exists({ address })

    const func = exists ? this.updateSupplier : this.createSupplier
    return await func.bind(this)(address, whitelisted)
  }

  async handleOrganisationEntry(entry: Entry) {
    if (!ORGANISATION_REGEX.test(entry.key ?? '')) {
      return
      // return logger.debug('invalid key')
    }

    const address = entry.key!.replace(ORGANISATION_PREFIX, '')
    const whitelisted = entry.string_value === ACTIVE_KEYWORD

    const exists = await this.organisationModel.exists({ address })

    const func = exists ? this.updateOrganisation : this.createOrganisation
    return await func.bind(this)(address, whitelisted)
  }

  async createSupplier(address: string, whitelisted: boolean) {
    await this.supplierModel.create({ address, devices: [], whitelisted })
    this.logger.log(`Supplier ${address} created`)
  }

  async updateSupplier(address: string, whitelisted: boolean) {
    await this.supplierModel.updateOne({ address }, { whitelisted })
    this.logger.log(`Supplier ${address} updated`)
  }

  async createOrganisation(address: string, whitelisted: boolean) {
    await this.organisationModel.create({ address, whitelisted })
    this.logger.log(`Organisation ${address} created`)
  }

  async updateOrganisation(address: string, whitelisted: boolean) {
    await this.organisationModel.updateOne({ address }, { whitelisted })
    this.logger.log(`Organisation ${address} updated`)
  }
}
