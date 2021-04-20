import { Injectable } from 'injection-js'
import { GrpcClient } from './GrpcClient'

@Injectable()
export class Blockchain {
  constructor(private grpcClient: GrpcClient) {}

  fetchHeight() {
    return new Promise<number>((resolve, reject) => {
      this.grpcClient.blocksApiClient.GetCurrentHeight({}, (err, res) => {
        if (err) reject(err)

        resolve(res!.value)
      })
    })
  }
}
