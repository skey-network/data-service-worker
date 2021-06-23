// Original file: proto/blockchain_api.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ActivationStatusRequest as _waves_node_grpc_ActivationStatusRequest, ActivationStatusRequest__Output as _waves_node_grpc_ActivationStatusRequest__Output } from '../../../waves/node/grpc/ActivationStatusRequest';
import type { ActivationStatusResponse as _waves_node_grpc_ActivationStatusResponse, ActivationStatusResponse__Output as _waves_node_grpc_ActivationStatusResponse__Output } from '../../../waves/node/grpc/ActivationStatusResponse';
import type { BaseTargetResponse as _waves_node_grpc_BaseTargetResponse, BaseTargetResponse__Output as _waves_node_grpc_BaseTargetResponse__Output } from '../../../waves/node/grpc/BaseTargetResponse';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { ScoreResponse as _waves_node_grpc_ScoreResponse, ScoreResponse__Output as _waves_node_grpc_ScoreResponse__Output } from '../../../waves/node/grpc/ScoreResponse';

export interface BlockchainApiClient extends grpc.Client {
  GetActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  GetActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  GetActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  GetActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  getActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  getActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  getActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  getActivationStatus(argument: _waves_node_grpc_ActivationStatusRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ActivationStatusResponse__Output) => void): grpc.ClientUnaryCall;
  
  GetBaseTarget(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  GetBaseTarget(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  GetBaseTarget(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  GetBaseTarget(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  getBaseTarget(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  getBaseTarget(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  getBaseTarget(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  getBaseTarget(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BaseTargetResponse__Output) => void): grpc.ClientUnaryCall;
  
  GetCumulativeScore(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  GetCumulativeScore(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  GetCumulativeScore(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  GetCumulativeScore(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  getCumulativeScore(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  getCumulativeScore(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  getCumulativeScore(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  getCumulativeScore(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_ScoreResponse__Output) => void): grpc.ClientUnaryCall;
  
}

export interface BlockchainApiHandlers extends grpc.UntypedServiceImplementation {
  GetActivationStatus: grpc.handleUnaryCall<_waves_node_grpc_ActivationStatusRequest__Output, _waves_node_grpc_ActivationStatusResponse>;
  
  GetBaseTarget: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _waves_node_grpc_BaseTargetResponse>;
  
  GetCumulativeScore: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _waves_node_grpc_ScoreResponse>;
  
}

export interface BlockchainApiDefinition extends grpc.ServiceDefinition {
  GetActivationStatus: MethodDefinition<_waves_node_grpc_ActivationStatusRequest, _waves_node_grpc_ActivationStatusResponse, _waves_node_grpc_ActivationStatusRequest__Output, _waves_node_grpc_ActivationStatusResponse__Output>
  GetBaseTarget: MethodDefinition<_google_protobuf_Empty, _waves_node_grpc_BaseTargetResponse, _google_protobuf_Empty__Output, _waves_node_grpc_BaseTargetResponse__Output>
  GetCumulativeScore: MethodDefinition<_google_protobuf_Empty, _waves_node_grpc_ScoreResponse, _google_protobuf_Empty__Output, _waves_node_grpc_ScoreResponse__Output>
}
