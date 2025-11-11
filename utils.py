import aiohttp

from aiodb import init_db, add_user_to_db, user_exists
from env import SITE_DOMAIN

# --- отправка данных на сервер ---
# async def send_user_to_server(user_data: dict):
#     async with aiohttp.ClientSession() as session:
#         async with session.post(rf"https://{SITE_DOMAIN}/newuser", json=user_data) as resp:
#             return await resp.text()


# --- основная функция обработки сообщения ---
async def get_info(event):
    sender = event.from_user
    first_name = sender.first_name
    last_name = sender.last_name
    full_name = f"{first_name} {last_name}"
    username = sender.username
    user_id = sender.user_id

    # Проверяем, есть ли уже пользователь
    if not await user_exists(user_id):
        # Добавляем нового пользователя
        await add_user_to_db(user_id, full_name, first_name, username)
        print(f"Пользователь {user_id} | {full_name} сохранён в БД")
        # Отправляем данные на сайт
        # user_data = {
        #     "user_id": user_id,
        #     "full_name": full_name,
        #     "first_name": first_name,
        #     "username": username
        # }
        # response = await send_user_to_server(user_data)
        # print("New user sent:", response)
    else:
        print("User already exists, ignored.")