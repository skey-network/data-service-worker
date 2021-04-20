// Original file: proto/blocks_api.proto


export interface BlockRequest {
  'block_id'?: (Buffer | Uint8Array | string);
  'height'?: (number);
  'include_transactions'?: (boolean);
  'request'?: "block_id"|"height";
}

export interface BlockRequest__Output {
  'block_id'?: (Buffer);
  'height'?: (number);
  'include_transactions': (boolean);
  'request': "block_id"|"height";
}
