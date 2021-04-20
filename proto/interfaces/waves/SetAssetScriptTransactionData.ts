// Original file: proto/transaction.proto


export interface SetAssetScriptTransactionData {
  'asset_id'?: (Buffer | Uint8Array | string);
  'script'?: (Buffer | Uint8Array | string);
}

export interface SetAssetScriptTransactionData__Output {
  'asset_id': (Buffer);
  'script': (Buffer);
}
