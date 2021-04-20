import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BlockchainApiClient as _waves_node_grpc_BlockchainApiClient, BlockchainApiDefinition as _waves_node_grpc_BlockchainApiDefinition } from './waves/node/grpc/BlockchainApi';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      Empty: MessageTypeDefinition
    }
  }
  waves: {
    node: {
      grpc: {
        ActivationStatusRequest: MessageTypeDefinition
        ActivationStatusResponse: MessageTypeDefinition
        BaseTargetResponse: MessageTypeDefinition
        BlockchainApi: SubtypeConstructor<typeof grpc.Client, _waves_node_grpc_BlockchainApiClient> & { service: _waves_node_grpc_BlockchainApiDefinition }
        FeatureActivationStatus: MessageTypeDefinition
        ScoreResponse: MessageTypeDefinition
      }
    }
  }
}

