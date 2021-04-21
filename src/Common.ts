import { Injectable } from 'injection-js'

export const dapps = ['3M4qwDomRabJKLZxuXhwfqLApQkU592nWxF']

@Injectable()
export class Common {
  isDapp(address: string) {
    return dapps.includes(address)
  }

  delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, timeout)
    })
  }
}
