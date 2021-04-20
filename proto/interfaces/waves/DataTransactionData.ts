// Original file: proto/transaction.proto

import type { Long } from '@grpc/proto-loader';

export interface _waves_DataTransactionData_DataEntry {
  'key'?: (string);
  'int_value'?: (number | string | Long);
  'bool_value'?: (boolean);
  'binary_value'?: (Buffer | Uint8Array | string);
  'string_value'?: (string);
  'value'?: "int_value"|"bool_value"|"binary_value"|"string_value";
}

export interface _waves_DataTransactionData_DataEntry__Output {
  'key': (string);
  'int_value'?: (string);
  'bool_value'?: (boolean);
  'binary_value'?: (Buffer);
  'string_value'?: (string);
  'value': "int_value"|"bool_value"|"binary_value"|"string_value";
}

export interface DataTransactionData {
  'data'?: (_waves_DataTransactionData_DataEntry)[];
}

export interface DataTransactionData__Output {
  'data': (_waves_DataTransactionData_DataEntry__Output)[];
}
