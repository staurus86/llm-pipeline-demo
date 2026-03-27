# LLM Pipeline Demo

Интерактивное демо SEO/LLM-пайплайна: от сырых поисковых запросов к кластерам, типам страниц, структуре сайта, URL-сопоставлению и контент-брифам.

Проект сделан как наглядная витрина процесса `semantic demand -> clustering -> page type -> H1 -> URL -> AI visibility`. Это не production-сервис и не backend-система, а визуальный walkthrough, который удобно показывать клиенту, команде или использовать для презентаций и скриншотов.

## GitHub Description

`Interactive React demo of an SEO/LLM pipeline: semantic demand, clustering, page typing, URL matching, and AI visibility workflow.`

## Что показывает демо

- импорт батчей запросов из demo dataset
- очистку и нормализацию сырого спроса
- semantic parsing: сущности, атрибуты, интенты, geo
- кластеризацию в page-intent units
- выбор типа страницы и H1
- сопоставление с существующими URL
- очередь ручной проверки для конфликтных кейсов
- финальные контент-брифы для SEO и редакции
- условную LLM Studio с моделями, версиями промптов и schema outputs

## Что внутри репозитория

- `src/App.tsx` — основной интерфейс демо-консоли
- `src/data.ts` — встроенный набор демонстрационных данных
- `scripts/pipeline-demo.mjs` — локальный генератор runtime-данных из demo dataset
- `data/demo-raw-queries.json` — исходный набор демо-запросов
- `public/demo-run.json` — runtime-результат после `npm run pipeline:demo`
- `railway.json` — конфигурация деплоя на Railway

## Стек

- React 19
- TypeScript
- Vite
- Lucide React
- `serve` для production-раздачи `dist`

## Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Локальный UI без генерации runtime-данных

Если нужен только интерфейс для просмотра и скриншотов:

```bash
npm run dev
```

По умолчанию приложение откроется на `http://127.0.0.1:5173/`.

### 3. Полный демо-прогон пайплайна

Скопируйте переменные окружения:

```bash
cp .env.example .env
```

Для PowerShell:

```powershell
Copy-Item .env.example .env
```

Заполните хотя бы один ключ:

- `OPENAI_API_KEY`
- `CEREBRAS_API_KEY`

После этого выполните:

```bash
npm run pipeline:demo
npm run dev
```

Скрипт сгенерирует `public/demo-run.json`, и интерфейс подхватит runtime-результат при загрузке.

## Переменные окружения

Пример содержимого `.env.example`:

```env
OPENAI_API_KEY=sk-your-demo-key
CEREBRAS_API_KEY=
LLM_PROVIDER=OpenAI
LLM_MODEL=gpt-5.4-mini
```

Важно:

- в текущем демо скрипт проверяет наличие ключа, но не поднимает реальную backend-интеграцию
- экран настроек в UI сохраняет значения только в `localStorage` браузера
- для production-версии нужен backend и нормальное хранилище секретов

## Доступные команды

```bash
npm run dev
npm run build
npm run start
npm run preview
npm run pipeline:demo
npm run lint
```

## Production и Railway

Сборка:

```bash
npm run build
```

Локальный запуск production-сборки:

```bash
npm run start
```

Railway использует:

- `railway.json`
- `npm run start`
- статическую раздачу папки `dist`

## Ограничения демо

- нет backend API
- нет базы данных
- нет реального secret vault
- нет авторизации и ролей
- данные частично встроены в `src/data.ts`
- runtime-скрипт работает как имитация пайплайна, а не как полнофункциональный orchestration layer

## Для кого этот проект

- SEO-специалисты
- product/marketing teams
- агентства
- контент-редакторы
- разработчики AI/LLM workflow interfaces
- команды, которым нужен наглядный UI для объяснения логики построения спроса и структуры сайта

## Документация

- [Обзор пайплайна](./docs/PIPELINE.md)
- [Запуск и деплой](./docs/DEPLOYMENT.md)
- [Contributing](./CONTRIBUTING.md)

## Автор

Кириченко Станислав Юрьвич  
Сайт: https://sk-seo.ru/
