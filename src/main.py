import asyncio
from maxapi import Bot, Dispatcher
from maxapi.types import BotStarted, Command, MessageCreated, Message, InputMedia
from maxapi.types import ButtonsPayload, OpenAppButton
from maxapi.types.attachments import AttachmentButton
from maxapi.enums.parse_mode import ParseMode

from .config import get_settings

settings = get_settings()
bot = Bot(settings.bot_token)
dp = Dispatcher()

@dp.bot_started()
async def bot_started(event: BotStarted):
    keyboard_payload = ButtonsPayload(
        buttons=[
            [OpenAppButton(
                text="Открыть приложение", 
                web_app=settings.bot_username,
                contact_id=settings.bot_id
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
            InputMedia(r"src/photos/start.jpg"),
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
                web_app=settings.bot_username,
                contact_id=settings.bot_id
            )]
        ]
    )

    keyboard_attachment = AttachmentButton(
        type="inline_keyboard",
        payload=keyboard_payload
    )

    await event.message.answer(f"Я работаю только в вебаппе. Пожалуйста нажми кнопку и открой вебапп.", attachments=[
            InputMedia(r"src/photos/start.jpg"),
            keyboard_attachment
        ],)

async def main():
    print('Start polling...')
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())