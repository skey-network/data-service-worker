// Original file: proto/invoke_script_result.proto

import type { _waves_DataTransactionData_DataEntry, _waves_DataTransactionData_DataEntry__Output } from '../waves/DataTransactionData';
import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';
import type { Long } from '@grpc/proto-loader';

export interface _waves_InvokeScriptResult_Burn {
  'asset_id'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
}

export interface _waves_InvokeScriptResult_Burn__Output {
  'asset_id': (Buffer);
  'amount': (string);
}

export interface _waves_InvokeScriptResult_ErrorMessage {
  'code'?: (number);
  'text'?: (string);
}

export interface _waves_InvokeScriptResult_ErrorMessage__Output {
  'code': (number);
  'text': (string);
}

export interface _waves_InvokeScriptResult_Issue {
  'asset_id'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'description'?: (string);
  'amount'?: (number | string | Long);
  'decimals'?: (number);
  'reissuable'?: (boolean);
  'script'?: (Buffer | Uint8Array | string);
  'nonce'?: (number | string | Long);
}

export interface _waves_InvokeScriptResult_Issue__Output {
  'asset_id': (Buffer);
  'name': (string);
  'description': (string);
  'amount': (string);
  'decimals': (number);
  'reissuable': (boolean);
  'script': (Buffer);
  'nonce': (string);
}

export interface _waves_InvokeScriptResult_Payment {
  'address'?: (Buffer | Uint8Array | string);
  'amount'?: (_waves_Amount | null);
}

export interface _waves_InvokeScriptResult_Payment__Output {
  'address': (Buffer);
  'amount': (_waves_Amount__Output | null);
}

export interface _waves_InvokeScriptResult_Reissue {
  'asset_id'?: (Buffer | Uint8Array | string);
  'amount'?: (number | string | Long);
  'is_reissuable'?: (boolean);
}

export interface _waves_InvokeScriptResult_Reissue__Output {
  'asset_id': (Buffer);
  'amount': (string);
  'is_reissuable': (boolean);
}

export interface _waves_InvokeScriptResult_SponsorFee {
  'min_fee'?: (_waves_Amount | null);
}

export interface _waves_InvokeScriptResult_SponsorFee__Output {
  'min_fee': (_waves_Amount__Output | null);
}

export interface InvokeScriptResult {
  'data'?: (_waves_DataTransactionData_DataEntry)[];
  'transfers'?: (_waves_InvokeScriptResult_Payment)[];
  'issues'?: (_waves_InvokeScriptResult_Issue)[];
  'reissues'?: (_waves_InvokeScriptResult_Reissue)[];
  'burns'?: (_waves_InvokeScriptResult_Burn)[];
  'error_message'?: (_waves_InvokeScriptResult_ErrorMessage | null);
  'sponsor_fees'?: (_waves_InvokeScriptResult_SponsorFee)[];
}

export interface InvokeScriptResult__Output {
  'data': (_waves_DataTransactionData_DataEntry__Output)[];
  'transfers': (_waves_InvokeScriptResult_Payment__Output)[];
  'issues': (_waves_InvokeScriptResult_Issue__Output)[];
  'reissues': (_waves_InvokeScriptResult_Reissue__Output)[];
  'burns': (_waves_InvokeScriptResult_Burn__Output)[];
  'error_message': (_waves_InvokeScriptResult_ErrorMessage__Output | null);
  'sponsor_fees': (_waves_InvokeScriptResult_SponsorFee__Output)[];
}
