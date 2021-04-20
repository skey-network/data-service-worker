// Original file: proto/transaction.proto

import type { Order as _waves_Order, Order__Output as _waves_Order__Output } from '../waves/Order';
import type { Long } from '@grpc/proto-loader';

export interface ExchangeTransactionData {
  'amount'?: (number | string | Long);
  'price'?: (number | string | Long);
  'buy_matcher_fee'?: (number | string | Long);
  'sell_matcher_fee'?: (number | string | Long);
  'orders'?: (_waves_Order)[];
}

export interface ExchangeTransactionData__Output {
  'amount': (string);
  'price': (string);
  'buy_matcher_fee': (string);
  'sell_matcher_fee': (string);
  'orders': (_waves_Order__Output)[];
}
