import chalk from 'chalk'
import { Injectable } from 'injection-js'

@Injectable()
export class Logger {
  private logs = true

  private write(prefix: string, ...args: any) {
    if (!this.logs) return

    const time = chalk.gray(new Date().toISOString())
    // don't remove
    console.log(prefix, time, ...args)
  }

  log(...args: any) {
    const prefix = chalk.greenBright('LOG  ')
    this.write(prefix, ...args)
  }

  warn(...args: any) {
    const prefix = chalk.yellowBright('WARN ')
    this.write(prefix, ...args)
  }

  error(...args: any) {
    const prefix = chalk.redBright('ERROR')
    this.write(prefix, ...args)
  }

  debug(...args: any) {
    const prefix = chalk.magenta('DEBUG')
    this.write(prefix, ...args)
  }
}
