import { Injectable } from 'injection-js'

@Injectable()
export class Common {
  delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
  }
}
