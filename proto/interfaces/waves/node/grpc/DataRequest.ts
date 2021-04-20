// Original file: proto/accounts_api.proto


export interface DataRequest {
  'address'?: (Buffer | Uint8Array | string);
  'key'?: (string);
}

export interface DataRequest__Output {
  'address': (Buffer);
  'key': (string);
}
