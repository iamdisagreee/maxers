# MAX Web-App "Рядом"

## 🚀 О проекте

**"Рядом"** — это социальный мини-апп для мессенджера MAX, созданный для организации быстрой, локальной и безопасной взаимопомощи.

### Проблема

Миллионы **пожилых людей и людей с инвалидностью** нуждаются в простой бытовой помощи, но сталкиваются с небезопасностью и неудобством существующих решений. С другой стороны, множество **волонтеров** готовы помогать, но им не хватает простого инструмента, чтобы делать это "здесь и сейчас".

### Наше решение

"Рядом" — это мост, который убирает эти барьеры.

*   **Для нуждающихся** возможность за минуту создать просьбу, которая будет видна проверенным волонтерам поблизости.
*   **Для волонтеров** удобный каталог заданий в своем районе для совершения добрых дел "по пути".
*   **Для всех** прозрачная система рейтинга доверия и геймификации, которая строит безопасное сообщество и мотивирует помогать чаще.

Мы превращаем желание помочь в реальное действие, делая добро частью повседневной жизни пользователей MAX.

## Стек технологий
- **Фронтенд**: React, Vite, Axios
- **Бекенд**: FastAPI
- **База данных**: PostgreSQL
- **ORM**: SQLAlchemy
- **Система миграций**: Alembic
- **Авторизация**: JWT
- **Контейниризация**: Dockerfile, docker compose



## Структура проекта
- **Фронтенд** - компонентная архитектура с Context API.
- **Бекенд**  - многоуровневая архитектура. Каждый модуль отвечает за отдельную задачу.
- **Бот** - бот-заглушка для отправления ссылки на Mini-App.

### Основная структура проекта
```
.
├── backend
│   ├── alembic.ini
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── README.md
│   ├── requirements.txt
│   └── src
│       ├── common
│       │   ├── models.py
│       │   ├── __pycache__
│       │   ├── repositories.py
│       │   └── schema_base.py
│       ├── config.py
│       ├── core
│       │   ├── dependecies.py
│       │   ├── postgres.py
│       │   └── __pycache__
│       ├── main.py
│       ├── migrations
│       │   ├── env.py
│       │   ├── __pycache__
│       │   ├── README
│       │   ├── script.py.mako
│       │   └── versions
│       ├── __pycache__
│       │   ├── config.cpython-312.pyc
│       │   └── main.cpython-312.pyc
│       ├── tasks
│       │   ├── models.py
│       │   ├── __pycache__
│       │   ├── repositories.py
│       │   ├── routers.py
│       │   ├── schemas.py
│       │   └── services.py
│       └── users
│           ├── models.py
│           ├── __pycache__
│           ├── repositories.py
│           ├── routers.py
│           ├── schemas.py
│           └── services.py
├── bot
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src
│       ├── config.py
│       ├── main.py
│       └── photos
│           └── start.jpg
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── photos
│   │   │   └── svg
│   │   ├── components
│   │   │   ├── BottomNav
│   │   │   ├── Button
│   │   │   ├── Input
│   │   │   ├── ModalConfirm
│   │   │   ├── ModalConfirm2
│   │   │   ├── ModalFeedback
│   │   │   ├── ModalInput
│   │   │   ├── ModalList
│   │   │   ├── NavBar
│   │   │   ├── TaskCard
│   │   │   ├── TaskCategory
│   │   │   ├── TaskOpener
│   │   │   ├── TaskPage
│   │   │   └── TaskStatus
│   │   ├── contexts
│   │   │   └── TaskOpenerContext.jsx
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Catalog
│   │   │   ├── Start
│   │   │   └── User
│   │   └── styles
│   │       ├── index.css
│   │       ├── reset.css
│   │       └── variables.css
│   └── vite.config.js
└── README.md

```
---

### Основные модули (бекенд)

#### **`src/users`** - Модуль для работы с пользователями, отвечает за работу с HTTP-методами для пользователя

---

#### **`src/tasks`** - Модуль для работы с задачи, отвечает за работу с HTTP-методами для задач

---

#### **`src/migrations`** - Управление миграциями базы данных с Alembic

---

#### **`src/common`** - Общие сервисы/схемы для модулей

---

#### **`src/core`** - Подключение к бд и зависимости

---

#### **`main.py`** - Основной файл для запуска приложения

---

### Основные модули (бот)

#### **`main.py`** - Основной файл для обработки действий бота и его запуска

### Основные модули (фронтенд)

#### **`src/App.jsx`** - Точка входа в приложение

---

#### **`src/utils/storage.js`** - Обёртка над DeviceStorage и SecureStorage от Max Bridge, с фоллбеком на LocalStorage

---

#### **`src/styles/`** - 3 файла стилей: reset.css сброс стандартных стилей, variables.css глобальные переменные цветов, index.css глобальные стили веб приложения
---

#### **`src/pages`** - 3 главные страницы приложения: Start, User, Catalog

---

#### **`src/contexts`**  - Контекст для всплывающего окна, чтобы его можно было открыть из любого места

---

#### **`src/components`** - Элементы приложения

---

#### **`src/assets`** - Хранение изображений и векторных иконок

---

#### **`src/api`** - Работа с апи


## Настройка авторизации

Для авторизации используется JWT, который выдает 1 раз при регистрации пользователя. Токен защищает API-эндпоинты.

## Запуск приложения

1. Клонируйте репозиторий:

   ```bash
   https://github.com/iamdisagreee/maxers.git
   ```
2. Перейдите в директорию maxers
   ```bash
   cd maxers/
   ```
2. Создайте .env в директориях backend/, bot/, frontend/ на основе .env.example
   
3. Запустите docker-compose.yml

   ```bash
   docker compose up --build -d
   ```

## Команда проекта
- [Матвей Кривко](https://t.me/tydu4) — Frontend Developer
- [Никита Смирнов](https://t.me/mrBingleyy) — UX/UI Designer
- [Владимир Харитонов](https://t.me/vakharitonovv) — Backend Developer

