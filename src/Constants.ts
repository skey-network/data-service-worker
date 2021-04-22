export const addressRegex = /^[1-9A-HJ-NP-Za-km-z]{35}$/
export const assetIdRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const deviceRegex = /^device_[1-9A-HJ-NP-Za-km-z]{35}$/
export const keyRegex = /^key_[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const active = 'active'
export const devicePrefix = 'device_'

export const deviceEntryKeys = Object.freeze([
  'name',
  'type',
  'description',
  'additional_description',
  'asset_url',
  'url',
  'contact',
  'visible',
  'lat',
  'lng',
  'alt',
  'address_line_1',
  'address_line_2',
  'city',
  'postcode',
  'state',
  'country',
  'number',
  'floor',
  'active',
  'connected',
  'dapp',
  'owner',
  'device_model',
  'custom_'
])
