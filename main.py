import asyncio
import logging
import aiosqlite
import aiohttp
import asyncio
from maxapi import Bot, Dispatcher
from maxapi.types import BotStarted, Command, MessageCreated, Message, InputMedia
from maxapi.enums.parse_mode import ParseMode
from env import BOT_TOKEN
from aiodb import init_db
from utils import get_info

logging.basicConfig(level=logging.INFO)

bot = Bot(BOT_TOKEN)
dp = Dispatcher()


# Ответ бота при нажатии на кнопку "Начать"
@dp.bot_started()
async def bot_started(event: BotStarted):
    print(event.from_user)
    await get_info(event)
    await bot.send_message(
        chat_id=event.chat_id,
        text=r'<b>Привет! Я социальный бот для помощи нуждающимся!</b> Чем могу тебе помочь?',
        attachments=[InputMedia(r"./photos/start.jpg")],
        parse_mode=ParseMode.HTML
    )

@dp.message_created()
async def hello(event: MessageCreated):
    await event.message.answer(f"Я работаю только в вебаппе, пожалуйста нажми кнопку и открой вебапп.")



async def main():
    await init_db()
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())