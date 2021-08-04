import { Container } from './Container'
import * as fs from 'fs'
import fetch from 'node-fetch'

export class BlockchainContainer extends Container {
  static readonly portStartIndex = 7100

  readonly id: number

  constructor(id: number) {
    const ports = BlockchainContainer.getPorts(id)

    super({
      name: `node_${id}`,
      image: 'wavesplatform/wavesnode:latest',
      ports: [
        { key: ports.http, value: 6869 },
        { key: ports.grpc, value: 6877 },
        { key: ports.updates, value: 6881 }
      ],
      volumes: [{ key: `${process.cwd()}/tmp/volumes/node_${id}`, value: '/etc/waves' }]
    })

    this.id = id
    this.prepareVolume()
  }

  get ports() {
    return BlockchainContainer.getPorts(this.id)
  }

  static getPorts(id: number) {
    return {
      http: this.portStartIndex + id * 3,
      grpc: this.portStartIndex + id * 3 + 1,
      updates: this.portStartIndex + id * 3 + 2
    }
  }

  async waitToBeResponsive() {
    const treshold = 10
    const interval = 1000

    return new Promise<void>((resolve) => {
      const handle = setInterval(async () => {
        const height = await this.fetchHeight()
        if (height < treshold) return

        clearInterval(handle)
        resolve()
      }, interval)
    })
  }

  async fetchHeight(): Promise<number> {
    const ports = BlockchainContainer.getPorts(this.id)
    const url = `http://localhost:${ports.http}/blocks/height`

    try {
      const res = await fetch(url)
      const data = await res.json()
      return data.height
    } catch {
      return 0
    }
  }

  prepareVolume() {
    super.prepareVolume()

    const templatePath = './artifacts/blockchain.conf'
    const filename = 'waves.conf'

    fs.copyFileSync(templatePath, `${this.volumePath}/${filename}`)
  }
}
