// Original file: proto/transaction.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../waves/Recipient';
import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface TransferTransactionData {
  'recipient'?: (_waves_Recipient | null);
  'amount'?: (_waves_Amount | null);
  'attachment'?: (Buffer | Uint8Array | string);
}

export interface TransferTransactionData__Output {
  'recipient': (_waves_Recipient__Output | null);
  'amount': (_waves_Amount__Output | null);
  'attachment': (Buffer);
}
