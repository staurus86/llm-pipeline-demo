# Pipeline Module

Эта директория содержит демонстрационную, но уже модульную структуру LLM/SEO-пайплайна. Она нужна как переходный слой между текущим UI-демо и будущим реальным pipeline.

## Цель

Сейчас проект показывает pipeline в интерфейсе и умеет генерировать runtime-данные через `scripts/pipeline-demo.mjs`. Папка `pipeline/` нужна для того, чтобы:

- разложить логику по отдельным стадиям
- отделить pipeline-слой от UI
- хранить промпты и схемы как отдельные артефакты
- упростить будущий переход к backend orchestration

## Структура

- `lib/` — микро-модули стадий пайплайна
- `prompts/` — шаблоны промптов
- `config/` — схема сущностей и конфиг этапов
- `examples/` — примеры входных и выходных артефактов

## Текущие стадии

1. `import-raw-queries.mjs`
2. `preprocess.mjs`
3. `semantic-parse.mjs`
4. `cluster-and-page-type.mjs`
5. `url-match.mjs`
6. `conflict-detection.mjs`
7. `brief-generator.mjs`

## Что это уже умеет

- принимать demo raw queries
- нормализовать запросы
- строить semantic parse и intent labels
- собирать кластеры
- выбирать типы страниц
- предлагать URL matching actions
- выделять conflict/review cases
- собирать content brief rows

## Что здесь пока demo-only

- rule-based логика вместо реальных LLM вызовов
- фиктивные confidence/cost/pass-rate значения
- локальный JSON runtime вместо очередей, БД и API
- отсутствие persistent state между прогонами, кроме UI localStorage

## Как эволюционировать в production

- заменить rule-based шаги на реальные provider adapters
- вынести состояния pipeline в БД
- добавить job queue и versioned runs
- хранить prompts и schemas в versioned registry
- разделить ingestion, inference, clustering, matching и review как отдельные сервисы

## Связанные файлы

- `../scripts/pipeline-demo.mjs`
- `./config/pipeline-stages.json`
- `./config/entity-schema.json`

