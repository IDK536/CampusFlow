# CampusFlow

Веб-сервис бронирования университетских аудиторий. Студенты ищут свободные помещения, создают и отменяют свои брони. Администратор управляет аудиториями, просматривает все бронирования и статистику.

## Быстрый запуск с нуля через Docker

Нужны Git, запущенный Docker с Linux-контейнерами и Docker Compose.

```sh
git clone --branch develop https://github.com/IDK536/CampusFlow.git
cd CampusFlow
```

1. Скопируйте [Backend/.env.example](Backend/.env.example) в `Backend/.env`, если своего файла ещё нет.
2. Замените `Jwt__Key` случайным секретом минимум из 32 байт UTF-8. Для HTTP оставьте `Auth__CookieSecure=false`, для московского времени — `TZ=Europe/Moscow`.
3. Из корня проекта выполните:

```sh
docker compose run --build --rm init
docker compose up --build -d
```

Первая команда применяет миграции и дополняет тестовые данные, затем завершается. Вторая запускает приложение с настоящим API и PostgreSQL. Интерфейс: **http://localhost:3008**.

Строка подключения к контейнеру БД задаётся в [compose.yaml](compose.yaml) и перекрывает значение из `.env`. Секреты в Git не добавляйте.

Остановка с сохранением данных:

```sh
docker compose down
```

Повторный запуск — `docker compose up -d`; после изменения кода — `docker compose up --build -d`. Не добавляйте `--volumes` к остановке, если хотите сохранить данные.

Обычный API не запускает миграции или seed автоматически. После изменения схемы их нужно применить отдельно. Повторный `init` применит миграции и дополнит seed; при запуске в другой день он может добавить брони на новые даты. Для обновления только схемы нужен отдельный запуск EF Core migrations без seed.

## Тестовые пользователи

| Логин | Пароль | Роль |
|---|---|---|
| `student1` | `student1` | Студент |
| `student2` | `student2` | Студент |
| `admin` | `admin` | Администратор |

Первое заполнение создаёт 12 аудиторий, 3 пользователей и 6 броней. Seed сохраняет существующие записи; ID генерирует БД. Кнопка сброса mock-данных во фронте не очищает PostgreSQL.

## Основной API

Base URL: `/api`. Через общий запуск запросы доступны по адресу `http://localhost:3008/api/...`.

Полный список endpoints, параметры и форматы ответов находятся в Swagger. В текущем Compose nginx проксирует только `/api`, поэтому для открытия Swagger запустите дополнительный экземпляр API в отдельном терминале:

```sh
docker compose run --rm --no-deps -p 8080:8080 backend
```

- Swagger UI: **http://localhost:8080/swagger**.
- OpenAPI: **http://localhost:8080/swagger/v1/swagger.json**.

Порт 8080 должен быть свободен. `Ctrl+C` остановит дополнительный экземпляр. Защищённые методы используют access JWT из ответа `/api/auth/login`; в Swagger вставьте токен через Authorize.

### Контракты

JSON UTF-8; даты `YYYY-MM-DD`, время `HH:MM`, события истории — ISO 8601 UTC. Защищённые запросы используют `Authorization: Bearer <token>`. Пути ниже добавляются к `/api`; подробная валидация и правила — в Swagger.

| Метод | Путь | Параметры / тело | Успешный ответ |
|---|---|---|---|
| POST | `/auth/login` | `{login, password}` | `200 {token, user:User}` + refresh-cookie |
| POST | `/auth/refresh` | Refresh-cookie | `200 {token, user:User}` + новая cookie |
| POST | `/auth/logout` | Cookie, если есть | `204` |
| GET | `/rooms` | q, building, floor, minCapacity, equipment, date, startTime, endTime, minDuration | `200 Room[]`; с date — `RoomList` |
| GET | `/rooms/{id}` | id | `200 Room` |
| GET | `/rooms/{id}/free-slots` | id, обязательная date | `200 {roomId, date, serverTime, utcOffset, freeSlots:Slot[]}` |
| POST | `/bookings` | `BookingInput` | `201 Booking` |
| GET | `/bookings/my` | status, scope | `200 Booking[]` |
| DELETE | `/bookings/{id}` | id | `200 {id, status:"cancelled"}` |
| GET | `/admin/users` | — | `200 User[]` |
| GET | `/admin/bookings` | q, date, dateFrom, dateTo, building, roomId, userId, status, sort, limit, offset | `200 Booking[]`; заголовки `X-Total-Count`, `X-Active-Count` |
| DELETE | `/admin/bookings/{id}` | id | `200 {id, status:"cancelled"}` |
| POST | `/admin/rooms` | `RoomInput` | `201 Room` + Location |
| PUT | `/admin/rooms/{id}` | id, `RoomInput` | `200 Room` |
| DELETE | `/admin/rooms/{id}` | id | `204` |
| GET | `/admin/stats` | Обязательные dateFrom/dateTo; необязательный building | `200 Stats` |

