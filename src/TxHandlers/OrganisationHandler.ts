import { Update, DataUpdate } from '../UpdateParser'
import { createLogger } from '../Logger'
import { bufferToString } from '../Common'
import { Entry } from '../Types'
import { Organisation } from '../../models/Organisation'

interface OrganisationPayload {
  name: string
  description: string
  type: string
}

const logger = createLogger('OrganisationHandler')

export const handleOrganisationUpdates = async (update: Update) => {
  for (const item of update.dataUpdates) {
    await handleSingleUpdate(item)
  }
}

const handleSingleUpdate = async (item: DataUpdate) => {
  const address = bufferToString(item.address ?? [])
  const payload = parseEntries(item.entries)

  const exists = await Organisation.exists({ address })
  const func = exists ? updateOrganisation : createOrganisation

  return await func(address, payload)
}

const parseEntries = (entries: Entry[]): OrganisationPayload => {
  const fields = ['name', 'description', 'type']

  return Object.fromEntries(
    entries
      .filter((entry) => fields.includes(entry.key!))
      .map((entry) => [entry.key, entry.string_value])
  )
}

const createOrganisation = async (address: string, payload: OrganisationPayload) => {
  if (payload.type !== 'organisation') {
    return logger.debug('invalid type')
  }

  const { name, description } = payload

  await Organisation.create({ address, name, description })
  logger.log(`Organisation ${address} created`)
}

const updateOrganisation = async (address: string, payload: OrganisationPayload) => {
  const { name, description } = payload

  await Organisation.updateOne({ address }, { name, description })
  logger.log(`Organisation ${address} updated`)
}
