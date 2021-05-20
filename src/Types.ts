import { SubscribeEvent as RawSubscribeEvent } from '../proto/interfaces/waves/events/grpc/SubscribeEvent'
import { _waves_DataTransactionData_DataEntry as RawEntry } from '../proto/interfaces/waves/DataTransactionData'
import { BlocksApiClient as RawBlocksApiClient } from '../proto/interfaces/waves/node/grpc/BlocksApi'
import { BlockchainUpdatesApiClient as RawBlockchainUpdatesApiClient } from '../proto/interfaces/waves/events/grpc/BlockchainUpdatesApi'

export type SubscribeEvent = RawSubscribeEvent
export type Entry = RawEntry

export type BlocksApiClient = RawBlocksApiClient
export type BlockchainUpdatesApiClient = RawBlockchainUpdatesApiClient
