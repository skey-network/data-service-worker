// Original file: proto/transaction.proto

import type { Long } from '@grpc/proto-loader';

export interface IssueTransactionData {
  'name'?: (string);
  'description'?: (string);
  'amount'?: (number | string | Long);
  'decimals'?: (number);
  'reissuable'?: (boolean);
  'script'?: (Buffer | Uint8Array | string);
}

export interface IssueTransactionData__Output {
  'name': (string);
  'description': (string);
  'amount': (string);
  'decimals': (number);
  'reissuable': (boolean);
  'script': (Buffer);
}
