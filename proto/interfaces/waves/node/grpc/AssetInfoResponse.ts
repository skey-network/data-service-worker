// Original file: proto/assets_api.proto

import type { ScriptData as _waves_node_grpc_ScriptData, ScriptData__Output as _waves_node_grpc_ScriptData__Output } from '../../../waves/node/grpc/ScriptData';
import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../../../waves/SignedTransaction';
import type { Long } from '@grpc/proto-loader';

export interface AssetInfoResponse {
  'issuer'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'description'?: (string);
  'decimals'?: (number);
  'reissuable'?: (boolean);
  'total_volume'?: (number | string | Long);
  'script'?: (_waves_node_grpc_ScriptData | null);
  'sponsorship'?: (number | string | Long);
  'sponsor_balance'?: (number | string | Long);
  'issue_transaction'?: (_waves_SignedTransaction | null);
}

export interface AssetInfoResponse__Output {
  'issuer': (Buffer);
  'name': (string);
  'description': (string);
  'decimals': (number);
  'reissuable': (boolean);
  'total_volume': (string);
  'script': (_waves_node_grpc_ScriptData__Output | null);
  'sponsorship': (string);
  'sponsor_balance': (string);
  'issue_transaction': (_waves_SignedTransaction__Output | null);
}
