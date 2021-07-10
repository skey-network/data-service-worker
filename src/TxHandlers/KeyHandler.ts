import { Logger } from '../Logger'
import { AssetInfoResponse } from '../Types'
import { publicKeyToAddress } from '../Common'
import { Handler } from './Handler'
import { DatabaseClient } from '../Clients/DatabaseClient'
import { BlockchainClient } from '../Clients/BlockchainClient'
import { ParsedUpdate } from '../UpdateParser'

export class KeyHandler extends Handler {
  private logger = new Logger(KeyHandler.name)

  get keyModel() {
    return this.db.models.keyModel
  }

  async handleUpdate(update: ParsedUpdate) {
    await this.handleAssetUpdates(update)
    await this.handleBalanceUpdates(update)
  }

  async handleAssetUpdates(update: ParsedUpdate) {
    for (const { asset_id } of update.assets) {
      const asset = await this.blockchain.fetchAsset(asset_id)
      if (!asset) return this.rollbackWarning(update.height)

      const validationError = this.isValidAsset(asset)
      if (validationError) continue

      await this.save(asset_id, asset)
    }
  }

  async handleBalanceUpdates(update: ParsedUpdate) {
    for (const balance of update.balances) {
      if (balance.amount !== 1) continue

      const asset = await this.blockchain.fetchAsset(balance.assetId)
      if (!asset) return this.rollbackWarning(update.height)

      const error = this.isValidAsset(asset)
      if (error) continue

      await this.save(balance.assetId, asset, balance.address)
    }
  }

  rollbackWarning(height: number) {
    return this.logger.warn(
      `Cannot fetch asset at height ${height}. There might have been a rollback.`
    )
  }

  getIssueTimestamp(asset: AssetInfoResponse) {
    const value = asset.issue_transaction?.transaction?.timestamp
    return typeof value === 'string' ? Number(value) : null
  }

  async save(assetId: string, asset: AssetInfoResponse, owner?: string) {
    const { device, validTo } = this.extractKeyData(asset.description ?? '')
    const issueTimestamp = this.getIssueTimestamp(asset)
    const name = asset.name
    const issuer = publicKeyToAddress(asset.issuer)
    const burned = asset.total_volume === '0'

    const obj = {
      assetId,
      issuer,
      issueTimestamp,
      name,
      device,
      validTo,
      burned
    }

    const doc = await this.keyModel.findOne({ assetId })

    if (doc) {
      await this.keyModel.updateOne({ assetId }, { owner, burned })
      this.logger.log(`Key ${assetId} updated`)
    } else {
      await this.keyModel.create({ ...obj, owner: obj.issuer })
      this.logger.log(`Key ${assetId} created`)
    }
  }

  isValidAsset(asset: AssetInfoResponse) {
    const MIN_ADDRESS_LENGTH = 35
    const MIN_DESCRIPTION_LENGTH = 37

    if (asset.decimals !== 0) return 'invalid decimals'
    if (asset.reissuable) return 'invalid reissuable'
    if (asset.total_volume !== '1' && asset.total_volume !== '0') return 'invalid volume'

    if (!asset.name) return 'invalid name'
    if (!asset.description) return 'invalid description'
    if (asset.description?.length < MIN_DESCRIPTION_LENGTH) {
      return `description shorter than ${MIN_DESCRIPTION_LENGTH}`
    }

    const { device, validTo } = this.extractKeyData(asset.description)

    if (!device || device?.length < MIN_ADDRESS_LENGTH) return 'invalid device'
    if (!validTo || isNaN(validTo)) return 'invalid validto'

    return null
  }

  extractKeyData(description: string) {
    const [device, validTo] = description.split('_')
    return { device, validTo: Number(validTo) }
  }
}
