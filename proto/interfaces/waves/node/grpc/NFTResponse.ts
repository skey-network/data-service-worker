// Original file: proto/assets_api.proto

import type { AssetInfoResponse as _waves_node_grpc_AssetInfoResponse, AssetInfoResponse__Output as _waves_node_grpc_AssetInfoResponse__Output } from '../../../waves/node/grpc/AssetInfoResponse';

export interface NFTResponse {
  'asset_id'?: (Buffer | Uint8Array | string);
  'asset_info'?: (_waves_node_grpc_AssetInfoResponse | null);
}

export interface NFTResponse__Output {
  'asset_id': (Buffer);
  'asset_info': (_waves_node_grpc_AssetInfoResponse__Output | null);
}
