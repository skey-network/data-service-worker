// Original file: proto/transaction.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../waves/Recipient';
import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface InvokeScriptTransactionData {
  'd_app'?: (_waves_Recipient | null);
  'function_call'?: (Buffer | Uint8Array | string);
  'payments'?: (_waves_Amount)[];
}

export interface InvokeScriptTransactionData__Output {
  'd_app': (_waves_Recipient__Output | null);
  'function_call': (Buffer);
  'payments': (_waves_Amount__Output)[];
}
