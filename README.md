# Fruit Shop (React + Vite) + Express API

Прототип интернет-магазина (вариант: фрукты) с авторизацией, защищёнными маршрутами, загрузкой списка товаров с пагинацией и страницей товара. Клиент — SPA на React Router. Сервер — Express с REST API и раздачей production-сборки клиента.

<img width="1680" height="872" alt="Снимок экрана 2025-12-26 в 18 45 47" src="https://github.com/user-attachments/assets/6d6b5b3c-a987-4a43-b1ee-fbbafd1bfeea" />


## Что реализовано

1) Четыре страницы
   - Главная
   - Login
   - Список товаров (доступен только после входа)
   - Страница товара

2) Маршрутизация
   - Отдельный путь для каждой страницы
   - Защищённый доступ к /goods и /goods/:id (редирект на /login при отсутствии авторизации)

3) REST API
   - POST /api/login — выдаёт токен
   - GET /api/goods?page=<n>&limit=<n> — список товаров с пагинацией
   - GET /api/goods/:id — товар по id

4) Клиентская логика
   - «Загрузка…» при загрузке данных
   - «Ошибка соединения» при сетевой ошибке
   - Стартовая загрузка 10 товаров
   - Дозагрузка по кнопке «Загрузить больше»
   - Кастомный хук useServerGoods() для работы с сервером

5) Production-сборка
   - Клиент собирается в папку client/dist
   - Сервер раздаёт client/dist как статику и делает SPA fallback на index.html

## Требования

- Node.js 18+ (рекомендуется 20)
- npm (устанавливается вместе с Node.js)

## Структура репозитория

HSE-REACTJS-PROJECT/
  client/    React + Vite
  server/    Express API + раздача client/dist

## Запуск в режиме разработки

Нужно два терминала: один для сервера, один для клиента.

### Шаг 1. Настройка переменных окружения сервера

В папке server/ должен быть файл .env. Его удобно создать копированием из .env.example.

macOS / Linux (bash/zsh)
```bash
cd server
npm install
```

Windows PowerShell
```powershell
cd server
npm install
```

Windows CMD
```bat
cd server
npm install
```

### Шаг 2. Запуск сервера

macOS / Linux
```bash
cd server
npm run dev
```

Windows PowerShell / CMD
```bat
cd server
npm run dev
```

Сервер по умолчанию стартует на http://localhost:3000

### Шаг 3. Запуск клиента (Vite dev server)

macOS / Linux
```bash
cd client
npm install
npm run dev
```

Windows PowerShell / CMD
```bat
cd client
npm install
npm run dev
```

Примечание: в dev режиме запросы к /api проксируются на сервер через vite.config.js, поэтому CORS обычно не требуется.

## Production-сборка и запуск без dev-сервера

### Шаг 1. Собрать клиент

```bash
cd client
npm run build
```

Проверка результата сборки:
1) Должен появиться файл client/dist/index.html
2) Должна появиться папка client/dist/assets

### Шаг 2. Запустить сервер, который раздаёт сборку клиента

Убедись, что в server/.env выставлено:
CLIENT_BUILD_PATH=../client/dist

Запуск:
```bash
cd server
npm start
```

Открой в браузере:
1) http://localhost:3000/ — SPA
2) http://localhost:3000/goods — защищённая страница

Важно: если ты менял клиентский код, пересобери client (npm run build), иначе сервер будет раздавать старую сборку.

## Проверка API (примеры)

### Логин

Endpoint:
POST /api/login

Body (JSON):
{ "login": "user", "password": "123" }

Ответ (JSON):
{ "token": "<jwt>", "user": { "login": "user" } }

### Список товаров с пагинацией

GET /api/goods?page=1&limit=10

Headers:
Authorization: Bearer <jwt>

### Товар по id

GET /api/goods/1

Headers:
Authorization: Bearer <jwt>

## CI

В репозитории есть GitHub Actions workflow, который запускается на каждый push и pull request:
1) Устанавливает зависимости (client и server)
2) Запускает lint/test, если такие скрипты добавлены
3) Собирает client
4) Проверяет наличие client/dist/index.html

## Команды

### Клиент (client)

1) npm run dev
2) npm run build
3) npm run preview

### Сервер (server)

1) npm run dev
2) npm start

## Лицензия

Учебный проект.
