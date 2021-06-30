import { Update } from '../UpdateParser'
import { createLogger } from '../Logger'
import { AssetInfoResponse } from '../Types'
import * as Blockchain from '../Blockchain'
import { publicKeyToAddress } from '../Common'
import { Key } from '../../models/Key'
import { bufferToString } from '../Common'

const logger = createLogger('KeyHandler')

export const handleKeyUpdates = async (update: Update) => {
  await handleAssetUpdates(update)
  await handleBalanceUpdates(update)
}

const handleAssetUpdates = async (update: Update) => {
  for (const assetUpdate of update.assetUpdates) {
    const assetId = bufferToString((assetUpdate as any).after?.asset_id?.data)
    if (!assetId) return

    const asset = await Blockchain.fetchAsset(assetId)

    if (!asset) {
      return logger.error('cannot fetch asset')
    }

    const validationError = isValidAsset(asset)
    if (validationError) continue

    await save(assetId, asset)
  }
}

const handleBalanceUpdates = async (update: Update) => {
  const filtered = update.balanceUpdates.filter(
    (balance) => balance.amount_after?.amount === '1'
  )

  for (const balance of filtered) {
    const assetId = bufferToString((balance as any).amount_after?.asset_id?.data)

    const owner = bufferToString(balance.address)

    const asset = await Blockchain.fetchAsset(assetId)

    if (!asset) {
      return logger.warn(
        `Cannot fetch asset at height ${update.height}. There might have been a rollback.`
      )
    }

    const error = isValidAsset(asset)

    if (error) {
      // logger.debug(error)
      continue
    }

    await save(assetId, asset, owner)
  }
}

const save = async (assetId: string, asset: AssetInfoResponse, owner?: string) => {
  const { device, validTo } = extractKeyData(asset.description ?? '')
  const issueTimestamp = Number(asset.issue_transaction?.transaction?.timestamp)
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

  const doc = await Key.findOne({ assetId })

  if (doc) {
    await Key.updateOne({ assetId }, { owner, burned })
    logger.log(`Key ${assetId} updated`)
  } else {
    await Key.create({ ...obj, owner: obj.issuer })
    logger.log(`Key ${assetId} created`)
  }
}

const isValidAsset = (asset: AssetInfoResponse) => {
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

  const { device, validTo } = extractKeyData(asset.description)

  if (!device || device?.length < MIN_ADDRESS_LENGTH) return 'invalid device'
  if (!validTo || isNaN(validTo)) return 'invalid validto'

  return null
}

const extractKeyData = (description: string) => {
  const [device, validTo] = description.split('_')
  return { device, validTo: Number(validTo) }
}
