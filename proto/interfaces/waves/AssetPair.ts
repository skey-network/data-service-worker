// Original file: proto/order.proto


export interface AssetPair {
  'amount_asset_id'?: (Buffer | Uint8Array | string);
  'price_asset_id'?: (Buffer | Uint8Array | string);
}

export interface AssetPair__Output {
  'amount_asset_id': (Buffer);
  'price_asset_id': (Buffer);
}
