// Original file: proto/events.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../../waves/Amount';
import type { _waves_DataTransactionData_DataEntry, _waves_DataTransactionData_DataEntry__Output } from '../../waves/DataTransactionData';
import type { Long } from '@grpc/proto-loader';

export interface _waves_events_StateUpdate_AssetStateUpdate_AssetScriptInfo {
  'script'?: (Buffer | Uint8Array | string);
  'complexity'?: (number | string | Long);
}

export interface _waves_events_StateUpdate_AssetStateUpdate_AssetScriptInfo__Output {
  'script': (Buffer);
  'complexity': (string);
}

export interface _waves_events_StateUpdate_AssetStateUpdate {
  'asset_id'?: (Buffer | Uint8Array | string);
  'decimals'?: (number);
  'name'?: (string);
  'description'?: (string);
  'reissuable'?: (boolean);
  'volume'?: (number | string | Long);
  'script_info'?: (_waves_events_StateUpdate_AssetStateUpdate_AssetScriptInfo | null);
  'sponsorship'?: (number | string | Long);
  'nft'?: (boolean);
  'asset_existed_before'?: (boolean);
  'safe_volume'?: (Buffer | Uint8Array | string);
}

export interface _waves_events_StateUpdate_AssetStateUpdate__Output {
  'asset_id': (Buffer);
  'decimals': (number);
  'name': (string);
  'description': (string);
  'reissuable': (boolean);
  'volume': (string);
  'script_info': (_waves_events_StateUpdate_AssetStateUpdate_AssetScriptInfo__Output | null);
  'sponsorship': (string);
  'nft': (boolean);
  'asset_existed_before': (boolean);
  'safe_volume': (Buffer);
}

export interface _waves_events_StateUpdate_BalanceUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'amount'?: (_waves_Amount | null);
}

export interface _waves_events_StateUpdate_BalanceUpdate__Output {
  'address': (Buffer);
  'amount': (_waves_Amount__Output | null);
}

export interface _waves_events_StateUpdate_DataEntryUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'data_entry'?: (_waves_DataTransactionData_DataEntry | null);
}

export interface _waves_events_StateUpdate_DataEntryUpdate__Output {
  'address': (Buffer);
  'data_entry': (_waves_DataTransactionData_DataEntry__Output | null);
}

export interface _waves_events_StateUpdate_LeasingUpdate {
  'address'?: (Buffer | Uint8Array | string);
  'in'?: (number | string | Long);
  'out'?: (number | string | Long);
}

export interface _waves_events_StateUpdate_LeasingUpdate__Output {
  'address': (Buffer);
  'in': (string);
  'out': (string);
}

export interface StateUpdate {
  'balances'?: (_waves_events_StateUpdate_BalanceUpdate)[];
  'leases'?: (_waves_events_StateUpdate_LeasingUpdate)[];
  'data_entries'?: (_waves_events_StateUpdate_DataEntryUpdate)[];
  'assets'?: (_waves_events_StateUpdate_AssetStateUpdate)[];
}

export interface StateUpdate__Output {
  'balances': (_waves_events_StateUpdate_BalanceUpdate__Output)[];
  'leases': (_waves_events_StateUpdate_LeasingUpdate__Output)[];
  'data_entries': (_waves_events_StateUpdate_DataEntryUpdate__Output)[];
  'assets': (_waves_events_StateUpdate_AssetStateUpdate__Output)[];
}
