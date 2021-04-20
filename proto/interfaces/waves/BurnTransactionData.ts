// Original file: proto/transaction.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface BurnTransactionData {
  'asset_amount'?: (_waves_Amount | null);
}

export interface BurnTransactionData__Output {
  'asset_amount': (_waves_Amount__Output | null);
}
