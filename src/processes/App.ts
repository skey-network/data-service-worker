import { Config } from '../Config'
import { Listener } from './Listener'
import { Processor } from './Processor'
import { IProcess } from '../Types'

export class App implements IProcess {
  config: Config
  listener: Listener
  processor: Processor

  constructor(config: Config) {
    this.config = config

    this.listener = new Listener(config)
    this.processor = new Processor(config)
  }

  async init(height?: number) {
    console.log('Listener started')
    await this.processor.init()
    await this.listener.init(height)
  }

  async destroy() {
    await this.listener.destroy()
    await this.processor.destroy()
  }
}
