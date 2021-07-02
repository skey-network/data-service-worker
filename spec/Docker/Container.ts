import { spawn } from 'child_process'
import * as fs from 'fs'

export type Hash<T, Y> = {
  key: T
  value: Y
}

export interface ContainerProps {
  name: string
  image: string
  env?: Hash<string, string>[]
  ports?: Hash<number, number>[]
  volumes?: Hash<string, string>[]
}

export class Container {
  props: ContainerProps
  args: string[]

  constructor(props: ContainerProps) {
    this.props = props
    this.args = this.parseArgs(props)
  }

  get name() {
    return this.props.name
  }

  get volumePath() {
    return `./tmp/volumes/${this.name}`
  }

  prepareVolume() {
    fs.mkdirSync(this.volumePath, { recursive: true })
  }

  parseArgs(props: ContainerProps) {
    return [
      'run',
      '-d',
      ...this.parseHash(props.env ?? [], '-e', '='),
      ...this.parseHash(props.ports ?? [], '-p', ':'),
      ...this.parseHash(props.volumes ?? [], '-v', ':'),
      '--name',
      this.name,
      props.image
    ]
  }

  parseHash(
    arr: Hash<string | number, string | number>[],
    prefix: string,
    separator: string
  ) {
    return arr
      .map(({ key, value }) => `${key}${separator}${value}`)
      .map((entry) => [prefix, entry])
      .flat()
  }

  async command(args: string[]) {
    const process = spawn('docker', args)

    return new Promise<void>((resolve, reject) => {
      process.stderr.on('data', (chunk: Buffer) => console.error(chunk.toString()))
      // process.stdout.on('data', (chunk: Buffer) => console.log(chunk.toString()))

      process.on('error', reject)
      process.on('exit', resolve)
    })
  }

  removeVolume() {
    fs.rmSync(this.volumePath, { recursive: true })
  }

  async run() {
    return await this.command(this.args)
  }

  async stop() {
    return await this.command(['stop', this.name])
  }

  async start() {
    return await this.command(['start', this.name])
  }

  async kill() {
    return await this.command(['kill', this.name])
  }

  async rm(force?: boolean) {
    await this.command(force ? ['rm', '-f', this.name] : ['rm', this.name])
    this.removeVolume()
  }
}
