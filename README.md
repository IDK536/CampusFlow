# CampusFlow

Сервис бронирования аудиторий (кейс хакатона IBS).

- Frontend: [client/README.md](client/README.md) — запуск, пользователи, сценарии демо, API.
- Docker: `docker compose up --build` → http://localhost:3008

Документация API доступна в Swagger по адресу `/swagger`.
Бэкенд, тесты и инструкция запуска: [Backend](Backend/README.md).

## Локальный запуск в Docker

Порты и пароль локального PostgreSQL заданы в `compose.yaml`. Настройки приложения, включая `Jwt__Key`, задайте в `Backend/.env` по шаблону `Backend/.env.example`. Compose загружает этот файл автоматически и задаёт строку подключения к контейнеру PostgreSQL.

При первом запуске примените миграции и загрузите демонстрационные данные. Команды выполняйте из корня репозитория.

```sh
docker compose run --build --rm init
```

Для запуска фронтенда, API и PostgreSQL используйте следующую команду.

```sh
docker compose up --build -d
```

Swagger доступен по адресу <http://localhost:8081/swagger>. Данные PostgreSQL хранятся в томе `postgres_data`. После обновления схемы повторно выполните команду `init`. Она вызывает `--seed`, поэтому при запуске в другой день может добавить новые демонстрационные брони.

Фронтенд доступен на <http://localhost:3008> и отправляет запросы `/api` на бэкенд через Nginx. Остановить контейнеры с сохранением данных можно командой `docker compose down`.
