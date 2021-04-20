// Original file: proto/transaction.proto

import type { Long } from '@grpc/proto-loader';

export interface PaymentTransactionData {
  'recipient_address'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
}

export interface PaymentTransactionData__Output {
  'recipient_address': (Buffer);
  'amount': (string);
}
