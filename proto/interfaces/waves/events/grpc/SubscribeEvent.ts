// Original file: proto/blockchain_updates.proto

import type { BlockchainUpdated as _waves_events_BlockchainUpdated, BlockchainUpdated__Output as _waves_events_BlockchainUpdated__Output } from '../../../waves/events/BlockchainUpdated';

export interface SubscribeEvent {
  'update'?: (_waves_events_BlockchainUpdated | null);
}

export interface SubscribeEvent__Output {
  'update': (_waves_events_BlockchainUpdated__Output | null);
}
