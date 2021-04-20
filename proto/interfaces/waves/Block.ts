// Original file: proto/block.proto

import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../waves/SignedTransaction';
import type { Long } from '@grpc/proto-loader';

export interface _waves_Block_Header {
  'chain_id'?: (number);
  'reference'?: (Buffer | Uint8Array | string);
  'base_target'?: (number | string | Long);
  'generation_signature'?: (Buffer | Uint8Array | string);
  'feature_votes'?: (number)[];
  'timestamp'?: (number | string | Long);
  'version'?: (number);
  'generator'?: (Buffer | Uint8Array | string);
  'reward_vote'?: (number | string | Long);
  'transactions_root'?: (Buffer | Uint8Array | string);
}

export interface _waves_Block_Header__Output {
  'chain_id': (number);
  'reference': (Buffer);
  'base_target': (string);
  'generation_signature': (Buffer);
  'feature_votes': (number)[];
  'timestamp': (string);
  'version': (number);
  'generator': (Buffer);
  'reward_vote': (string);
  'transactions_root': (Buffer);
}

export interface Block {
  'header'?: (_waves_Block_Header | null);
  'signature'?: (Buffer | Uint8Array | string);
  'transactions'?: (_waves_SignedTransaction)[];
}

export interface Block__Output {
  'header': (_waves_Block_Header__Output | null);
  'signature': (Buffer);
  'transactions': (_waves_SignedTransaction__Output)[];
}
