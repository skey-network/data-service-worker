// Original file: proto/block.proto

import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../waves/SignedTransaction';

export interface MicroBlock {
  'version'?: (number);
  'reference'?: (Buffer | Uint8Array | string);
  'updated_block_signature'?: (Buffer | Uint8Array | string);
  'sender_public_key'?: (Buffer | Uint8Array | string);
  'transactions'?: (_waves_SignedTransaction)[];
}

export interface MicroBlock__Output {
  'version': (number);
  'reference': (Buffer);
  'updated_block_signature': (Buffer);
  'sender_public_key': (Buffer);
  'transactions': (_waves_SignedTransaction__Output)[];
}
