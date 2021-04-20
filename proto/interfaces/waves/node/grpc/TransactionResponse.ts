// Original file: proto/transactions_api.proto

import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../../../waves/SignedTransaction';
import type { ApplicationStatus as _waves_node_grpc_ApplicationStatus } from '../../../waves/node/grpc/ApplicationStatus';
import type { InvokeScriptResult as _waves_InvokeScriptResult, InvokeScriptResult__Output as _waves_InvokeScriptResult__Output } from '../../../waves/InvokeScriptResult';
import type { Long } from '@grpc/proto-loader';

export interface TransactionResponse {
  'id'?: (Buffer | Uint8Array | string);
  'height'?: (number | string | Long);
  'transaction'?: (_waves_SignedTransaction | null);
  'application_status'?: (_waves_node_grpc_ApplicationStatus | keyof typeof _waves_node_grpc_ApplicationStatus);
  'invoke_script_result'?: (_waves_InvokeScriptResult | null);
}

export interface TransactionResponse__Output {
  'id': (Buffer);
  'height': (string);
  'transaction': (_waves_SignedTransaction__Output | null);
  'application_status': (keyof typeof _waves_node_grpc_ApplicationStatus);
  'invoke_script_result': (_waves_InvokeScriptResult__Output | null);
}
