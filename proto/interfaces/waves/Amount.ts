// Original file: proto/amount.proto

import type { Long } from '@grpc/proto-loader';

export interface Amount {
  'asset_id'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
}

export interface Amount__Output {
  'asset_id': (Buffer);
  'amount': (string);
}
