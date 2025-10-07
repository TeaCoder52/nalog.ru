# Nalog.ru

TypeScript SDK для работы с API ЛКНПД (https://lknpd.nalog.ru/), позволяющий:

- создавать доходы
- получать информацию о чеках
- получать ссылки на печать чеков
- отменять доходы
- работать с различными способами авторизации

SDK построен на axios и полностью типизирован через TypeScript.

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
