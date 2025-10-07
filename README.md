# Nalog.ru

TypeScript SDK для работы с API ЛКНПД (https://lknpd.nalog.ru/), позволяющий:

- создавать доходы
- получать информацию о чеках
- получать ссылки на печать чеков
- отменять доходы
- работать с различными способами авторизации

SDK построен на axios и полностью типизирован через TypeScript.

# Установка
```bash
npm install nalog.ru
# или
yarn add nalog.ru
# или
pnpm add nalog.ru
```

# Варианты авторизации

SDK поддерживает два рабочих варианта авторизации:

- ИНН + пароль - классический логин, удобно для серверного сценария.
- Номер телефона + SMS - авторизация пользователя по телефону.

## 1) Авторизация через ИНН и пароль

### Шаги

1. Создаём экземпляр ApiClient:

```ts
import { ApiClient } from 'nalog.ru'

const api = new ApiClient() // временно без токена
```

2. Получаем токен:

```ts
const token = await api.createAccessToken('788888877777', 'userPassword')

console.log('Токен создан:', token)

```

3. Передаём полученный accessToken в основной клиент ApiClient, чтобы всюду было авторизовано:

```ts
const api = new ApiClient(accessToken)
```

4. (Опционально) Хранить refreshToken и обновлять токен при истечении срока:

```ts
// когда accessToken истёк
const refreshed = await authorizedApi.refreshAccessToken(refreshToken)
const newAccessToken = typeof refreshed === 'string' ? refreshed : refreshed.accessToken

// снова передаём в ApiClient
authorizedApi.setToken(newAccessToken) // или создаём новый экземпляр
```

## 2) Авторизация через номер телефона + SMS

### Шаги

1. Инициируем challenge (запрос на отправку SMS):

```ts
import { ApiClient } from 'nalog.ru'

const api = new ApiClient() // без токена

const challenge = await api.createPhoneChallenge('77777777777')
console.log('challengeToken:', challenge.challengeToken)
```

2. Вы получаете SMS на указанный номер телефона и вводите код. Затем подтверждаем код и получаем токен:

```ts
// допустим, smsCode — введённый код
const smsCode = '123456'

const data = await api.createAccessTokenByPhone(
  '7920XXXXXXX',
  challenge.challengeToken,
  smsCode.trim()
)

console.log('Токен создан:', data.token)
```

3. Передаём accessToken в ApiClient:

```ts
const api = new ApiClient(accessToken)
```

### Важные замечания

- challengeToken живет 2 минуты - вводите SMS код быстро.

# Работа с доходами

## Создание одного дохода с контрагентом по умолчанию (физ. лицо)

```ts
const income = await api.income.create({
  name: 'Консультация по бухгалтерии', // Наименование
  amount: 1800.30,
  quantity: 1, 
})

console.log('Чек:', income)
```

## Создание дохода с несколькими позициями

```ts
const items = [
  { name: 'Аудиторская проверка', amount: 3200, quantity: 1 },
  { name: 'Сопровождение договора', amount: 1500, quantity: 2 },
]

const income = await api.income.createMultipleItems({
  services: items,
  totalAmount: items.reduce((sum, item) => sum + item.amount * item.quantity, 0),
  paymentType: 'CASH',
  ignoreMaxTotalIncomeRestriction: false,
})

console.log('Чек:', income)
```

## Отмена чека

```ts
const incomeInfo = await api.income.cancel({
  receiptUuid: '20hykdxbp8', // ID чека
  comment: CancelComment.SERVICE_ERROR, // Причина отмены
  partnerCode: null, // Код партнёра (по желанию)
})

console.log('Информация об отмене:', incomeInfo)
```

Для отмены доступны следующие комментарии через enum `CancelComment`:

| Enum             | Описание                     |
|------------------|------------------------------|
| `MISTAKE`        | Чек выдан ошибочно           |
| `RETURN`         | Возврат денежных средств     |
| `SERVICE_ERROR`  | Ошибка сервиса               |

# Работа с чеками

## Получение информации о чеке

```ts
const receipt = await api.receipt.getOne({
  inn: '788888877777',
  receiptId: '123456',
})

console.log('Данные чека:', receipt.data)
```

## Получение ссылки для печати чека

```ts
const printUrl = api.receipt.getPrintUrl({
  inn: '788888877777',
  receiptId: '123456',
})

console.log('Ссылка на печать чека:', printUrl)
```

# Работа с пользователем

## Получение информации о текущем пользователе

Метод getMe возвращает данные пользователя, который авторизован через accessToken:

```ts
const user = await api.user.getMe()

console.log('Данные пользователя:', user)
```
