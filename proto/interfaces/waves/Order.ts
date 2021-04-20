// Original file: proto/order.proto

import type { AssetPair as _waves_AssetPair, AssetPair__Output as _waves_AssetPair__Output } from '../waves/AssetPair';
import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/order.proto

export enum _waves_Order_Side {
  BUY = 0,
  SELL = 1,
}

export interface Order {
  'chain_id'?: (number);
  'sender_public_key'?: (Buffer | Uint8Array | string);
  'matcher_public_key'?: (Buffer | Uint8Array | string);
  'asset_pair'?: (_waves_AssetPair | null);
  'order_side'?: (_waves_Order_Side | keyof typeof _waves_Order_Side);
  'amount'?: (number | string | Long);
  'price'?: (number | string | Long);
  'timestamp'?: (number | string | Long);
  'expiration'?: (number | string | Long);
  'matcher_fee'?: (_waves_Amount | null);
  'version'?: (number);
  'proofs'?: (Buffer | Uint8Array | string)[];
}

export interface Order__Output {
  'chain_id': (number);
  'sender_public_key': (Buffer);
  'matcher_public_key': (Buffer);
  'asset_pair': (_waves_AssetPair__Output | null);
  'order_side': (keyof typeof _waves_Order_Side);
  'amount': (string);
  'price': (string);
  'timestamp': (string);
  'expiration': (string);
  'matcher_fee': (_waves_Amount__Output | null);
  'version': (number);
  'proofs': (Buffer)[];
}
