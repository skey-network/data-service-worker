import { ParsedUpdate } from '../UpdateParser'
import * as Common from '../Common'
import { TransactionResponse } from '../../proto/interfaces/waves/node/grpc/TransactionResponse'
import { Handler } from './Handler'
import { Logger } from '../Logger'

const INT = 4
const BYTE = 1

type PreIncrement = (val: number) => number

export class EventHandler extends Handler {
  private logger = new Logger(EventHandler.name, this.config.app.logs)

  async handleUpdate(update: ParsedUpdate) {
    const ids = update.ids.map(Common.normalizeBinaryInput)
    const txes = await this.blockchain.fetchTransactions(ids)

    const itxes = txes.filter((tx) => {
      const txType = tx.transaction?.transaction?.data
      return txType === 'invoke_script'
    })

    for (const itx of itxes) {
      await this.handleEvent(itx)
    }
  }

  async handleEvent(itx: TransactionResponse) {
    const invoke = itx.transaction?.transaction?.invoke_script
    if (!invoke) return this.logger.error('invalid itx data')

    const txHash = Common.bufferToString(itx.id)
    const sender = Common.publicKeyToAddress(
      itx.transaction?.transaction?.sender_public_key
    )

    const binData = this.parseBinaryData(invoke.function_call as Buffer)
    if (!binData) return

    const obj = {
      txHash,
      sender,
      assetId: binData.assetId,
      action: binData.action,
      status: itx.application_status
    }

    const exists = await this.db.safeFindOne({ txHash }, 'events')

    if (exists) return

    const success = await this.db.safeInsertOne(obj, 'events')
    success && this.logger.log(`Event ${obj.txHash} created`)
  }

  startPreIncrement(initial: number) {
    let current = initial

    return (value: number) => {
      const result = current
      current += value
      return result
    }
  }

  parseBinaryData(input: Buffer) {
    const inc = this.startPreIncrement(3)

    const fNameLength = this.bytesToInteger(input, inc(INT))
    const fName = this.bytesToString(input, inc(fNameLength), fNameLength)

    const argc = this.bytesToInteger(input, inc(INT))
    if (argc !== 2) return null

    const assetId = this.bytesToStringArgument(input, inc)
    if (!assetId) return null

    const action = this.bytesToStringArgument(input, inc)
    if (!action) return null

    return { fName, assetId, action }
  }

  bytesToStringArgument(input: Buffer, inc: PreIncrement) {
    const type = input.readUInt8(inc(BYTE))
    if (type !== 2) return null

    const length = this.bytesToInteger(input, inc(INT))
    return this.bytesToString(input, inc(length), length)
  }

  bytesToInteger(input: Buffer, start: number) {
    return input.slice(start, start + 4).readInt32BE(0)
  }

  bytesToString(input: Buffer, start: number, length: number) {
    return input.slice(start, start + length).toString()
  }
}
