export const ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{35}$/
export const ASSET_ID_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const DEVICE_REGEX = /^device_[1-9A-HJ-NP-Za-km-z]{35}$/
export const KEY_REGEX = /^key_[1-9A-HJ-NP-Za-km-z]{32,44}$/

export const ACTIVE_KEYWORD = 'active'
export const INACTIVE_KEYWORD = 'inactive'

export const DEVICE_PREFIX = 'device_'

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
