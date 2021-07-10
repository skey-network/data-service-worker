import { Telegraf } from 'telegraf'
import config from '../../config'

const { token, chatId } = config().telegram ?? {}
const bot = token ? new Telegraf(token) : null

export const message = async (content: string) => {
  try {
    if (!bot || !chatId) return

    await bot.telegram.sendMessage(chatId, content)
  } catch (err) {
    console.error(err)
  }
}
