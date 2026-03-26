# LLM Pipeline Demo

Интерактивный демо-проект по теме `semantic demand -> clustering -> page type -> H1 -> URL -> AI visibility`.

## Что внутри

- одностраничный React/Vite интерфейс с demo data
- визуализация этапов LLM-pipeline
- пример маршрута одного кластера от сырого запроса до URL
- блоки по site architecture, QA и prompt pack
- готовая конфигурация для деплоя на Railway

## Локальный запуск

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run start
```

Railway использует `railway.json` и команду `npm run start`, которая раздает папку `dist`.
