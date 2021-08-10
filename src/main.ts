import { config as configure } from 'dotenv'
configure()

import config from '../config'
import { App } from './processes/App'

const app = new App(config())

app.init()

console.log('App started')
console.log(config())
