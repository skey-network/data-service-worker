// Original file: proto/accounts_api.proto

import type { Long } from '@grpc/proto-loader';

export interface ScriptData {
  'script_bytes'?: (Buffer | Uint8Array | string);
  'script_text'?: (string);
  'complexity'?: (number | string | Long);
}

export interface ScriptData__Output {
  'script_bytes': (Buffer);
  'script_text': (string);
  'complexity': (string);
}
