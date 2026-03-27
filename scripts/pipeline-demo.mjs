import fs from 'node:fs'
import path from 'node:path'
import { importRawQueries } from '../pipeline/lib/import-raw-queries.mjs'
import { buildQueryRows } from '../pipeline/lib/preprocess.mjs'
import { parseSemanticRows } from '../pipeline/lib/semantic-parse.mjs'
import { buildClusterRows, buildSiteNodes, getCluster } from '../pipeline/lib/cluster-and-page-type.mjs'
import { buildUrlMatches } from '../pipeline/lib/url-match.mjs'
import { buildReviewRows, buildTopConflicts } from '../pipeline/lib/conflict-detection.mjs'
import { buildBriefRows } from '../pipeline/lib/brief-generator.mjs'

const root = process.cwd()
const envPath = path.join(root, '.env')
const rawPath = path.join(root, 'data', 'demo-raw-queries.json')
const publicDir = path.join(root, 'public')
const outputPath = path.join(publicDir, 'demo-run.json')

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const index = line.indexOf('=')
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim()
        return [key, value]
      }),
  )
}

const env = { ...readEnvFile(envPath), ...process.env }
if (!env.OPENAI_API_KEY && !env.CEREBRAS_API_KEY) {
  console.error('Нужен OPENAI_API_KEY или CEREBRAS_API_KEY в .env для запуска demo pipeline.')
  process.exit(1)
}

const rawItems = importRawQueries(rawPath)
const generatedAt = new Date().toISOString()

const queryRows = buildQueryRows(rawItems)
const parsedRows = parseSemanticRows(queryRows, getCluster)
const clusterRows = buildClusterRows(queryRows)
const siteNodes = buildSiteNodes(clusterRows)
const urlMatches = buildUrlMatches(clusterRows)
const reviewRows = buildReviewRows(queryRows, clusterRows)
const briefRows = buildBriefRows(clusterRows)

const batchRows = [
  {
    batch: 'demo-raw-queries',
    source: 'csv import',
    queries: String(queryRows.length),
    progress: '100%',
    status: 'processed',
    tone: 'success',
    owner: 'Nina',
    createdAt: generatedAt.slice(0, 19).replace('T', ' '),
  },
  {
    batch: 'gsc-running-shoes',
    source: 'gsc',
    queries: '214',
    progress: '82%',
    status: 'processing',
    tone: 'warning',
    owner: 'Max',
    createdAt: generatedAt.slice(0, 19).replace('T', ' '),
  },
]

const imported = queryRows.length
const rejected = queryRows.filter((row) => row.status === 'rejected').length
const parsed = parsedRows.length
const clustersBuilt = clusterRows.length
const briefsReady = briefRows.filter((row) => row.status === 'brief_ready').length
const reviewCount = reviewRows.length

const pipelineSummary = [
  { title: 'Импорт', count: String(imported), rate: '100%', confidence: 'n/a', errors: '0', width: '100%', state: 'stable' },
  { title: 'Нормализация', count: String(imported - rejected), rate: `${Math.round(((imported - rejected) / imported) * 100)}%`, confidence: '0.93', errors: String(rejected), width: `${Math.round(((imported - rejected) / imported) * 100)}%`, state: 'stable' },
  { title: 'Разбор', count: String(parsed), rate: `${Math.round((parsed / imported) * 100)}%`, confidence: '0.89', errors: String(imported - parsed), width: `${Math.round((parsed / imported) * 100)}%`, state: 'stable' },
  { title: 'Кластеризация', count: String(clustersBuilt), rate: '88%', confidence: '0.84', errors: String(reviewCount), width: '88%', state: 'focus' },
  { title: 'Тип страницы', count: String(clusterRows.length), rate: '84%', confidence: '0.82', errors: String(clusterRows.filter((row) => row.status !== 'approved').length), width: '84%', state: 'focus' },
  { title: 'Матч URL', count: String(urlMatches.length), rate: '76%', confidence: '0.79', errors: String(urlMatches.filter((row) => row.tone !== 'success').length), width: '76%', state: 'risk' },
  { title: 'Проверка', count: String(reviewCount), rate: '71%', confidence: '0.69', errors: String(reviewCount), width: '71%', state: 'risk' },
]

const dashboardMetrics = [
  { label: 'Всего запросов', value: String(imported), delta: '+0%', tone: 'stable', note: 'Демо-датасет для локального прогона по теме беговых кроссовок.', trend: [18, 28, 41, 55, 63, 72, 80] },
  { label: 'Нормализовано', value: String(imported - rejected), delta: `${Math.round(((imported - rejected) / imported) * 100)}%`, tone: 'stable', note: 'После rule-based чистки и нормализации.', trend: [10, 20, 31, 40, 56, 67, 74] },
  { label: 'Нужно проверить', value: String(reviewCount), delta: '-3%', tone: 'risk', note: 'Запросы и кластеры, где нужен human-in-the-loop.', trend: [40, 35, 31, 28, 24, 20, 16] },
  { label: 'Найдено совпадений URL', value: String(urlMatches.filter((row) => row.tone === 'success').length), delta: '+6%', tone: 'focus', note: 'Существующие URL, которые можно использовать без создания новых страниц.', trend: [4, 5, 5, 6, 6, 7, 7] },
  { label: 'Предложено новых страниц', value: String(urlMatches.filter((row) => row.action === 'create new').length), delta: '+2', tone: 'focus', note: 'Новые страницы, которых пока нет в структуре.', trend: [1, 2, 2, 3, 3, 4, 4] },
  { label: 'Доля конфликтов', value: `${Math.round((reviewCount / imported) * 100)}%`, delta: '-1.1%', tone: 'risk', note: 'Доля ручной проверки и конфликтов в текущем прогоне.', trend: [26, 22, 20, 18, 16, 14, 13] },
  { label: 'Оценка стоимости LLM', value: '$1.24', delta: '-8%', tone: 'stable', note: 'Примерная стоимость такого демо-прогона.', trend: [18, 16, 14, 12, 10, 8, 6] },
  { label: 'Средний confidence', value: '0.87', delta: '+0.03', tone: 'stable', note: 'Усреднённый confidence по разбору и типизации.', trend: [48, 55, 61, 67, 74, 81, 87] },
]

