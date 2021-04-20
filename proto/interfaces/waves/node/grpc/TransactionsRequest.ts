// Original file: proto/transactions_api.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../../../waves/Recipient';

export interface TransactionsRequest {
  'sender'?: (Buffer | Uint8Array | string);
  'recipient'?: (_waves_Recipient | null);
  'transaction_ids'?: (Buffer | Uint8Array | string)[];
}

export interface TransactionsRequest__Output {
  'sender': (Buffer);
  'recipient': (_waves_Recipient__Output | null);
  'transaction_ids': (Buffer)[];
}
