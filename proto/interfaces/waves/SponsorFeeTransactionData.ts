// Original file: proto/transaction.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';

export interface SponsorFeeTransactionData {
  'min_fee'?: (_waves_Amount | null);
}

export interface SponsorFeeTransactionData__Output {
  'min_fee': (_waves_Amount__Output | null);
}
