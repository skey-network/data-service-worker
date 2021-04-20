// Original file: proto/blockchain_api.proto


// Original file: proto/blockchain_api.proto

export enum _waves_node_grpc_FeatureActivationStatus_BlockchainFeatureStatus {
  UNDEFINED = 0,
  APPROVED = 1,
  ACTIVATED = 2,
}

// Original file: proto/blockchain_api.proto

export enum _waves_node_grpc_FeatureActivationStatus_NodeFeatureStatus {
  NOT_IMPLEMENTED = 0,
  IMPLEMENTED = 1,
  VOTED = 2,
}

export interface FeatureActivationStatus {
  'id'?: (number);
  'description'?: (string);
  'blockchain_status'?: (_waves_node_grpc_FeatureActivationStatus_BlockchainFeatureStatus | keyof typeof _waves_node_grpc_FeatureActivationStatus_BlockchainFeatureStatus);
  'node_status'?: (_waves_node_grpc_FeatureActivationStatus_NodeFeatureStatus | keyof typeof _waves_node_grpc_FeatureActivationStatus_NodeFeatureStatus);
  'activation_height'?: (number);
  'supporting_blocks'?: (number);
}

export interface FeatureActivationStatus__Output {
  'id': (number);
  'description': (string);
  'blockchain_status': (keyof typeof _waves_node_grpc_FeatureActivationStatus_BlockchainFeatureStatus);
  'node_status': (keyof typeof _waves_node_grpc_FeatureActivationStatus_NodeFeatureStatus);
  'activation_height': (number);
  'supporting_blocks': (number);
}
