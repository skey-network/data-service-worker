// Original file: proto/events.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../../waves/Amount';
import type { InvokeScriptResult as _waves_InvokeScriptResult, InvokeScriptResult__Output as _waves_InvokeScriptResult__Output } from '../../waves/InvokeScriptResult';
import type { Long } from '@grpc/proto-loader';

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument {
  'integer_value'?: (number | string | Long);
  'binary_value'?: (Buffer | Uint8Array | string);
  'string_value'?: (string);
  'boolean_value'?: (boolean);
  'list'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List | null);
  'value'?: "integer_value"|"binary_value"|"string_value"|"boolean_value"|"list";
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output {
  'integer_value'?: (string);
  'binary_value'?: (Buffer);
  'string_value'?: (string);
  'boolean_value'?: (boolean);
  'list'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List__Output | null);
  'value': "integer_value"|"binary_value"|"string_value"|"boolean_value"|"list";
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata {
  'd_app_address'?: (Buffer | Uint8Array | string);
  'function_name'?: (string);
  'arguments'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument)[];
  'payments'?: (_waves_Amount)[];
  'result'?: (_waves_InvokeScriptResult | null);
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata__Output {
  'd_app_address': (Buffer);
  'function_name': (string);
  'arguments': (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output)[];
  'payments': (_waves_Amount__Output)[];
  'result': (_waves_InvokeScriptResult__Output | null);
}

export interface _waves_events_TransactionMetadata_LeaseMetadata {
  'recipient_address'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_TransactionMetadata_LeaseMetadata__Output {
  'recipient_address': (Buffer);
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List {
  'items'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument)[];
}

export interface _waves_events_TransactionMetadata_InvokeScriptMetadata_Argument_List__Output {
  'items': (_waves_events_TransactionMetadata_InvokeScriptMetadata_Argument__Output)[];
}

export interface _waves_events_TransactionMetadata_MassTransferMetadata {
  'recipients_addresses'?: (Buffer | Uint8Array | string)[];
}

export interface _waves_events_TransactionMetadata_MassTransferMetadata__Output {
  'recipients_addresses': (Buffer)[];
}

export interface _waves_events_TransactionMetadata_TransferMetadata {
  'recipient_address'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_TransactionMetadata_TransferMetadata__Output {
  'recipient_address': (Buffer);
}

export interface TransactionMetadata {
  'transfer'?: (_waves_events_TransactionMetadata_TransferMetadata | null);
  'mass_transfer'?: (_waves_events_TransactionMetadata_MassTransferMetadata | null);
  'invoke_script'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata | null);
  'lease_meta'?: (_waves_events_TransactionMetadata_LeaseMetadata | null);
  'metadata'?: "transfer"|"mass_transfer"|"invoke_script"|"lease_meta";
}

export interface TransactionMetadata__Output {
  'transfer'?: (_waves_events_TransactionMetadata_TransferMetadata__Output | null);
  'mass_transfer'?: (_waves_events_TransactionMetadata_MassTransferMetadata__Output | null);
  'invoke_script'?: (_waves_events_TransactionMetadata_InvokeScriptMetadata__Output | null);
  'lease_meta'?: (_waves_events_TransactionMetadata_LeaseMetadata__Output | null);
  'metadata': "transfer"|"mass_transfer"|"invoke_script"|"lease_meta";
}
