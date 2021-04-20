// Original file: proto/recipient.proto


export interface Recipient {
  'public_key_hash'?: (Buffer | Uint8Array | string);
  'alias'?: (string);
  'recipient'?: "public_key_hash"|"alias";
}

export interface Recipient__Output {
  'public_key_hash'?: (Buffer);
  'alias'?: (string);
  'recipient': "public_key_hash"|"alias";
}
