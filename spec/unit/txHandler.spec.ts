import '../setup'
import { TxHandler } from '../../src/TxHandler'
import { ReflectiveInjector } from 'injection-js'
import { Logger } from '../../src/Logger'
import { Common } from '../../src/Common'
import { Db } from '../../src/Db'

describe('txHandler', () => {
  let service: TxHandler

  beforeEach(() => {
    const injector = ReflectiveInjector.resolveAndCreate([Logger, Common, Db, TxHandler])

    service = injector.get(TxHandler)
  })

  describe('dataEntriesIterator', () => {
    it('has entries', () => {
      const iter = service.dataEntriesIterator({
        update: {
          append: {
            transaction_state_updates: [
              { data_entries: [{ address: 'aaa' }, { address: 'bbb' }] }
            ]
          }
        }
      })

      expect(iter.next()).toEqual({ done: false, value: { address: 'aaa' } })
      expect(iter.next()).toEqual({ done: false, value: { address: 'bbb' } })
      expect(iter.next()).toEqual({ done: true })
    })
  })

  it('no state updates', () => {
    let iter = service.dataEntriesIterator({})

    expect(iter.next()).toEqual({ done: true })

    iter = service.dataEntriesIterator({ update: {} })

    expect(iter.next()).toEqual({ done: true })

    iter = service.dataEntriesIterator({ update: { append: {} } })

    expect(iter.next()).toEqual({ done: true })

    iter = service.dataEntriesIterator({
      update: { append: { transaction_state_updates: [] } }
    })

    expect(iter.next()).toEqual({ done: true })
  })

  it('no entries', () => {
    let iter = service.dataEntriesIterator({
      update: { append: { transaction_state_updates: [{ data_entries: [] }] } }
    })

    expect(iter.next().done).toBe(true)
  })
})
