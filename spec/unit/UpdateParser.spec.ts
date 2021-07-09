import * as UpdateParser from '../../src/UpdateParser'
import * as fs from 'fs'

const parseWithBuffers = (content: string) => {
  return JSON.parse(content, (_, value) => {
    if (typeof value !== 'object') return value

    if (value.type === 'Buffer') return Buffer.from(value.data)

    return value
  })
}

const loadChunks = () => {
  const dir = './spec/fixtures/update_parser_1'

  const data = fs
    .readdirSync(dir)
    .map((filename) => fs.readFileSync(`${dir}/${filename}`, 'utf-8'))
    .map((content) => parseWithBuffers(content))
    .map((chunk) => ({
      raw: chunk,
      parsed: UpdateParser.parseUpdate(chunk)!
    }))
    .reduce(
      (prev, curr) => ({
        raw: [...prev.raw, curr.raw],
        parsed: [...prev.parsed, curr.parsed]
      }),
      { raw: [] as any[], parsed: [] as any }
    )

  return {
    raw: JSON.stringify(data.raw),
    parsed: JSON.stringify(data.parsed)
  }
}

describe('transformEntries', () => {
  const cases = [
    {
      toString: () => 'basic example',
      input: [
        {
          data_entries: [
            {
              address: Buffer.from([1, 2]),
              data_entry: {
                string_value: '1',
                value: 'string_value',
                key: '1'
              }
            },
            {
              address: Buffer.from([3, 4]),
              data_entry: {
                string_value: '2',
                value: 'string_value',
                key: '2'
              }
            },
            {
              address: Buffer.from([1, 2]),
              data_entry: {
                string_value: '3',
                value: 'string_value',
                key: '3'
              }
            }
          ]
        }
      ],
      expected: [
        {
          address: '5T',
          entries: [
            { key: '1', value: '1' },
            { key: '3', value: '3' }
          ]
        },
        {
          address: 'EK',
          entries: [{ key: '2', value: '2' }]
        }
      ]
    }
  ]

  it.each(cases)('%s', ({ input, expected }) => {
    const result = UpdateParser.transformEntries(input as any)
    expect(result).toEqual(expected)
  })
})

describe('ids', () => {
  const cases = [
    {
      toString: () => 'returns array of strings',
      input: {
        update: {
          append: {
            transaction_ids: [Buffer.from([1, 2]), Buffer.from([3, 4])]
          }
        }
      },
      expected: ['5T', 'EK']
    },
    {
      toString: () => 'undefined object leaf',
      input: { update: { append: {} } },
      expected: []
    },
    {
      toString: () => 'empty array',
      input: {
        update: {
          append: {
            transaction_ids: []
          }
        }
      },
      expected: []
    },
    {
      toString: () => 'undefined item',
      input: {
        update: {
          append: {
            transaction_ids: [undefined]
          }
        }
      },
      expected: []
    }
  ]

  it.each(cases)('%s', ({ input, expected }) => {
    const result = UpdateParser.getIds(input as any)
    expect(result).toEqual(expected)
  })
})

// test if there is no data loses while parsing
describe('has required data', () => {
  const { raw, parsed } = loadChunks()

  it('raw', () => {
    const EXPECTED_RAW_AMOUNT = 20

    expect(raw.match(/device/g)?.length).toBe(EXPECTED_RAW_AMOUNT)
    expect(raw.match(/organisation/g)?.length).toBe(EXPECTED_RAW_AMOUNT)
    expect(raw.match(/supplier/g)?.length).toBe(EXPECTED_RAW_AMOUNT)
  })

  it('parsed', () => {
    const EXPECTED_PARSED_AMOUNT = 10

    expect(parsed.match(/device/g)?.length).toBe(EXPECTED_PARSED_AMOUNT)
    expect(parsed.match(/organisation/g)?.length).toBe(EXPECTED_PARSED_AMOUNT)
    expect(parsed.match(/supplier/g)?.length).toBe(EXPECTED_PARSED_AMOUNT)
  })
})

describe('getBalanceUpdates', () => {
  const cases = [
    {
      toString: () => 'empty',
      input: [],
      expected: []
    },
    {
      toString: () => 'basic example',
      input: [
        {
          balances: [
            {
              address: Buffer.from([1, 2]),
              amount_after: {
                asset_id: Buffer.from([1, 2])
              }
            },
            {
              address: Buffer.from([3, 4]),
              amount_after: {
                asset_id: Buffer.from([3, 4])
              }
            }
          ]
        },
        {
          balances: []
        },
        {}
      ],
      expected: [
        {
          address: '5T',
          assetId: '5T'
        },
        {
          address: 'EK',
          assetId: 'EK'
        }
      ]
    }
  ]

  it.each(cases)('%s', ({ input, expected }) => {
    expect(UpdateParser.getBalanceUpdates(input)).toEqual(expected)
  })
})

describe('getAssetUpdates', () => {
  const cases = [
    {
      toString: () => 'empty',
      input: [],
      expected: []
    },
    {
      toString: () => 'basic example',
      input: [
        {
          assets: [{ after: 1 }, { after: 2 }]
        },
        {
          assets: [{ after: 3 }]
        },
        {
          assets: []
        },
        {}
      ],
      expected: [1, 2, 3]
    }
  ]

  it.each(cases)('%s', ({ input, expected }) => {
    const result = UpdateParser.getAssetUpdates(input as any)
    expect(result).toEqual(expected)
  })
})

describe('parseEntry', () => {
  const cases = [
    {
      toString: () => 'no key',
      entry: {
        value: 'string_value',
        string_value: 'aaa'
      },
      expected: null
    },
    {
      toString: () => 'int',
      entry: {
        key: 'int',
        value: 'int_value',
        int_value: '123123'
      },
      expected: {
        key: 'int',
        value: 123123
      }
    },
    {
      toString: () => 'string',
      entry: {
        key: 'string',
        value: 'string_value',
        string_value: 'bbb'
      },
      expected: {
        key: 'string',
        value: 'bbb'
      }
    },
    {
      toString: () => 'bool - true',
      entry: {
        key: 'bool',
        value: 'bool_value',
        bool_value: true
      },
      expected: {
        key: 'bool',
        value: true
      }
    },
    {
      toString: () => 'bool - false',
      entry: {
        key: 'bool',
        value: 'bool_value',
        bool_value: false
      },
      expected: {
        key: 'bool',
        value: false
      }
    },
    {
      toString: () => 'binary',
      entry: {
        key: 'binary',
        value: 'binary_value',
        binary_value: Buffer.from([1, 2])
      },
      expected: {
        key: 'binary',
        value: '5T'
      }
    },
    {
      toString: () => 'empty value',
      entry: {
        key: 'empty',
        value: '',
        string_value: undefined
      },
      expected: {
        key: 'empty',
        value: null
      }
    },
    {
      toString: () => 'undefined',
      entry: undefined,
      expected: null
    }
  ]

  it.each(cases)('%s', ({ entry, expected }) => {
    const result = UpdateParser.parseEntry(entry as any)
    expect(result).toEqual(expected)
  })
})
