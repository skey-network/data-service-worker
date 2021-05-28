import { Update } from '../UpdateParser'
import * as Blockchain from '../Blockchain'
import * as Common from '../Common'
import { TransactionResponse } from '../../proto/interfaces/waves/node/grpc/TransactionResponse'
import { createLogger } from '../Logger'

const logger = createLogger('EventHandler')

export const handleEventUpdates = async (update: Update) => {
  const txes = await Blockchain.fetchTransactions(update.ids)

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

  const obj = {
    txHash,
    sender,
    device
  }

  console.log(parseBinaryData(invoke.function_call as Buffer))
}

const parseBinaryData = (input: Buffer) => {
  const INT = 4
  let index = 3

  const fNameLength = bytesToInteger(input, (index += INT) - INT)
  const fName = bytesToString(input, (index += fNameLength) - fNameLength, fNameLength)
  const argc = bytesToInteger(input, (index += INT) - INT)

  if (argc !== 2) return null

  const assetId = bytesToStringArgument(input, index)
  if (!assetId) return null

  index += assetId.length + 5

  const action = bytesToStringArgument(input, index)
  if (!action) return null

  return { fName, assetId, action }
}

const bytesToStringArgument = (input: Buffer, index: number) => {
  const type = input.readUInt8((index += 1) - 1)
  console.log('type', type)
  if (type !== 2) return null

  const length = bytesToInteger(input, (index += 4) - 4)

  return bytesToString(input, (index += length) - length, length)
}

const bytesToInteger = (input: Buffer, start: number) => {
  return input.slice(start, start + 4).readInt32BE(0)
}

const bytesToString = (input: Buffer, start: number, length: number) => {
  return input.slice(start, start + length).toString()
}
