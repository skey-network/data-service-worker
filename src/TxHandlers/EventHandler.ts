import { Update } from '../UpdateParser'
import * as Blockchain from '../Blockchain'
import * as Common from '../Common'
import { TransactionResponse } from '../../proto/interfaces/waves/node/grpc/TransactionResponse'
import { createLogger } from '../Logger'
import { Event } from '../../models/Event'

const INT = 4
const BYTE = 1

type PreIncrement = (val: number) => number

const logger = createLogger('EventHandler')

export const handleEventUpdates = async (update: Update) => {
  const ids = update.ids.map(Common.normalizeBinaryInput)
  const txes = await Blockchain.fetchTransactions(ids)

  const itxes = txes.filter((tx) => {
    const txType = tx.transaction?.transaction?.data
    return txType === 'invoke_script'
  })

  for (const itx of itxes) {
    await handleEvent(itx)
  }
}

const handleEvent = async (itx: TransactionResponse) => {
  const invoke = itx.transaction?.transaction?.invoke_script
  if (!invoke) return logger.error('invalid itx data')

  const txHash = Common.bufferToString(itx.id)
  const sender = Common.publicKeyToAddress(
    itx.transaction?.transaction?.sender_public_key
  )
  const device = Common.bufferToString(invoke.d_app?.public_key_hash)

  const binData = parseBinaryData(invoke.function_call as Buffer)
  if (!binData) return

  const obj = {
    txHash,
    sender,
    device,
    assetId: binData.assetId,
    action: binData.action,
    status: itx.application_status
  }

  const exists = await Event.exists({ txHash })
  if (exists) return

  await Event.create(obj)
  logger.log(`Event ${obj.txHash} created`)
}

const startPreIncrement = (initial: number) => {
  let current = initial

  return (value: number) => {
    const result = current
    current += value
    return result
  }
}

const parseBinaryData = (input: Buffer) => {
  const inc = startPreIncrement(3)

  const fNameLength = bytesToInteger(input, inc(INT))
  const fName = bytesToString(input, inc(fNameLength), fNameLength)

  const argc = bytesToInteger(input, inc(INT))
  if (argc !== 2) return null

  const assetId = bytesToStringArgument(input, inc)
  if (!assetId) return null

  const action = bytesToStringArgument(input, inc)
  if (!action) return null

  return { fName, assetId, action }
}

const bytesToStringArgument = (input: Buffer, inc: PreIncrement) => {
  const type = input.readUInt8(inc(BYTE))
  if (type !== 2) return null

  const length = bytesToInteger(input, inc(INT))
  return bytesToString(input, inc(length), length)
}

const bytesToInteger = (input: Buffer, start: number) => {
  return input.slice(start, start + 4).readInt32BE(0)
}

const bytesToString = (input: Buffer, start: number, length: number) => {
  return input.slice(start, start + length).toString()
}
