// Original file: proto/transactions_api.proto


export interface TransactionsByIdRequest {
  'transaction_ids'?: (Buffer | Uint8Array | string)[];
}

export interface TransactionsByIdRequest__Output {
  'transaction_ids': (Buffer)[];
}
