import { Container } from './Container'

export class RedisContainer extends Container {
  static readonly portStartIndex = 9100

  readonly id: number

  constructor(id: number) {
    super({
      name: `redis_${id}`,
      image: 'redis:latest',
      ports: [{ key: RedisContainer.getPort(id), value: 6379 }],
      volumes: [{ key: `${process.cwd()}/tmp/volumes/redis_${id}`, value: '/data' }]
    })

    this.id = id
    this.prepareVolume()
  }

  // TODO
  async waitToBeResponsive() {
    return new Promise<void>((resolve) => {
      const timeout = 5000
      setTimeout(resolve, timeout)
    })
  }

  static getPort(id: number) {
    return RedisContainer.portStartIndex + id
  }
}
