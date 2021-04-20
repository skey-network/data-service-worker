// Original file: proto/transactions_api.proto

import type { Long } from '@grpc/proto-loader';

export interface CalculateFeeResponse {
  'asset_id'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
}

export interface CalculateFeeResponse__Output {
  'asset_id': (Buffer);
  'amount': (string);
}
