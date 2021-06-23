import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AccountsApiClient as _waves_node_grpc_AccountsApiClient, AccountsApiDefinition as _waves_node_grpc_AccountsApiDefinition } from './waves/node/grpc/AccountsApi';
import type { AssetsApiClient as _waves_node_grpc_AssetsApiClient, AssetsApiDefinition as _waves_node_grpc_AssetsApiDefinition } from './waves/node/grpc/AssetsApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
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
    Order: MessageTypeDefinition
    PaymentTransactionData: MessageTypeDefinition
    Recipient: MessageTypeDefinition
    ReissueTransactionData: MessageTypeDefinition
    SetAssetScriptTransactionData: MessageTypeDefinition
    SetScriptTransactionData: MessageTypeDefinition
    SignedTransaction: MessageTypeDefinition
    SponsorFeeTransactionData: MessageTypeDefinition
    Transaction: MessageTypeDefinition
    TransferTransactionData: MessageTypeDefinition
    UpdateAssetInfoTransactionData: MessageTypeDefinition
    node: {
      grpc: {
        AccountRequest: MessageTypeDefinition
        AccountsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_AccountsApiClient> & { service: _waves_node_grpc_AccountsApiDefinition }
        AssetInfoResponse: MessageTypeDefinition
        AssetRequest: MessageTypeDefinition
        AssetsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_AssetsApiClient> & { service: _waves_node_grpc_AssetsApiDefinition }
        BalanceResponse: MessageTypeDefinition
        BalancesRequest: MessageTypeDefinition
        DataEntryResponse: MessageTypeDefinition
        DataRequest: MessageTypeDefinition
        LeaseResponse: MessageTypeDefinition
        NFTRequest: MessageTypeDefinition
        NFTResponse: MessageTypeDefinition
        ScriptData: MessageTypeDefinition
      }
    }
  }
}

