import { Injectable } from 'injection-js'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { readdirSync } from 'fs'

@Injectable()
export class ProtoLoader {
  public proto: any

  private options: protoLoader.Options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }

  constructor() {
    const dir = `${process.cwd()}/proto`

    const files = readdirSync(dir)
      .map((filename) => `${dir}/${filename}`)
      .filter((file) => /.proto$/.test(file))

    const packageDefinition = protoLoader.loadSync(files, this.options)
    this.proto = grpc.loadPackageDefinition(packageDefinition).waves
  }
}