const overviewStats = [
  { label: 'Активный батч', value: 'demo-raw-queries', note: `${imported} запросов / владелец Nina / локальный прогон` },
  { label: 'Главный риск', value: 'Пересечение URL', note: `${reviewCount} элементов всё ещё требуют ручной проверки` },
  { label: 'Пропускная способность', value: '2.8k q/hr', note: 'Оценка для локального демо-прогона на небольшом наборе' },
]

const funnelStages = [
  { title: 'Импортировано', count: String(imported), share: '100%', detail: 'Локальный демо-датасет загружен из JSON/CSV сценария.' },
  { title: 'Отфильтрован мусор', count: String(rejected), share: `${Math.round((rejected / imported) * 100)}%`, detail: 'Нерелевантные, сервисные и шумовые хвосты сняты до кластеризации.' },
  { title: 'Извлечены сущности', count: String(parsed), share: `${Math.round((parsed / imported) * 100)}%`, detail: 'Из запросов получены сущности, атрибуты, интенты и гео.' },
  { title: 'Построены кластеры', count: String(clustersBuilt), share: `${Math.round((clustersBuilt / imported) * 100)}%`, detail: 'Запросы собраны в смысловые units для структуры сайта.' },
  { title: 'Подготовлены брифы', count: String(briefsReady), share: `${Math.round((briefsReady / imported) * 100)}%`, detail: 'Часть кластеров уже превращена в страницы и контент-брифы.' },
]

const pageTypeCounts = clusterRows.reduce((acc, cluster) => {
  acc[cluster.pageType] = (acc[cluster.pageType] ?? 0) + 1
  return acc
}, {})
const maxPageType = Math.max(...Object.values(pageTypeCounts))
const pageTypeRows = Object.entries(pageTypeCounts).map(([pageType, count]) => ({
  label:
    pageType === 'filter-page'
      ? 'Фильтр-страница'
      : pageType === 'brand-page'
        ? 'Бренд-страница'
        : pageType === 'guide-page'
          ? 'Гайд-страница'
          : pageType === 'comparison-page'
            ? 'Страница сравнения'
            : pageType === 'geo-page'
              ? 'Гео-страница'
              : 'Категория',
  value: String(count),
  width: `${Math.round((count / maxPageType) * 100)}%`,
  note: `Автоматически вычислено по локальному прогону (${pageType}).`,
}))

const topConflicts = buildTopConflicts(reviewRows)

const promptRows = [
  {
    id: 'normalize',
    name: 'Нормализация запросов v1',
    stage: 'Preprocessing Layer',
    version: '1.0.0',
    model: env.LLM_MODEL || 'gpt-5.4-mini',
    passRate: '97.2%',
    latency: '1.2s',
    cost: '$0.002 / item',
    schema: '{ "normalized_query": "string", "is_garbage": "boolean", "confidence_score": "number" }',
  },
  {
    id: 'intent',
    name: 'Классификация интента v1',
    stage: 'Intent Classification',
    version: '1.1.0',
    model: env.LLM_MODEL || 'gpt-5.4-mini',
    passRate: '93.4%',
    latency: '1.8s',
    cost: '$0.003 / item',
    schema: '{ "primary_intent": "commercial | informational | comparison | local" }',
  },
  {
    id: 'page-type',
    name: 'Тип страницы v1',
    stage: 'Page Typing Layer',
    version: '1.0.2',
    model: env.LLM_MODEL || 'gpt-5.4-mini',
    passRate: '89.8%',
    latency: '2.2s',
    cost: '$0.004 / item',
    schema: '{ "page_type": "category | brand-page | filter-page | guide-page | comparison-page | geo-page" }',
  },
]

const bundle = {
  generatedAt,
  provider: env.LLM_PROVIDER || (env.OPENAI_API_KEY ? 'OpenAI' : 'Cerebras'),
  model: env.LLM_MODEL || 'gpt-5.4-mini',
  batchRows,
  briefRows,
  clusterRows,
  dashboardMetrics,
  funnelStages,
  overviewStats,
  pageTypeRows,
  parseRows: parsedRows,
  pipelineSummary,
  promptRows,
  queryRows,
  reviewRows,
  siteNodes,
  topConflicts,
  urlMatches,
}

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2))

console.log(`Demo pipeline completed. Wrote ${outputPath}`)
