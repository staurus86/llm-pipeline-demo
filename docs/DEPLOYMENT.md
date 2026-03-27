# Deployment And Local Run

## Локальный запуск

### Только интерфейс

```bash
npm install
npm run dev
```

Адрес по умолчанию:

`http://127.0.0.1:5173/`

### Интерфейс плюс runtime demo pipeline

```bash
npm install
cp .env.example .env
npm run pipeline:demo
npm run dev
```

Для PowerShell:

```powershell
Copy-Item .env.example .env
```

## Зачем нужен `.env`

Скрипт `pipeline:demo` ожидает, что в окружении будет указан хотя бы один ключ:

- `OPENAI_API_KEY`
- `CEREBRAS_API_KEY`

Это ограничение добавлено как часть симуляции реального LLM workflow. Сам демо-скрипт не превращает проект в production-integrated систему.

## Production build

```bash
npm run build
npm run start
```

`npm run start` раздаёт директорию `dist` через `serve`.

## Railway

В репозитории уже есть `railway.json` со следующей логикой:

- сборка через Nixpacks
- стартовая команда `npm run start`
- политика рестартов `ON_FAILURE`

### Базовый сценарий деплоя

1. Подключить репозиторий к Railway.
2. Убедиться, что Railway видит Node/Vite-проект.
3. При необходимости добавить env vars.
4. Дождаться build.
5. Проверить, что `npm run build` создаёт `dist`, а `npm run start` успешно поднимает раздачу.

## Что деплоится фактически

Деплоится статическое React/Vite-приложение. Если заранее сгенерирован `public/demo-run.json`, он попадёт в сборку как часть публичных ассетов.

## Рекомендации перед публичным показом

- проверить тексты в demo dataset
- убедиться, что в `localStorage` нет случайных тестовых ключей
- пересобрать приложение после обновления данных
- если нужны стабильные скриншоты, использовать production build вместо hot-reload dev-режима

