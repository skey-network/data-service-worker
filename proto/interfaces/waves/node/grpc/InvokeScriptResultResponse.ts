// Original file: proto/transactions_api.proto

import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../../../waves/SignedTransaction';
import type { InvokeScriptResult as _waves_InvokeScriptResult, InvokeScriptResult__Output as _waves_InvokeScriptResult__Output } from '../../../waves/InvokeScriptResult';

export interface InvokeScriptResultResponse {
  'transaction'?: (_waves_SignedTransaction | null);
  'result'?: (_waves_InvokeScriptResult | null);
}

export interface InvokeScriptResultResponse__Output {
  'transaction': (_waves_SignedTransaction__Output | null);
  'result': (_waves_InvokeScriptResult__Output | null);
}
