// Original file: proto/events.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../../waves/Amount';
import type { _waves_DataTransactionData_DataEntry, _waves_DataTransactionData_DataEntry__Output } from '../../waves/DataTransactionData';
import type { Long } from '@grpc/proto-loader';

export interface _waves_events_StateUpdate_AssetDetails {
  'asset_id'?: (Buffer | Uint8Array | string);
  'issuer'?: (Buffer | Uint8Array | string);
  'decimals'?: (number);
  'name'?: (string);
  'description'?: (string);
  'reissuable'?: (boolean);
  'volume'?: (number | string | Long);
  'script_info'?: (_waves_events_StateUpdate_AssetDetails_AssetScriptInfo | null);
  'sponsorship'?: (number | string | Long);
  'nft'?: (boolean);
  'last_updated'?: (number);
  'safe_volume'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_StateUpdate_AssetDetails__Output {
  'asset_id': (Buffer);
  'issuer': (Buffer);
  'decimals': (number);
  'name': (string);
  'description': (string);
  'reissuable': (boolean);
  'volume': (string);
  'script_info': (_waves_events_StateUpdate_AssetDetails_AssetScriptInfo__Output | null);
  'sponsorship': (string);
  'nft': (boolean);
  'last_updated': (number);
  'safe_volume': (Buffer);
}

export interface _waves_events_StateUpdate_AssetInfo {
  'id'?: (Buffer | Uint8Array | string);
  'decimals'?: (number);
  'name'?: (string);
}

export interface _waves_events_StateUpdate_AssetInfo__Output {
  'id': (Buffer);
  'decimals': (number);
  'name': (string);
}

export interface _waves_events_StateUpdate_AssetDetails_AssetScriptInfo {
  'script'?: (Buffer | Uint8Array | string);
  'complexity'?: (number | string | Long);
}

export interface _waves_events_StateUpdate_AssetDetails_AssetScriptInfo__Output {
  'script': (Buffer);
  'complexity': (string);
}

export interface _waves_events_StateUpdate_AssetStateUpdate {
  'before'?: (_waves_events_StateUpdate_AssetDetails | null);
  'after'?: (_waves_events_StateUpdate_AssetDetails | null);
}

export interface _waves_events_StateUpdate_AssetStateUpdate__Output {
  'before': (_waves_events_StateUpdate_AssetDetails__Output | null);
  'after': (_waves_events_StateUpdate_AssetDetails__Output | null);
}

export interface _waves_events_StateUpdate_BalanceUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'amount_after'?: (_waves_Amount | null);
  'amount_before'?: (number | string | Long);
}

export interface _waves_events_StateUpdate_BalanceUpdate__Output {
  'address': (Buffer);
  'amount_after': (_waves_Amount__Output | null);
  'amount_before': (string);
}

export interface _waves_events_StateUpdate_DataEntryUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'data_entry'?: (_waves_DataTransactionData_DataEntry | null);
  'data_entry_before'?: (_waves_DataTransactionData_DataEntry | null);
}

export interface _waves_events_StateUpdate_DataEntryUpdate__Output {
  'address': (Buffer);
  'data_entry': (_waves_DataTransactionData_DataEntry__Output | null);
  'data_entry_before': (_waves_DataTransactionData_DataEntry__Output | null);
}

// Original file: proto/events.proto

export enum _waves_events_StateUpdate_LeaseUpdate_LeaseStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

export interface _waves_events_StateUpdate_LeaseUpdate {
  'lease_id'?: (Buffer | Uint8Array | string);
  'status_after'?: (_waves_events_StateUpdate_LeaseUpdate_LeaseStatus | keyof typeof _waves_events_StateUpdate_LeaseUpdate_LeaseStatus);
  'amount'?: (number | string | Long);
  'sender'?: (Buffer | Uint8Array | string);
  'recipient'?: (Buffer | Uint8Array | string);
  'origin_transaction_id'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_StateUpdate_LeaseUpdate__Output {
  'lease_id': (Buffer);
  'status_after': (keyof typeof _waves_events_StateUpdate_LeaseUpdate_LeaseStatus);
  'amount': (string);
  'sender': (Buffer);
  'recipient': (Buffer);
  'origin_transaction_id': (Buffer);
}

export interface _waves_events_StateUpdate_LeasingUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'in_after'?: (number | string | Long);
  'out_after'?: (number | string | Long);
  'in_before'?: (number | string | Long);
  'out_before'?: (number | string | Long);
}

export interface _waves_events_StateUpdate_LeasingUpdate__Output {
  'address': (Buffer);
  'in_after': (string);
  'out_after': (string);
  'in_before': (string);
  'out_before': (string);
}

export interface StateUpdate {
  'balances'?: (_waves_events_StateUpdate_BalanceUpdate)[];
  'leasing_for_address'?: (_waves_events_StateUpdate_LeasingUpdate)[];
  'data_entries'?: (_waves_events_StateUpdate_DataEntryUpdate)[];
  'assets'?: (_waves_events_StateUpdate_AssetStateUpdate)[];
  'individual_leases'?: (_waves_events_StateUpdate_LeaseUpdate)[];
}

export interface StateUpdate__Output {
  'balances': (_waves_events_StateUpdate_BalanceUpdate__Output)[];
  'leasing_for_address': (_waves_events_StateUpdate_LeasingUpdate__Output)[];
  'data_entries': (_waves_events_StateUpdate_DataEntryUpdate__Output)[];
  'assets': (_waves_events_StateUpdate_AssetStateUpdate__Output)[];
  'individual_leases': (_waves_events_StateUpdate_LeaseUpdate__Output)[];
}
