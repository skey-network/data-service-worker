// Original file: proto/transaction.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../waves/Recipient';
import type { Long } from '@grpc/proto-loader';

export interface _waves_MassTransferTransactionData_Transfer {
  'recipient'?: (_waves_Recipient | null);
  'amount'?: (number | string | Long);
}

export interface _waves_MassTransferTransactionData_Transfer__Output {
  'recipient': (_waves_Recipient__Output | null);
  'amount': (string);
}

export interface MassTransferTransactionData {
  'asset_id'?: (Buffer | Uint8Array | string);
  'transfers'?: (_waves_MassTransferTransactionData_Transfer)[];
  'attachment'?: (Buffer | Uint8Array | string);
}

export interface MassTransferTransactionData__Output {
  'asset_id': (Buffer);
  'transfers': (_waves_MassTransferTransactionData_Transfer__Output)[];
  'attachment': (Buffer);
}
