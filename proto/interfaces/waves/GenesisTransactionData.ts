// Original file: proto/transaction.proto

import type { Long } from '@grpc/proto-loader';

export interface GenesisTransactionData {
  'recipient_address'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
}

export interface GenesisTransactionData__Output {
  'recipient_address': (Buffer);
  'amount': (string);
}
