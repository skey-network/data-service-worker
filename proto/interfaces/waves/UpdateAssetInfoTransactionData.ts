// Original file: proto/transaction.proto


export interface UpdateAssetInfoTransactionData {
  'asset_id'?: (Buffer | Uint8Array | string);
  'name'?: (string);
  'description'?: (string);
}

export interface UpdateAssetInfoTransactionData__Output {
  'asset_id': (Buffer);
  'name': (string);
  'description': (string);
}
