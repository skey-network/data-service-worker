// Original file: proto/transaction.proto

import type { Amount as _waves_Amount, Amount__Output as _waves_Amount__Output } from '../waves/Amount';
import type { GenesisTransactionData as _waves_GenesisTransactionData, GenesisTransactionData__Output as _waves_GenesisTransactionData__Output } from '../waves/GenesisTransactionData';
import type { PaymentTransactionData as _waves_PaymentTransactionData, PaymentTransactionData__Output as _waves_PaymentTransactionData__Output } from '../waves/PaymentTransactionData';
import type { IssueTransactionData as _waves_IssueTransactionData, IssueTransactionData__Output as _waves_IssueTransactionData__Output } from '../waves/IssueTransactionData';
import type { TransferTransactionData as _waves_TransferTransactionData, TransferTransactionData__Output as _waves_TransferTransactionData__Output } from '../waves/TransferTransactionData';
import type { ReissueTransactionData as _waves_ReissueTransactionData, ReissueTransactionData__Output as _waves_ReissueTransactionData__Output } from '../waves/ReissueTransactionData';
import type { BurnTransactionData as _waves_BurnTransactionData, BurnTransactionData__Output as _waves_BurnTransactionData__Output } from '../waves/BurnTransactionData';
import type { ExchangeTransactionData as _waves_ExchangeTransactionData, ExchangeTransactionData__Output as _waves_ExchangeTransactionData__Output } from '../waves/ExchangeTransactionData';
import type { LeaseTransactionData as _waves_LeaseTransactionData, LeaseTransactionData__Output as _waves_LeaseTransactionData__Output } from '../waves/LeaseTransactionData';
import type { LeaseCancelTransactionData as _waves_LeaseCancelTransactionData, LeaseCancelTransactionData__Output as _waves_LeaseCancelTransactionData__Output } from '../waves/LeaseCancelTransactionData';
import type { CreateAliasTransactionData as _waves_CreateAliasTransactionData, CreateAliasTransactionData__Output as _waves_CreateAliasTransactionData__Output } from '../waves/CreateAliasTransactionData';
import type { MassTransferTransactionData as _waves_MassTransferTransactionData, MassTransferTransactionData__Output as _waves_MassTransferTransactionData__Output } from '../waves/MassTransferTransactionData';
import type { DataTransactionData as _waves_DataTransactionData, DataTransactionData__Output as _waves_DataTransactionData__Output } from '../waves/DataTransactionData';
import type { SetScriptTransactionData as _waves_SetScriptTransactionData, SetScriptTransactionData__Output as _waves_SetScriptTransactionData__Output } from '../waves/SetScriptTransactionData';
import type { SponsorFeeTransactionData as _waves_SponsorFeeTransactionData, SponsorFeeTransactionData__Output as _waves_SponsorFeeTransactionData__Output } from '../waves/SponsorFeeTransactionData';
import type { SetAssetScriptTransactionData as _waves_SetAssetScriptTransactionData, SetAssetScriptTransactionData__Output as _waves_SetAssetScriptTransactionData__Output } from '../waves/SetAssetScriptTransactionData';
import type { InvokeScriptTransactionData as _waves_InvokeScriptTransactionData, InvokeScriptTransactionData__Output as _waves_InvokeScriptTransactionData__Output } from '../waves/InvokeScriptTransactionData';
import type { UpdateAssetInfoTransactionData as _waves_UpdateAssetInfoTransactionData, UpdateAssetInfoTransactionData__Output as _waves_UpdateAssetInfoTransactionData__Output } from '../waves/UpdateAssetInfoTransactionData';
import type { Long } from '@grpc/proto-loader';

export interface Transaction {
  'chain_id'?: (number);
  'sender_public_key'?: (Buffer | Uint8Array | string);
  'fee'?: (_waves_Amount | null);
  'timestamp'?: (number | string | Long);
  'version'?: (number);
  'genesis'?: (_waves_GenesisTransactionData | null);
  'payment'?: (_waves_PaymentTransactionData | null);
  'issue'?: (_waves_IssueTransactionData | null);
  'transfer'?: (_waves_TransferTransactionData | null);
  'reissue'?: (_waves_ReissueTransactionData | null);
  'burn'?: (_waves_BurnTransactionData | null);
  'exchange'?: (_waves_ExchangeTransactionData | null);
  'lease'?: (_waves_LeaseTransactionData | null);
  'lease_cancel'?: (_waves_LeaseCancelTransactionData | null);
  'create_alias'?: (_waves_CreateAliasTransactionData | null);
  'mass_transfer'?: (_waves_MassTransferTransactionData | null);
  'data_transaction'?: (_waves_DataTransactionData | null);
  'set_script'?: (_waves_SetScriptTransactionData | null);
  'sponsor_fee'?: (_waves_SponsorFeeTransactionData | null);
  'set_asset_script'?: (_waves_SetAssetScriptTransactionData | null);
  'invoke_script'?: (_waves_InvokeScriptTransactionData | null);
  'update_asset_info'?: (_waves_UpdateAssetInfoTransactionData | null);
  'data'?: "genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"lease_cancel"|"create_alias"|"mass_transfer"|"data_transaction"|"set_script"|"sponsor_fee"|"set_asset_script"|"invoke_script"|"update_asset_info";
}

export interface Transaction__Output {
  'chain_id': (number);
  'sender_public_key': (Buffer);
  'fee': (_waves_Amount__Output | null);
  'timestamp': (string);
  'version': (number);
  'genesis'?: (_waves_GenesisTransactionData__Output | null);
  'payment'?: (_waves_PaymentTransactionData__Output | null);
  'issue'?: (_waves_IssueTransactionData__Output | null);
  'transfer'?: (_waves_TransferTransactionData__Output | null);
  'reissue'?: (_waves_ReissueTransactionData__Output | null);
  'burn'?: (_waves_BurnTransactionData__Output | null);
  'exchange'?: (_waves_ExchangeTransactionData__Output | null);
  'lease'?: (_waves_LeaseTransactionData__Output | null);
  'lease_cancel'?: (_waves_LeaseCancelTransactionData__Output | null);
  'create_alias'?: (_waves_CreateAliasTransactionData__Output | null);
  'mass_transfer'?: (_waves_MassTransferTransactionData__Output | null);
  'data_transaction'?: (_waves_DataTransactionData__Output | null);
  'set_script'?: (_waves_SetScriptTransactionData__Output | null);
  'sponsor_fee'?: (_waves_SponsorFeeTransactionData__Output | null);
  'set_asset_script'?: (_waves_SetAssetScriptTransactionData__Output | null);
  'invoke_script'?: (_waves_InvokeScriptTransactionData__Output | null);
  'update_asset_info'?: (_waves_UpdateAssetInfoTransactionData__Output | null);
  'data': "genesis"|"payment"|"issue"|"transfer"|"reissue"|"burn"|"exchange"|"lease"|"lease_cancel"|"create_alias"|"mass_transfer"|"data_transaction"|"set_script"|"sponsor_fee"|"set_asset_script"|"invoke_script"|"update_asset_info";
}
