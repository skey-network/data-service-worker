import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { TransactionsApiClient as _waves_node_grpc_TransactionsApiClient, TransactionsApiDefinition as _waves_node_grpc_TransactionsApiDefinition } from './waves/node/grpc/TransactionsApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  waves: {
    Amount: MessageTypeDefinition
    AssetPair: MessageTypeDefinition
    BurnTransactionData: MessageTypeDefinition
    CreateAliasTransactionData: MessageTypeDefinition
    DataTransactionData: MessageTypeDefinition
    ExchangeTransactionData: MessageTypeDefinition
    GenesisTransactionData: MessageTypeDefinition
    InvokeScriptResult: MessageTypeDefinition
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
        ApplicationStatus: EnumTypeDefinition
        CalculateFeeResponse: MessageTypeDefinition
        InvokeScriptResultResponse: MessageTypeDefinition
        SignRequest: MessageTypeDefinition
        TransactionResponse: MessageTypeDefinition
        TransactionStatus: MessageTypeDefinition
        TransactionsApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_TransactionsApiClient> & { service: _waves_node_grpc_TransactionsApiDefinition }
        TransactionsByIdRequest: MessageTypeDefinition
        TransactionsRequest: MessageTypeDefinition
      }
    }
  }
}

