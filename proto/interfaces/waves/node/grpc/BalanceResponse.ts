// Original file: proto/accounts_api.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../../../waves/Amount';
import type { Long } from '@grpc/proto-loader';

export interface _waves_node_grpc_BalanceResponse_WavesBalances {
  'regular'?: (number | string | Long);
  'generating'?: (number | string | Long);
  'available'?: (number | string | Long);
  'effective'?: (number | string | Long);
  'lease_in'?: (number | string | Long);
  'lease_out'?: (number | string | Long);
}

export interface _waves_node_grpc_BalanceResponse_WavesBalances__Output {
  'regular': (string);
  'generating': (string);
  'available': (string);
  'effective': (string);
  'lease_in': (string);
  'lease_out': (string);
}

export interface BalanceResponse {
  'waves'?: (_waves_node_grpc_BalanceResponse_WavesBalances | null);
  'asset'?: (_waves_Amount | null);
  'balance'?: "waves"|"asset";
}

export interface BalanceResponse__Output {
  'waves'?: (_waves_node_grpc_BalanceResponse_WavesBalances__Output | null);
  'asset'?: (_waves_Amount__Output | null);
  'balance': "waves"|"asset";
}
