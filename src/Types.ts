import { SubscribeEvent as RawSubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
import { _waves_DataTransactionData_DataEntry as RawEntry } from '../proto/interfaces/waves/DataTransactionData'
import { BlocksApiClient as RawBlocksApiClient } from '../proto/interfaces/waves/node/grpc/BlocksApi'
import { BlockchainUpdatesApiClient as RawBlockchainUpdatesApiClient } from '../proto/interfaces/waves/events/grpc/BlockchainUpdatesApi'
import { SubscribeRequest as RawSubscribeRequest } from '../proto/interfaces/waves/events/grpc/SubscribeRequest'
import {
  StateUpdate as RawStateUpdate,
  _waves_events_StateUpdate_AssetStateUpdate as RawAssetStateUpdate,
  _waves_events_StateUpdate_BalanceUpdate as RawBalanceUpdate
} from '../proto/interfaces/waves/events/StateUpdate'
import { AssetsApiClient as RawAssetsApiClient } from '../proto/interfaces/waves/node/grpc/AssetsApi'
import { AssetInfoResponse as RawAssetInfoResponse } from '../proto/interfaces/waves/node/grpc/AssetInfoResponse'

// Interfaces
export type SubscribeEvent = RawSubscribeEvent
export type SubscribeRequest = RawSubscribeRequest
export type Entry = RawEntry
export type StateUpdate = RawStateUpdate
export type AssetStateUpdate = RawAssetStateUpdate
export type AssetInfoResponse = RawAssetInfoResponse
export type BalanceUpdate = RawBalanceUpdate

// APIs
export type BlocksApiClient = RawBlocksApiClient
export type BlockchainUpdatesApiClient = RawBlockchainUpdatesApiClient
export type AssetsApiClient = RawAssetsApiClient
