import { config as configure } from 'dotenv'
import { Logger } from '../src/Logger'
configure()

process.env.MODE = 'test'
