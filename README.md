# tinkoff-robot
Пример торгового робота на Node.js с использованием [Tinkoff Invest Api v2](https://tinkoff.github.io/investAPI/).

* использует комбинацию нескольких сигналов
* работает одновременно с несколькими figi
* учитывает комиссию брокера
* не требует баз данных

## Содержание

<!-- toc -->

- [Подготовка](#%D0%BF%D0%BE%D0%B4%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%BA%D0%B0)
- [Настройка окружения](#%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F)
- [Конфигурация робота](#%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D1%80%D0%BE%D0%B1%D0%BE%D1%82%D0%B0)
- [Описание стратегии](#%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%B5%D0%B3%D0%B8%D0%B8)
- [Запуск на исторических данных](#%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D0%BD%D0%B0-%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85)
- [Запуск на рыночных данных](#%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D0%BD%D0%B0-%D1%80%D1%8B%D0%BD%D0%BE%D1%87%D0%BD%D1%8B%D1%85-%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85)
- [Визуализация](#%D0%B2%D0%B8%D0%B7%D1%83%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)
- [Деплой](#%D0%B4%D0%B5%D0%BF%D0%BB%D0%BE%D0%B9)
- [Связанные проекты](#%D1%81%D0%B2%D1%8F%D0%B7%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B)
- [Лицензия](#%D0%BB%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F)

<!-- tocstop -->

## Подготовка
1. Склонируйте репозиторий
   ```
   git clone https://github.com/vitalets/tinkoff-robot.git
   ```
2. Установите зависимости
   ```
   cd tinkoff-robot && npm ci
   ```

## Настройка окружения
Создайте в корне файл `.env` и положите в него [токен](https://tinkoff.github.io/investAPI/token/) и номера счетов:
```
# Тинькоф API токен
TINKOFF_API_TOKEN=...
# ID боевого счете
REAL_ACCOUNT_ID=...
# ID счета в песочнице
SANDBOX_ACCOUNT_ID=...
```

> Для создания счета в песочнице запустите: `npx ts-node-esm scripts/create-account.ts`

> Для просмотра информации по всем счетам запустите: `npm run accounts`

## Конфигурация робота
Конфиг находится в файле [src/config.ts](src/config.ts), все поля с комментариями.
Роботу можно одновременно задать несколько figi с разными параметрами стратегии.

## Описание стратегии
Cтратегия использует комбинацию 3-х сигналов на покупку / продажу:

* отклонение текущей цены (takeProfit / stopLoss)
* пересечение скользящих средних (SMA)
* индекс относительной силы (RSI)

Сейчас используется простейший вариант - если сработал хотя бы один сигнал, применяем его.

После срабатывания сигнала проверяется достаточно ли средств для этого действия.
Если средств достаточно, выставляется лимит-заявка.
При повторном сигнале заявка перевыставляется с более актуальной ценой.
Также алгоритм сейчас действует аккуратно: больше инструмент уже куплен, то дополнительно он не докупается.

## Запуск на исторических данных
Проверка робота на исторических данных сделана с помощью [tinkoff-local-broker](https://github.com/vitalets/tinkoff-local-broker).

1. [Запустите](https://github.com/vitalets/tinkoff-local-broker#запуск-сервера) локальный брокер в отдельном окне терминала
2. Установите нужный диапазон дат в файле `scripts/run-bakctest.ts`
3. Запустите
   ```
   npm run backtest
   ```

<details>
<summary>Примерный вывод:</summary>

```
[robot]: Запуск робота (песочница)
[portfolio]: Позиции загружены: 1
[portfolio]:      BBG004731354 1 x 401.05
[orders]: Заявки загружены: 0
[instrument_BBG004731354]: Загружаю 31 свечей для ROSN ...
[instrument_BBG004731354]: Свечи загружены: 525, текущая цена: 409
[strategy_BBG004731354]: Сигналы: profit=wait, rsi=wait, sma=wait (29.04.2022, 18:49:00)
Операции:
     29.04.2022, 15:54:00 Покупка ЦБ BBG004731354 (1) -404.3 rub
     29.04.2022, 16:04:00 Продажа ЦБ BBG004731354 (1) 403.95 rub
     29.04.2022, 16:35:00 Покупка ЦБ BBG004731354 (1) -404.05 rub
     29.04.2022, 17:11:00 Продажа ЦБ BBG004731354 (1) 406.1 rub
     29.04.2022, 18:11:00 Покупка ЦБ BBG004731354 (1) -408.9 rub
Прибыль: -0.010868%
```
</details>

## Запуск на рыночных данных
Запуск робота на рыночных данных возможен в разных вариантах: по расписанию, либо в виде постоянного процесса.
На длинных таймфреймах (>1мин) лучше запускать по расписанию.

Запуск робота в песочнице:
```
npm run market
```

Запуск робота на реальном счете:
```
npm run market:real
```

Также доступны еще два флага:
* `--dry-run` - в этом случае производятся все действия кроме создания заявок (даже на боевом счете)
* `--cron` - разовый запуск, а не процесс

Пример: разовый запуск робота на реальном счете без создания заявок:
```
npm run market:real -- --dry-run --cron
```

## Визуализация
Для визуализации работы стратегии после прогона на исторических данных формируется график сигналов.
Открыть график можно командой:
```
npm run chart
```

Пример графика:
![image](https://user-images.githubusercontent.com/1473072/169903600-3996ffbb-a980-4578-ae43-e5f2e5205dff.png)

## Деплой
Деплой робота в виде serverless-функции на [Яндекс.Облако](https://cloud.yandex.ru/), запускаемой по расписанию:

1. Установите и настройте [yc-cli](https://cloud.yandex.ru/docs/cli/quickstart)
2. Создайте [сервисный аккаунт](https://cloud.yandex.ru/docs/iam/operations/sa/create) `tinkoff-robot-sa` и выдайте ему роль `serverless.functions.invoker`
3. Запустите деплой функции:
   ```bash
   npm run deploy
   ```
4. Создайте [триггер типа таймер](https://cloud.yandex.ru/docs/functions/concepts/trigger/timer) с cron-выражением `0/5 7-16 ? * 2-6 *` - запуск **каждые 5 минут с 10 до 19 (msk) по будням**. В качестве функции укажите триггеру `tinkoff-robot`
5. Проверьте в логах функции, что вызовы происходят

В последующем для деплоя новой версии достаточно вызвать:
```
npm run deploy
```

## Связанные проекты
* [tinkoff-invest-api](https://github.com/vitalets/tinkoff-invest-api) - Node.js SDK для работы с Tinkoff Invest API
* [tinkoff-local-broker](https://github.com/vitalets/tinkoff-local-broker) - Локальный сервер для тестирования торговых роботов
* [debut-js/Indicators](https://github.com/debut-js/Indicators) - Расчет индикаторов

## Лицензия
Apache 2.0