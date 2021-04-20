// Original file: proto/assets_api.proto


export interface NFTRequest {
  'address'?: (Buffer | Uint8Array | string);
  'limit'?: (number);
  'after_asset_id'?: (Buffer | Uint8Array | string);
}

export interface NFTRequest__Output {
  'address': (Buffer);
  'limit': (number);
  'after_asset_id': (Buffer);
}
