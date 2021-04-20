import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BlocksApiClient as _waves_node_grpc_BlocksApiClient, BlocksApiDefinition as _waves_node_grpc_BlocksApiDefinition } from './waves/node/grpc/BlocksApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      Empty: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
    }
  }
  waves: {
    Amount: MessageTypeDefinition
    AssetPair: MessageTypeDefinition
    Block: MessageTypeDefinition
    BurnTransactionData: MessageTypeDefinition
    CreateAliasTransactionData: MessageTypeDefinition
    DataTransactionData: MessageTypeDefinition
    ExchangeTransactionData: MessageTypeDefinition
    GenesisTransactionData: MessageTypeDefinition
    InvokeScriptTransactionData: MessageTypeDefinition
    IssueTransactionData: MessageTypeDefinition
    LeaseCancelTransactionData: MessageTypeDefinition
    LeaseTransactionData: MessageTypeDefinition
    MassTransferTransactionData: MessageTypeDefinition
    MicroBlock: MessageTypeDefinition
    Order: MessageTypeDefinition
    PaymentTransactionData: MessageTypeDefinition
    Recipient: MessageTypeDefinition
    ReissueTransactionData: MessageTypeDefinition
    SetAssetScriptTransactionData: MessageTypeDefinition
    SetScriptTransactionData: MessageTypeDefinition
    SignedMicroBlock: MessageTypeDefinition
    SignedTransaction: MessageTypeDefinition
    SponsorFeeTransactionData: MessageTypeDefinition
    Transaction: MessageTypeDefinition
    TransferTransactionData: MessageTypeDefinition
    UpdateAssetInfoTransactionData: MessageTypeDefinition
    node: {
      grpc: {
        BlockRangeRequest: MessageTypeDefinition
        BlockRequest: MessageTypeDefinition
        BlockWithHeight: MessageTypeDefinition
        BlocksApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_BlocksApiClient> & { service: _waves_node_grpc_BlocksApiDefinition }
      }
    }
  }
}

