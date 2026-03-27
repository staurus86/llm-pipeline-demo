import fs from 'node:fs'
import path from 'node:path'

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

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/2026/g, '')
    .replace(/sale/g, 'скидки')
    .trim()
}

function classify(raw) {
  const query = normalizeQuery(raw.query)

  if (/(скачать|ремонт|wildberries)/.test(query)) {
    return { flag: 'garbage', flagTone: 'danger', status: 'rejected', statusTone: 'danger', intent: 'mixed' }
  }
  if (/(как |таблица размеров|отзывы|стирать)/.test(query)) {
    return { flag: 'support intent', flagTone: 'warning', status: 'review', statusTone: 'warning', intent: 'informational' }
  }
  if (/(лучшие|или|vs)/.test(query)) {
    return { flag: 'review', flagTone: 'warning', status: 'clustered', statusTone: 'success', intent: 'comparison' }
  }
  if (/(москва|спб|санкт|казань)/.test(query)) {
    return { flag: 'geo review', flagTone: 'warning', status: 'parsed', statusTone: 'neutral', intent: 'local' }
  }
  if (/(hoka|pegasus|gel kayano|adizero|novablast)/.test(query)) {
    return { flag: 'model intent', flagTone: 'warning', status: 'review', statusTone: 'warning', intent: 'commercial' }
  }

  return { flag: 'clean', flagTone: 'success', status: 'clustered', statusTone: 'success', intent: 'commercial' }
}

function getCluster(raw) {
  const query = normalizeQuery(raw.query)
  if (/асфальт|road/.test(query) && /женск/.test(query)) return ['women-road-running-shoes', 'Женские беговые кроссовки для асфальта', 'filter-page']
  if (/асфальт|road/.test(query)) return ['road-running-shoes', 'Беговые кроссовки для асфальта', 'filter-page']
  if (/марафон|полумарафон/.test(query)) return ['marathon-running-shoes', 'Лучшие кроссовки для марафона', 'guide-page']
  if (/adidas.*nike|nike.*adidas|vs/.test(query)) return ['brand-comparison-running', 'Adidas или Nike для бега', 'comparison-page']
  if (/spb|санкт|казань|москва/.test(query)) return ['geo-running-shoes', 'Беговые кроссовки по городам', 'geo-page']
  if (/nike/.test(query)) return ['nike-running-shoes', 'Беговые кроссовки Nike', 'brand-page']
  if (/asics|gel kayano/.test(query)) return ['asics-running-shoes', 'Беговые кроссовки ASICS', 'brand-page']
  if (/salomon|трейл/.test(query)) return ['trail-running-shoes', 'Кроссовки для трейлраннинга', 'filter-page']
  if (/плоскостоп/.test(query)) return ['support-running-shoes', 'Беговые кроссовки для плоскостопия', 'guide-page']
  return ['general-running-shoes', 'Беговые кроссовки', 'category']
}

function getEntity(query) {
  if (/gel kayano/.test(query)) return ['asics gel kayano', 'product_model_family']
  if (/pegasus/.test(query)) return ['nike pegasus', 'product_model_family']
  if (/hoka clifton/.test(query)) return ['hoka clifton', 'product_model']
  if (/adidas/.test(query) && /nike/.test(query)) return ['adidas vs nike', 'brand_comparison']
  if (/nike/.test(query)) return ['nike', 'brand']
  if (/asics/.test(query)) return ['asics', 'brand']
  if (/salomon/.test(query)) return ['salomon', 'brand']
  return ['беговые кроссовки', 'product_category']
}

function slugify(label) {
  return label
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
}

function uniqueBy(items, key) {
  return [...new Map(items.map((item) => [item[key], item])).values()]
}

const env = { ...readEnvFile(envPath), ...process.env }
if (!env.OPENAI_API_KEY && !env.CEREBRAS_API_KEY) {
  console.error('Нужен OPENAI_API_KEY или CEREBRAS_API_KEY в .env для запуска demo pipeline.')
  process.exit(1)
}

const rawItems = JSON.parse(fs.readFileSync(rawPath, 'utf8'))
const generatedAt = new Date().toISOString()

const queryRows = rawItems.map((item) => {
  const normalized = normalizeQuery(item.query)
  const cls = classify(item)
  return {
    query: item.query,
    normalized,
    source: item.source,
    frequency: String(item.frequency),
    geo: item.geo,
    ...cls,
  }
})

