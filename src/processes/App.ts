import { Config } from '../Config'
import { Listener } from './Listener'
import { Processor } from './Processor'
import { IProcess } from '../Types'
import { getInstance } from '../../spec/ExtendedLib'

export const NODE_VERSION = '1.3.6'

export interface PeerPayload {
  address: string
  applicationVersion: string
  [key: string]: any
}

export class App implements IProcess {
  config: Config
  index = 0
  listener: Listener
  processor: Processor

  constructor(config: Config) {
    this.config = config

    this.listener = new Listener(config)
    this.processor = new Processor(config)
  }

  async handleConnections() {
    const node = await this.nextNode()
    if (!node) process.exit(1)

    this.config.grpc.host = node

    await this.init()

    this.listener.promise.catch(console.error).finally(async () => {
      await this.destroy()
      this.handleConnections()
    })
  }

  async init() {
    await this.processor.init()
    await this.listener.init()
  }

  async destroy() {
    await this.listener.destroy()
    await this.processor.destroy()
  }

  async nextNode(): Promise<string | null> {
    const currentNode = this.config.grpc.host
    const peers = await this.fetchPeers()
    const nodes = [currentNode, ...peers]

    return nodes[this.index % peers.length] ?? null
  }

  private async fetchPeers(): Promise<string[]> {
    const lib = getInstance(this.config)

    const peers: PeerPayload[] = await lib
      .request('/peers/connected')
      .then((data) => data.peers)
      .catch(() => [])

    return peers
      .filter((peer) => peer.applicationVersion.includes(NODE_VERSION))
      .map((peer) => peer.address.split(/\/|\:/)[1])
  }
}
