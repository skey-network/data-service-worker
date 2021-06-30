import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { BlockchainUpdatesApiClient as _waves_events_grpc_BlockchainUpdatesApiClient, BlockchainUpdatesApiDefinition as _waves_events_grpc_BlockchainUpdatesApiDefinition } from './waves/events/grpc/BlockchainUpdatesApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  waves: {
    Amount: MessageTypeDefinition
    AssetPair: MessageTypeDefinition
    Block: MessageTypeDefinition
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
    events: {
      BlockchainUpdated: MessageTypeDefinition
      StateUpdate: MessageTypeDefinition
      TransactionMetadata: MessageTypeDefinition
      grpc: {
        BlockchainUpdatesApi: SubtypeConstructor<typeof grpc.Client, _waves_events_grpc_BlockchainUpdatesApiClient> & { service: _waves_events_grpc_BlockchainUpdatesApiDefinition }
        GetBlockUpdateRequest: MessageTypeDefinition
        GetBlockUpdateResponse: MessageTypeDefinition
        GetBlockUpdatesRangeRequest: MessageTypeDefinition
        GetBlockUpdatesRangeResponse: MessageTypeDefinition
        SubscribeEvent: MessageTypeDefinition
        SubscribeRequest: MessageTypeDefinition
      }
    }
  }
}