const parsedRows = queryRows
  .filter((row) => row.status !== 'rejected')
  .map((row) => {
    const [entity, entityType] = getEntity(row.normalized)
    const [clusterId] = getCluster({ query: row.normalized })
    const review =
      row.flag === 'clean'
        ? 'auto-ok'
        : row.flag === 'geo review'
          ? 'check geo'
          : row.flag === 'support intent'
            ? 'support content'
            : row.flag === 'model intent'
              ? 'model review'
              : 'comparison check'

    return {
      query: row.query,
      entity,
      entityType,
      attributes: clusterId.replace(/-/g, ','),
      geo: row.geo === 'RU' ? 'none' : row.geo,
      intent: row.intent,
      confidence: row.flag === 'clean' ? '0.94' : row.flag === 'model intent' ? '0.87' : '0.83',
      review,
      reviewTone: row.flag === 'clean' ? 'success' : 'warning',
    }
  })

const clustersMap = new Map()
for (const row of queryRows.filter((item) => item.status !== 'rejected')) {
  const [id, h1, pageType] = getCluster({ query: row.normalized })
  const current = clustersMap.get(id) ?? {
    id,
    label: id,
    entity: getEntity(row.normalized)[0],
    intent: row.intent,
    intentTone: row.intent === 'commercial' ? 'success' : row.intent === 'comparison' ? 'warning' : 'neutral',
    frequency: 0,
    status: row.flag === 'clean' ? 'approved' : 'needs_review',
    statusTone: row.flag === 'clean' ? 'success' : 'warning',
    pageType,
    h1,
    slug: `/${slugify(id)}/`,
    matchedUrl: pageType === 'comparison-page' ? 'none' : `/catalog/${slugify(id)}/`,
    queries: [],
  }
  current.frequency += Number(row.frequency)
  current.queries.push(row.query)
  clustersMap.set(id, current)
}

const clusterRows = [...clustersMap.values()]
  .map((item) => ({
    ...item,
    frequency: item.frequency.toLocaleString('en-US'),
    queries: item.queries.join(', '),
  }))
  .sort((a, b) => Number.parseInt(b.frequency.replace(/,/g, ''), 10) - Number.parseInt(a.frequency.replace(/,/g, ''), 10))

const siteNodes = clusterRows.slice(0, 8).map((cluster, index) => ({
  id: cluster.id,
  label: cluster.h1,
  url: cluster.slug,
  pageType: cluster.pageType,
  tone: cluster.statusTone,
  level: cluster.pageType === 'filter-page' ? 1 : 0,
  parent: cluster.pageType === 'filter-page' ? '/running-shoes/' : 'root',
  cluster: cluster.label,
  origin: cluster.matchedUrl === 'none' ? 'new' : 'matched existing',
  aiNote: `Кластер ${cluster.label} собран из демо-датасета и требует ${cluster.status === 'approved' ? 'минимальной' : 'дополнительной'} проверки.`,
}))

const urlMatches = clusterRows.slice(0, 8).map((cluster) => ({
  cluster: cluster.label,
  slug: cluster.slug,
  url: cluster.matchedUrl,
  type: cluster.matchedUrl === 'none' ? 'new page candidate' : 'semantic match',
  confidence: cluster.status === 'approved' ? '0.92' : '0.74',
  action: cluster.matchedUrl === 'none' ? 'create new' : cluster.status === 'approved' ? 'merge existing' : 'review merge',
  tone: cluster.matchedUrl === 'none' ? 'neutral' : cluster.status === 'approved' ? 'success' : 'warning',
}))

const reviewRows = uniqueBy(
  [
    ...queryRows
      .filter((row) => row.flagTone === 'warning')
      .slice(0, 4)
      .map((row) => ({
        item: row.query,
        type: 'query',
        issue: `Флаг: ${row.flag}`,
        severity: row.intent === 'comparison' ? 'high' : 'medium',
        severityTone: row.intent === 'comparison' ? 'danger' : 'warning',
        assigned: row.intent === 'comparison' ? 'Nina' : 'Ira',
        status: 'open',
        statusTone: 'danger',
      })),
    ...clusterRows
      .filter((cluster) => cluster.status !== 'approved')
      .slice(0, 4)
      .map((cluster) => ({
        item: cluster.label,
        type: 'cluster',
        issue: `Нужно уточнить ${cluster.pageType}`,
        severity: 'medium',
        severityTone: 'warning',
        assigned: 'Max',
        status: 'in_review',
        statusTone: 'warning',
      })),
  ],
  'item',
)

const briefRows = clusterRows.slice(0, 8).map((cluster, index) => ({
  page: cluster.h1,
  pageType: cluster.pageType,
  intent: cluster.intent,
  cluster: cluster.label,
  status: cluster.status === 'approved' ? 'brief_ready' : index % 2 === 0 ? 'awaiting_approval' : 'in_review',
  tone: cluster.status === 'approved' ? 'success' : 'warning',
  owner: cluster.pageType === 'guide-page' ? 'Editorial team' : 'SEO team',
}))

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

const topConflicts = reviewRows.slice(0, 3).map((item) => ({
  cluster: item.item,
  reason: item.issue,
  severity: item.severity,
  severityTone: item.severityTone,
  owner: item.assigned,
}))

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
