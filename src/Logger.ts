import chalk from 'chalk'

const ENABLE_LOGS = true

export const createLogger = (prefix = 'Unknown') => ({
  log: (...args: any) => log(prefix, ...args),
  warn: (...args: any) => warn(prefix, ...args),
  error: (...args: any) => error(prefix, ...args),
  debug: (...args: any) => debug(prefix, ...args)
})

const write = (type: string, prefix: string, ...args: any) => {
  if (!ENABLE_LOGS) return
  if (process.env.MODE === 'test') return

  const time = chalk.gray(new Date().toISOString())

  // don't remove
  console.log(type, time, `[${prefix}]`, ...args)
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
