# alef-back

Первая основа

1. WebSocket (модуль WS)
2. Заложен бек мессенджера (модуль MesSendo)
3. Добавлен BotUser - Ollama + chatOllama

### migrations

Ручная: `npm run migration:create -- ./src/common/db/migrations/createRoom` Модификация: `npm run migration:generate -- ./src/common/db/migrations/modyRoom` Выполнение: `npm run migration:run`

## Подробности

### 1.Таблицы и entities

#### rooms

    `Предназначена для хранения участников общения.`
    `Аутентифицированный участник через userId получает структуру групп-пользователей для общения`

    - id: number; (id)
    - name: string (Имя аутентифицированнонго пользователя);
    - userId: number; (Id аутентифицированного пользователя);
    - groups: number[]; (Id группы участников общения)
    - users: number[]; ((допустимый набор Id участников общения для группы))
    - channels: number[];(Id канала - на будущее)
    - active: number; (активность кабинета, кабинетов м.б. несколько, но активный всегда один)
    - dateCreate: Date; (дата создания)

#### groups

    `Группы общения. в группе всегда присутствует не менее 2 участников. Всегда хотя бы один не забанен.`
    `Сообщения всегда привязаны к группе`

    - id: number; (Id группы участников общения)
    - nameGroup: string; (наименование группы участников общения)
    - typeGroup: string; (Тип группы участников общения - public | private | hidden)
    - userId: number; (Инициатор (id) образования группы участников общения)
    - users: number[]; (id участников группы)
    - moderators: number[]; (id модераторов группы)
    - active: number; (актовность: 1 - активна, 0 - удалена )
    - readOnly: number; (группа может только видеть, общение не возможно - бан группы)
    - dateCreate: Date; (дата создания)

#### users

    `участники группы.`
    `роли:
        "admin" - администратор (главный и резервный)
        "owner" - владелец кабинета, модератор
        "user" - пользователь с правами общения, скачивания, обновления, удаления сообщений
        "guest" - только просмотр`
		"bot"	- botUser (llama3)

    - id: number; (Id участника общения)
    - login: string; (логин)
    - password: string; (пароль)
    - fio: string; (ФИО)
    - email: string; (почта)
    - token: string; (не используется)
    - salt: number; (не используется)
    - token_expare: number; (не используется)
    - roles: string[]; (роли: "admin", "owner", "user", "guest")
    - active: number; (актовность: 1 - активна, 0 - удалена )

#### contents

    `контент общения. Привязан к группе`

    - "id" SERIAL NOT NULL, (id контента)
    - "groupId" integer NOT NULL, (привязка к группе)
    - "userId" integer NOT NULL, (id участника, от имени которого передаётся сообщение)
    - "message" text NOT NULL DEFAULT '', (сообщение)
    - "active" integer NOT NULL DEFAULT '1', (актовность: 1 - активна, 0 - удалена )
    - "dateCreate" TIMESTAMP NOT NULL DEFAULT 'now', (дата создания)

