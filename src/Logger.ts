import chalk from 'chalk'
import config from '../config'

const write = (type: string, prefix: string, ...args: any) => {
  // if (!config().app.logs) return

  const time = chalk.gray(new Date().toISOString())

  // don't remove
  console.log(type, time, chalk.grey(`[${prefix}]`), ...args)
}

const log = (prefix: string, ...args: any) => {
  const type = chalk.greenBright('LOG  ')
  write(type, prefix, ...args)
}

const warn = (prefix: string, ...args: any) => {
  const type = chalk.yellowBright('WARN ')
  write(type, prefix, ...args)
}

const error = (prefix: string, ...args: any) => {
  const type = chalk.redBright('ERROR')
  write(type, prefix, ...args)
}

const debug = (prefix: string, ...args: any) => {
  const type = chalk.magenta('DEBUG')
  write(type, prefix, ...args)
}

export const createLogger = (prefix = 'Unknown') => ({
  log: log.bind(null, prefix),
  warn: warn.bind(null, prefix),
  error: error.bind(null, prefix),
  debug: debug.bind(null, prefix)
})

export const DefaultLogger = createLogger('Default')
