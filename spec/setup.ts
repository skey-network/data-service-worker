import { cwd } from 'process'
import { config as configure } from 'dotenv'
configure({ path: `${cwd()}/.env.test` })
