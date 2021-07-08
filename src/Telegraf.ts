import { Telegraf } from 'telegraf'
import config from '../config'

const { token, chatId } = config().telegram
const bot = new Telegraf(token)

export const message = async (content: string) => {
  try {
    await bot.telegram.sendMessage(chatId, content)
  } catch (err) {}
}
