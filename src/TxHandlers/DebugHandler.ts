import { Handler } from './Handler'
import * as fs from 'fs'
import { Logger } from '../Logger'
import { ParsedUpdate } from '../UpdateParser'

export interface MetaContent {
  height: number
  timestamp: number
}

export class DebugHandler extends Handler {
  private logger = new Logger(DebugHandler.name, this.config.app.logs)
  private file = './height.txt'

  async handleUpdate(update: ParsedUpdate) {
    this.logger.debug('Current height', update.height)
    // this.write({ height: update.height, timestamp: Date.now() })
  }

  // read(): MetaContent | null {
  //   if (!fs.existsSync(this.file)) return null

  //   return JSON.parse(fs.readFileSync(this.file, 'utf-8'))
  // }

  write(meta: MetaContent) {
    fs.writeFileSync(this.file, JSON.stringify(meta, null, 2))
  }
}
