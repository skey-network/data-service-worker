// Original file: proto/blocks_api.proto


export interface BlockRangeRequest {
  'from_height'?: (number);
  'to_height'?: (number);
  'generator_public_key'?: (Buffer | Uint8Array | string);
  'generator_address'?: (Buffer | Uint8Array | string);
  'include_transactions'?: (boolean);
  'filter'?: "generator_public_key"|"generator_address";
}

export interface BlockRangeRequest__Output {
  'from_height': (number);
  'to_height': (number);
  'generator_public_key'?: (Buffer);
  'generator_address'?: (Buffer);
  'include_transactions': (boolean);
  'filter': "generator_public_key"|"generator_address";
}
