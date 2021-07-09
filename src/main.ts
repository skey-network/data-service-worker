import { config as configure } from 'dotenv'
configure()

import config from '../config'
import { App } from './Processes/App'

const app = new App(config())

app.init()
