import * as Crypto from '@waves/ts-lib-crypto'
import {
  getStateUpdates,
  getAssetUpdates,
  bufforToAddress,
  getBalanceUpdates
} from './AbstractHandler'
import { Logger } from '../Logger'
import { AssetInfoResponse, AssetStateUpdate, SubscribeEvent } from '../Types'
import { Blockchain } from '../Blockchain'
import { Key } from '../../models/Key'
import config from '../../config'

const logger = new Logger('KeyHandler')

export const handleKeyUpdates = async (chunk: SubscribeEvent) => {
  const assetUpdates = getAssetUpdates(getStateUpdates(chunk))

  for (const assetUpdate of assetUpdates) {
    const assetId = bufforToAddress(assetUpdate.asset_id)
    const asset = await Blockchain.fetchAsset(assetId)

    const error = isValidAsset(asset)

    if (error) {
      logger.debug(error)
      continue
    }

    await save(assetId, asset)
  }
}

export const handleKeyTransferUpdates = async (chunk: SubscribeEvent) => {
  const balanceUpdates = getBalanceUpdates(getStateUpdates(chunk))

  const filtered = balanceUpdates.filter((balance) => balance.amount?.amount === '1')

  for (const balance of filtered) {
    const assetId = bufforToAddress(balance.amount?.asset_id)
    const owner = bufforToAddress(balance.address)
    const asset = await Blockchain.fetchAsset(assetId)

    const error = isValidAsset(asset)

    if (error) {
      logger.debug(error)
      continue
    }

    await save(assetId, asset, owner)
  }
}

export const save = async (assetId: string, asset: AssetInfoResponse, owner?: string) => {
  const { device, validTo } = extractKeyData(asset.description ?? '')
  const issueTimestamp = Number(asset.issue_transaction?.transaction?.timestamp)
  const name = asset.name

  const issuer = Crypto.address(
    { publicKey: asset.issuer ?? [] },
    config().blockchain.chainId
  )

  const obj = {
    assetId,
    issuer,
    issueTimestamp,
    name,
    device,
    validTo
  }

  const doc = await Key.findOne({ assetId })

  if (doc) {
    await Key.updateOne({ assetId }, { owner })
    logger.log(`Key ${assetId} updated`)
  } else {
    await Key.create({ ...obj, owner: obj.issuer })
    logger.log(`Key ${assetId} created`)
  }
}

export const isValidAsset = (asset: AssetInfoResponse) => {
  const MIN_ADDRESS_LENGTH = 35
  const MIN_DESCRIPTION_LENGTH = 37

  if (asset.decimals !== 0) return 'invalid decimals'
  if (asset.reissuable) return 'invalid reissuable'
  if (asset.total_volume !== '1') return 'invalid volume'

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

export const extractKeyData = (description: string) => {
  const [device, validTo] = description.split('_')
  return { device, validTo: Number(validTo) }
}
