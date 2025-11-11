import asyncio
import logging
import aiosqlite
import aiohttp
import asyncio
from maxapi import Bot, Dispatcher
from maxapi.types import BotStarted, Command, MessageCreated, Message, InputMedia
from maxapi.types import ButtonsPayload, OpenAppButton
from maxapi.types.attachments import AttachmentButton
from maxapi.enums.parse_mode import ParseMode
from env import BOT_TOKEN, BOT_USERNAME, BOT_ID
from aiodb import init_db
from utils import get_info

logging.basicConfig(level=logging.INFO)

bot = Bot(BOT_TOKEN)
dp = Dispatcher()


# Ответ бота при нажатии на кнопку "Начать"
@dp.bot_started()
async def bot_started(event: BotStarted):
    await get_info(event)
    keyboard_payload = ButtonsPayload(
        buttons=[
            [OpenAppButton(
                text="Открыть приложение", 
                web_app=BOT_USERNAME,
                contact_id=BOT_ID
            )]
        ]
    )

    keyboard_attachment = AttachmentButton(
        type="inline_keyboard",
        payload=keyboard_payload
    )
    await bot.send_message(
        chat_id=event.chat_id,
        text=r'<b>Привет! Я социальный бот для помощи нуждающимся!</b> Открой веб-приложение чтобы начать: ',
        attachments=[
            InputMedia(r"./photos/start.jpg"), 
            keyboard_attachment
        ],
        parse_mode=ParseMode.HTML
    )

@dp.message_created()
async def hello(event: MessageCreated):
    keyboard_payload = ButtonsPayload(
        buttons=[
            [OpenAppButton(
                text="Открыть приложение", 
                web_app=BOT_USERNAME,
                contact_id=BOT_ID
            )]
        ]
    )

    keyboard_attachment = AttachmentButton(
        type="inline_keyboard",
        payload=keyboard_payload
    )

    await event.message.answer(f"Я работаю только в вебаппе. Пожалуйста нажми кнопку и открой вебапп.", attachments=[
            InputMedia(r"./photos/start.jpg"), 
            keyboard_attachment
        ],)



async def main():
    await init_db()
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())