import { config as configure } from 'dotenv'
configure()

import config from '../config'
import { App } from './processes/App'

const parseArgs = () => {
  const [key, value] = process.argv.slice(2)

  if (key !== '--height' || !value) return

  return Number(value)
}

const app = new App(config())

app.init(parseArgs()).then(() => {
  // DEBUG
  setInterval(async () => {
    const data = await app.listener.queue.getJobCounts()
    console.log(data)
  }, 5000)
})

console.log('App started')
console.log(config())
