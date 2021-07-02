import { Container } from './Container'
import { connect } from 'mongodb'
import { DatabaseClient } from '../../src/Database'

export class DatabaseContainer extends Container {
  static readonly portStartIndex = 8100

  readonly id: number

  constructor(id: number) {
    super({
      name: `mongo_${id}`,
      image: 'mongo:latest',
      env: [
        { key: 'MONGO_INITDB_ROOT_USERNAME', value: 'root' },
        { key: 'MONGO_INITDB_ROOT_PASSWORD', value: 'password' }
      ],
      ports: [{ key: DatabaseContainer.getPort(id), value: 27017 }],
      volumes: [{ key: `${process.cwd()}/tmp/volumes/mongo_${id}`, value: '/data/db' }]
    })

    this.id = id
    this.prepareVolume()
  }

  async waitToBeResponsive() {
    const interval = 1000

    return new Promise<void>((resolve) => {
      const handle = setInterval(async () => {
        try {
          const client = await connect(this.uri, { useUnifiedTopology: true })
          const connected = await client.isConnected()
          if (!connected) return

          await client.close(true)
          clearInterval(handle)
          resolve()
        } catch {}
      }, interval)
    })
  }

  get uri() {
    return DatabaseClient.createUri({
      host: 'localhost',
      port: DatabaseContainer.getPort(this.id),
      name: 'admin',
      username: 'root',
      password: 'password'
    })
  }

  static getPort(id: number) {
    return DatabaseContainer.portStartIndex + id
  }
}
