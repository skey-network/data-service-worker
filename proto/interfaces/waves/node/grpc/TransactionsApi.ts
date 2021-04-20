// Original file: proto/transactions_api.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { InvokeScriptResultResponse as _waves_node_grpc_InvokeScriptResultResponse, InvokeScriptResultResponse__Output as _waves_node_grpc_InvokeScriptResultResponse__Output } from '../../../waves/node/grpc/InvokeScriptResultResponse';
import type { SignRequest as _waves_node_grpc_SignRequest, SignRequest__Output as _waves_node_grpc_SignRequest__Output } from '../../../waves/node/grpc/SignRequest';
import type { SignedTransaction as _waves_SignedTransaction, SignedTransaction__Output as _waves_SignedTransaction__Output } from '../../../waves/SignedTransaction';
import type { TransactionResponse as _waves_node_grpc_TransactionResponse, TransactionResponse__Output as _waves_node_grpc_TransactionResponse__Output } from '../../../waves/node/grpc/TransactionResponse';
import type { TransactionStatus as _waves_node_grpc_TransactionStatus, TransactionStatus__Output as _waves_node_grpc_TransactionStatus__Output } from '../../../waves/node/grpc/TransactionStatus';
import type { TransactionsByIdRequest as _waves_node_grpc_TransactionsByIdRequest, TransactionsByIdRequest__Output as _waves_node_grpc_TransactionsByIdRequest__Output } from '../../../waves/node/grpc/TransactionsByIdRequest';
import type { TransactionsRequest as _waves_node_grpc_TransactionsRequest, TransactionsRequest__Output as _waves_node_grpc_TransactionsRequest__Output } from '../../../waves/node/grpc/TransactionsRequest';

export interface TransactionsApiClient extends grpc.Client {
  Broadcast(argument: _waves_SignedTransaction, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Broadcast(argument: _waves_SignedTransaction, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Broadcast(argument: _waves_SignedTransaction, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Broadcast(argument: _waves_SignedTransaction, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  broadcast(argument: _waves_SignedTransaction, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  broadcast(argument: _waves_SignedTransaction, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  broadcast(argument: _waves_SignedTransaction, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  broadcast(argument: _waves_SignedTransaction, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  
  GetStateChanges(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_InvokeScriptResultResponse__Output>;
  GetStateChanges(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_InvokeScriptResultResponse__Output>;
  getStateChanges(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_InvokeScriptResultResponse__Output>;
  getStateChanges(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_InvokeScriptResultResponse__Output>;
  
  GetStatuses(argument: _waves_node_grpc_TransactionsByIdRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionStatus__Output>;
  GetStatuses(argument: _waves_node_grpc_TransactionsByIdRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionStatus__Output>;
  getStatuses(argument: _waves_node_grpc_TransactionsByIdRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionStatus__Output>;
  getStatuses(argument: _waves_node_grpc_TransactionsByIdRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionStatus__Output>;
  
  GetTransactions(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  GetTransactions(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  getTransactions(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  getTransactions(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  
  GetUnconfirmed(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  GetUnconfirmed(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  getUnconfirmed(argument: _waves_node_grpc_TransactionsRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  getUnconfirmed(argument: _waves_node_grpc_TransactionsRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_waves_node_grpc_TransactionResponse__Output>;
  
  Sign(argument: _waves_node_grpc_SignRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Sign(argument: _waves_node_grpc_SignRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Sign(argument: _waves_node_grpc_SignRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  Sign(argument: _waves_node_grpc_SignRequest, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  sign(argument: _waves_node_grpc_SignRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  sign(argument: _waves_node_grpc_SignRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  sign(argument: _waves_node_grpc_SignRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  sign(argument: _waves_node_grpc_SignRequest, callback: (error?: grpc.ServiceError, result?: _waves_SignedTransaction__Output) => void): grpc.ClientUnaryCall;
  
}

export interface TransactionsApiHandlers extends grpc.UntypedServiceImplementation {
  Broadcast: grpc.handleUnaryCall<_waves_SignedTransaction__Output, _waves_SignedTransaction>;
  
  GetStateChanges: grpc.handleServerStreamingCall<_waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_InvokeScriptResultResponse>;
  
  GetStatuses: grpc.handleServerStreamingCall<_waves_node_grpc_TransactionsByIdRequest__Output, _waves_node_grpc_TransactionStatus>;
  
  GetTransactions: grpc.handleServerStreamingCall<_waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_TransactionResponse>;
  
  GetUnconfirmed: grpc.handleServerStreamingCall<_waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_TransactionResponse>;
  
  Sign: grpc.handleUnaryCall<_waves_node_grpc_SignRequest__Output, _waves_SignedTransaction>;
  
}

export interface TransactionsApiDefinition {
  Broadcast: MethodDefinition<_waves_SignedTransaction, _waves_SignedTransaction, _waves_SignedTransaction__Output, _waves_SignedTransaction__Output>
  GetStateChanges: MethodDefinition<_waves_node_grpc_TransactionsRequest, _waves_node_grpc_InvokeScriptResultResponse, _waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_InvokeScriptResultResponse__Output>
  GetStatuses: MethodDefinition<_waves_node_grpc_TransactionsByIdRequest, _waves_node_grpc_TransactionStatus, _waves_node_grpc_TransactionsByIdRequest__Output, _waves_node_grpc_TransactionStatus__Output>
  GetTransactions: MethodDefinition<_waves_node_grpc_TransactionsRequest, _waves_node_grpc_TransactionResponse, _waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_TransactionResponse__Output>
  GetUnconfirmed: MethodDefinition<_waves_node_grpc_TransactionsRequest, _waves_node_grpc_TransactionResponse, _waves_node_grpc_TransactionsRequest__Output, _waves_node_grpc_TransactionResponse__Output>
  Sign: MethodDefinition<_waves_node_grpc_SignRequest, _waves_SignedTransaction, _waves_node_grpc_SignRequest__Output, _waves_SignedTransaction__Output>
}
