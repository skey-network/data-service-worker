import chalk from 'chalk'

export class Logger {
  private prefix: string = 'Default'

  constructor(prefix: string) {
    this.prefix = prefix
  }

  public log(...args: any) {
    const type = chalk.greenBright('LOG  ')
    this.write(type, this.prefix, ...args)
  }

  public warn(...args: any) {
    const type = chalk.yellowBright('WARN ')
    this.write(type, this.prefix, ...args)
  }

  public error(...args: any) {
    const type = chalk.redBright('ERROR')
    this.write(type, this.prefix, ...args)
  }

  public debug(...args: any) {
    const type = chalk.magenta('DEBUG')
    this.write(type, this.prefix, ...args)
  }

  private write(type: string, prefix: string, ...args: any) {
    // if (!config().app.logs) return

    const time = chalk.gray(new Date().toISOString())

    // don't remove
    console.log(type, time, chalk.grey(`[${prefix}]`), ...args)
  }
}
