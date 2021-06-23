// Original file: proto/accounts_api.proto

import type { Recipient as _waves_Recipient, Recipient__Output as _waves_Recipient__Output } from '../../../waves/Recipient';
import type { Long } from '@grpc/proto-loader';

export interface LeaseResponse {
  'leaseId'?: (Buffer | Uint8Array | string);
  'originTransactionId'?: (Buffer | Uint8Array | string);
  'sender'?: (Buffer | Uint8Array | string);
  'recipient'?: (_waves_Recipient | null);
  'amount'?: (number | string | Long);
  'height'?: (number | string | Long);
}

export interface LeaseResponse__Output {
  'leaseId': (Buffer);
  'originTransactionId': (Buffer);
  'sender': (Buffer);
  'recipient': (_waves_Recipient__Output | null);
  'amount': (string);
  'height': (string);
}
