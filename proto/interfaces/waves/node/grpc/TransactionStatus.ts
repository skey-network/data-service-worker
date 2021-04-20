// Original file: proto/transactions_api.proto

import type { ApplicationStatus as _waves_node_grpc_ApplicationStatus } from '../../../waves/node/grpc/ApplicationStatus';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/transactions_api.proto

export enum _waves_node_grpc_TransactionStatus_Status {
  NOT_EXISTS = 0,
  UNCONFIRMED = 1,
  CONFIRMED = 2,
}

export interface TransactionStatus {
  'id'?: (Buffer | Uint8Array | string);
  'status'?: (_waves_node_grpc_TransactionStatus_Status | keyof typeof _waves_node_grpc_TransactionStatus_Status);
  'height'?: (number | string | Long);
  'application_status'?: (_waves_node_grpc_ApplicationStatus | keyof typeof _waves_node_grpc_ApplicationStatus);
}

export interface TransactionStatus__Output {
  'id': (Buffer);
  'status': (keyof typeof _waves_node_grpc_TransactionStatus_Status);
  'height': (string);
  'application_status': (keyof typeof _waves_node_grpc_ApplicationStatus);
}
