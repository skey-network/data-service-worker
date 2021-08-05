import { config as configure } from 'dotenv'
configure()

import config from '../config'
import { App } from './processes/App'

const app = new App(config())

app.init().then(() => {
  // setInterval(async () => {
  //   const data = await app.listener.queue.getJobCounts()
  //   console.log(data)
  // }, 5000)
})

console.log('App started')
console.log(config())
