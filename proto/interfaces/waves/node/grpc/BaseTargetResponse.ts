// Original file: proto/blockchain_api.proto

import type { Long } from '@grpc/proto-loader';

export interface BaseTargetResponse {
  'base_target'?: (number | string | Long);
}

export interface BaseTargetResponse__Output {
  'base_target': (string);
}
