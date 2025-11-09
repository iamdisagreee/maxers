import aiosqlite

DB_PATH = "users.db"

# --- инициализация базы данных ---
async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                full_name TEXT,
                first_name TEXT,
                username TEXT
            )
        """)
        await db.commit()


# --- добавление пользователя ---
async def add_user_to_db(user_id: int, full_name: str, first_name: str, username: str):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO users (user_id, full_name, first_name, username) VALUES (?, ?, ?, ?)",
            (user_id, full_name, first_name, username)
        )
        await db.commit()


# --- проверка наличия пользователя ---
async def user_exists(user_id: int) -> bool:
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute("SELECT 1 FROM users WHERE user_id = ?", (user_id,)) as cursor:
            row = await cursor.fetchone()
            return row is not None