| Модель | Поля |
|---|---|
| `User` | `id:int`, `login:string`, `displayName:string`, `role:student/admin` |
| `Room` | `id:int`, `name:string`, `building:string`, `floor:int`, `capacity:int`, `equipment:string[]`; для подтверждённого admin также `activeBookings:int`, `hasBookings:bool` |
| `Slot` | `startTime:string`, `endTime:string` |
| `RoomList` | `date:string`, `serverTime:UTC`, `utcOffset:int`, `rooms:[Room + {freeSlots:Slot[]}]` |
| `Booking` | `id:int`, `roomId:int`, `roomName:string`, `userId:int`, `userDisplayName:string`, `date:string`, `startTime:string`, `endTime:string`, `status:active/cancelled`, `comment:string/null`, `createdAt:UTC/null`, `cancelledAt:UTC/null`, `cancelledBy:owner/admin/null` |
| `BookingInput` | Обязательные `roomId:int`, `date:string`, `startTime:string`, `endTime:string`; необязательный `comment:string/null` |
| `RoomInput` | Все обязательны: `name:string`, `building:string`, `floor:int`, `capacity:int`, `equipment:string[]` |
| `Stats` | `totals:{bookings, minutes, percent}`, `byBuilding:[{building, rooms, minutes, percent}]`, `byDay:[{date, bookings, minutes, percent}]`, `cells:[{building, date, bookings, minutes, capacityMinutes, percent}]`, `byHalfHour:number[]`, `topRooms:[{roomId, name, minutes, bookings}]` |

Значения параметров: building — A–D; equipment — projector/whiteboard/computers/audio/video через запятую; status — active/cancelled; scope — upcoming/past; sort — date/-date/room. limit — целое 1–100, offset — целое >= 0, minDuration — минуты >= 30, кратные 30. Остальные числовые фильтры и ID — положительные целые.

Заголовки времени: `X-Server-Time` (UTC), `X-Server-Utc-Offset` (минуты). Ошибки: `{code:string, message:string, details:object/null}`; возможные статусы — 400, 401, 403, 404, 409. Пустой административный 404 и успешный 204 не содержат JSON.

## Ограничения

- Бронирование: 09:00–18:00, шаг 30 минут; начало в прошлом запрещено. Время определяется локальной зоной API.
- Пересечение активных броней возвращает `409`; смежные интервалы разрешены. Чужая отмена студентом — `403`.
- Администратор не создаёт брони. Административные маршруты до подтверждения JWT и актуальной роли возвращают пустой `404`.
- Аудиторию с любой историей броней удалить нельзя. Отмена сохраняет запись и освобождает время.
- Refresh-cookie общая для вкладок одного браузерного профиля. Для одновременной работы разными пользователями используйте разные профили или браузеры.
- Часть расширений API ещё не подключена к интерфейсу; некоторые фильтры и аналитика считаются на фронте. Mock-режим не проверяет реальный API.
- Интеграции с расписанием вуза нет. При доступе с другого адреса или порта нужно обновить разрешённые `Auth__AllowedOrigins` в настройках API.

## Тесты

Для backend нужны .NET SDK 10 и отдельная существующая БД `campusflow_test`. Укажите её строку подключения в `CAMPUSFLOW_TEST_CONNECTION` в `Backend/.env` или окружении. Тесты применяют миграции и удаляют собственные данные; рабочая БД не используется.

```sh
dotnet test Backend/CampusFlow.slnx --configuration Release
```

Текущий Compose не публикует PostgreSQL наружу: для тестов на хосте нужна доступная с хоста тестовая БД. Разработка и проверки фронта описаны в [client/README.md](client/README.md).
