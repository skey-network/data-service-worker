import { config as configure } from 'dotenv'
import { DatabaseClient } from './Clients/DatabaseClient'
import { Logger } from './Logger'

configure()

import config from '../config'

const logger = new Logger('LocationUpdater', true)

const fetchLocations = async (client: DatabaseClient) =>
  await client.connection
    .collection('devices')
    .find({
      location: { $exists: false },
      lat: { $exists: true },
      lng: { $exists: true }
    })
    .toArray()

const updateLocation = async (client: DatabaseClient, device: any) =>
  client.connection.collection('devices').findOneAndUpdate(
    { address: device.address },
    {
      $set: {
        location: {
          type: 'Point',
          coordinates: [device.lng, device.lat]
        }
      }
    }
  )

const updateLocations = async () => {
  const dbClient = new DatabaseClient(config())

  logger.log('Initialized. Connecting...')

  await dbClient.connect()

  logger.log('Connection established. Fetching Devices...')

  const devicesWithoutLocations = await fetchLocations(dbClient)

  if (devicesWithoutLocations.length === 0) {
    logger.log('No devices need updating. Disconnecting...')
    await dbClient.disconnect()
    return null
  }

  logger.log('Devices fetched. Updating...')

  await Promise.all(
    devicesWithoutLocations.map(async (device) => {
      await updateLocation(dbClient, device)
    })
  )
    .catch((e: any) => {
      logger.error('Failed to update:')
      logger.error(e)
    })
    .finally(async () => {
      logger.log('Disconnecting')
      await dbClient.disconnect()
    })

  logger.log('Done!')
}

updateLocations()
