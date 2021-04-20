// Original file: proto/blocks_api.proto

import type { Block as _waves_Block, Block__Output as _waves_Block__Output } from '../../../waves/Block';

export interface BlockWithHeight {
  'block'?: (_waves_Block | null);
  'height'?: (number);
}

export interface BlockWithHeight__Output {
  'block': (_waves_Block__Output | null);
  'height': (number);
}
