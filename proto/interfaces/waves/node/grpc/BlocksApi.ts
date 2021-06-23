// Original file: proto/blocks_api.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BlockRangeRequest as _waves_node_grpc_BlockRangeRequest, BlockRangeRequest__Output as _waves_node_grpc_BlockRangeRequest__Output } from '../../../waves/node/grpc/BlockRangeRequest';
import type { BlockRequest as _waves_node_grpc_BlockRequest, BlockRequest__Output as _waves_node_grpc_BlockRequest__Output } from '../../../waves/node/grpc/BlockRequest';
import type { BlockWithHeight as _waves_node_grpc_BlockWithHeight, BlockWithHeight__Output as _waves_node_grpc_BlockWithHeight__Output } from '../../../waves/node/grpc/BlockWithHeight';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';

export interface BlocksApiClient extends grpc.Client {
  GetBlock(argument: _waves_node_grpc_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  GetBlock(argument: _waves_node_grpc_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  GetBlock(argument: _waves_node_grpc_BlockRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  GetBlock(argument: _waves_node_grpc_BlockRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  getBlock(argument: _waves_node_grpc_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  getBlock(argument: _waves_node_grpc_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  getBlock(argument: _waves_node_grpc_BlockRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  getBlock(argument: _waves_node_grpc_BlockRequest, callback: (error?: grpc.ServiceError, result?: _waves_node_grpc_BlockWithHeight__Output) => void): grpc.ClientUnaryCall;
  
  GetBlockRange(argument: _waves_node_grpc_BlockRangeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_BlockWithHeight__Output>;
  GetBlockRange(argument: _waves_node_grpc_BlockRangeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_BlockWithHeight__Output>;
  getBlockRange(argument: _waves_node_grpc_BlockRangeRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_BlockWithHeight__Output>;
  getBlockRange(argument: _waves_node_grpc_BlockRangeRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_BlockWithHeight__Output>;
  
  GetCurrentHeight(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  GetCurrentHeight(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  GetCurrentHeight(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  GetCurrentHeight(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  getCurrentHeight(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  getCurrentHeight(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  getCurrentHeight(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  getCurrentHeight(argument: _google_protobuf_Empty, callback: (error?: grpc.ServiceError, result?: _google_protobuf_UInt32Value__Output) => void): grpc.ClientUnaryCall;
  
}

export interface BlocksApiHandlers extends grpc.UntypedServiceImplementation {
  GetBlock: grpc.handleUnaryCall<_waves_node_grpc_BlockRequest__Output, _waves_node_grpc_BlockWithHeight>;
  
  GetBlockRange: grpc.handleServerStreamingCall<_waves_node_grpc_BlockRangeRequest__Output, _waves_node_grpc_BlockWithHeight>;
  
  GetCurrentHeight: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _google_protobuf_UInt32Value>;
  
}

export interface BlocksApiDefinition extends grpc.ServiceDefinition {
  GetBlock: MethodDefinition<_waves_node_grpc_BlockRequest, _waves_node_grpc_BlockWithHeight, _waves_node_grpc_BlockRequest__Output, _waves_node_grpc_BlockWithHeight__Output>
  GetBlockRange: MethodDefinition<_waves_node_grpc_BlockRangeRequest, _waves_node_grpc_BlockWithHeight, _waves_node_grpc_BlockRangeRequest__Output, _waves_node_grpc_BlockWithHeight__Output>
  GetCurrentHeight: MethodDefinition<_google_protobuf_Empty, _google_protobuf_UInt32Value, _google_protobuf_Empty__Output, _google_protobuf_UInt32Value__Output>
}
