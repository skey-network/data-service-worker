// Original file: proto/blockchain_api.proto

import type { FeatureActivationStatus as _waves_node_grpc_FeatureActivationStatus, FeatureActivationStatus__Output as _waves_node_grpc_FeatureActivationStatus__Output } from '../../../waves/node/grpc/FeatureActivationStatus';

export interface ActivationStatusResponse {
  'height'?: (number);
  'voting_interval'?: (number);
  'voting_threshold'?: (number);
  'next_check'?: (number);
  'features'?: (_waves_node_grpc_FeatureActivationStatus)[];
}

export interface ActivationStatusResponse__Output {
  'height': (number);
  'voting_interval': (number);
  'voting_threshold': (number);
  'next_check': (number);
  'features': (_waves_node_grpc_FeatureActivationStatus__Output)[];
}
