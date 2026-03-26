export const navItems = [
  { id: 'dashboard', short: '01', label: 'Dashboard', description: 'Здоровье пайплайна, метрики и проблемные зоны.' },
  { id: 'imports', short: '02', label: 'Imports / Batches', description: 'Загрузка, dry run и контроль batch processing.' },
  { id: 'raw', short: '03', label: 'Raw Queries', description: 'Сырой спрос, garbage flags и статус предварительной чистки.' },
  { id: 'parsing', short: '04', label: 'Semantic Parsing', description: 'Entity extraction, structured output и review flags.' },
  { id: 'clusters', short: '05', label: 'Clusters', description: 'Канонические units спроса и decisions по page type.' },
  { id: 'structure', short: '06', label: 'Site Structure', description: 'Как кластеры становятся деревом URL и страниц.' },
  { id: 'matcher', short: '07', label: 'URL Matcher', description: 'Сопоставление кластеров с текущим каталогом URL.' },
  { id: 'prompts', short: '08', label: 'Prompts / LLM Studio', description: 'Версии промтов, модели, schema и pass rate.' },
  { id: 'review', short: '09', label: 'Review Queue', description: 'Human-in-the-loop для спорных или рискованных кейсов.' },
  { id: 'briefs', short: '10', label: 'Content Briefs', description: 'Финальные brief-артефакты для редакции и SEO-команды.' },
]

export const pipelineSummary = [
  { title: 'Import', count: '842', rate: '100%', confidence: 'n/a', errors: '0' },
  { title: 'Normalize', count: '814', rate: '96%', confidence: '0.93', errors: '28' },
  { title: 'Parse', count: '792', rate: '97%', confidence: '0.89', errors: '12' },
  { title: 'Classify', count: '792', rate: '95%', confidence: '0.87', errors: '17' },
  { title: 'Cluster', count: '126', rate: '91%', confidence: '0.84', errors: '9' },
  { title: 'Type Page', count: '118', rate: '89%', confidence: '0.82', errors: '11' },
  { title: 'Match URL', count: '118', rate: '78%', confidence: '0.79', errors: '26' },
  { title: 'Review', count: '34', rate: '73%', confidence: '0.68', errors: '34' },
]

export const dashboardMetrics = [
  { label: 'Total Queries', value: '842', note: 'Одна ниша: беговые кроссовки, бренды, фильтры, geo и comparison.' },
  { label: 'Normalized', value: '814', note: 'После rule-based чистки и LLM normalization.' },
  { label: 'Need Review', value: '34', note: 'Низкий confidence, конфликтный page type или URL overlap.' },
  { label: 'Existing URL Matches', value: '67', note: 'Система не плодит новые страницы без необходимости.' },
  { label: 'New Pages Suggested', value: '51', note: 'Новые category, brand, guide, geo и comparison pages.' },
  { label: 'Conflict Rate', value: '9.4%', note: 'Пересечение кластеров, slug conflicts и mixed intent.' },
  { label: 'LLM Cost Estimate', value: '$7.80', note: 'Оценка пакета при structured output и partial retries.' },
  { label: 'Avg Confidence', value: '0.86', note: 'Средний confidence по parse + classify + page typing.' },
]

export const funnelStages = [
  { title: 'Imported', count: '842', share: '100%', detail: 'CSV + GSC + suggest parser + competitor URLs.' },
  { title: 'Garbage filtered', count: '28', share: '3.3%', detail: 'Шум, дубли и нерелевантные хвосты.' },
  { title: 'Entities extracted', count: '792', share: '94%', detail: 'LLM вернул entity, attributes, geo и intent.' },
  { title: 'Clusters built', count: '126', share: '15%', detail: 'Спрос собран в page intent units.' },
  { title: 'Page candidates', count: '118', share: '14%', detail: '8 кластеров помечены как no-page-needed.' },
]

export const topConflicts = [
  { cluster: 'best-running-shoes', reason: 'guide-page vs comparison-page ambiguity', severity: 'high', severityTone: 'danger', owner: 'Nina' },
  { cluster: 'running-shoes-moscow', reason: 'geo-page overlaps with existing category /moskva/', severity: 'medium', severityTone: 'warning', owner: 'Max' },
  { cluster: 'nike-air-zoom', reason: 'brand-page collides with existing model filter', severity: 'medium', severityTone: 'warning', owner: 'Ira' },
]

export const pageTypeRows = [
  { label: 'Filter Page', value: '38', width: '100%', note: 'Road, cushioning, men, women, marathon.' },
  { label: 'Brand Page', value: '24', width: '63%', note: 'Nike, Adidas, Asics, Hoka.' },
  { label: 'Guide Page', value: '19', width: '50%', note: 'How to choose, best models, FAQ.' },
  { label: 'Geo Page', value: '14', width: '37%', note: 'Moscow, SPb and city intent.' },
  { label: 'Comparison Page', value: '9', width: '24%', note: 'Brand vs brand and model family comparisons.' },
]

export const batchRows = [
  { batch: 'spring-running-shoes-01', source: 'csv import', queries: '842', progress: '100%', status: 'processed', tone: 'success', owner: 'Nina', createdAt: '2026-03-26 10:20' },
  { batch: 'competitor-urls-mar-24', source: 'url parser', queries: '214', progress: '76%', status: 'processing', tone: 'warning', owner: 'Max', createdAt: '2026-03-25 17:04' },
  { batch: 'gsc-brand-tail-q1', source: 'gsc', queries: '1,124', progress: '100%', status: 'processed', tone: 'success', owner: 'Ira', createdAt: '2026-03-24 09:11' },
  { batch: 'manual-corrections-geo', source: 'manual', queries: '39', progress: '0%', status: 'draft', tone: 'neutral', owner: 'Lena', createdAt: '2026-03-26 14:46' },
]

export const queryRows = [
  { query: 'купить беговые кроссовки nike москва', normalized: 'беговые кроссовки nike москва', source: 'gsc', frequency: '320', geo: 'Moscow', flag: 'clean', flagTone: 'success', status: 'parsed', statusTone: 'neutral' },
  { query: 'лучшие беговые кроссовки для асфальта', normalized: 'лучшие беговые кроссовки для асфальта', source: 'suggest', frequency: '210', geo: 'RU', flag: 'review', flagTone: 'warning', status: 'clustered', statusTone: 'success' },
  { query: 'кроссовки для бега по асфальту мужские', normalized: 'беговые кроссовки для асфальта мужские', source: 'csv', frequency: '180', geo: 'RU', flag: 'clean', flagTone: 'success', status: 'clustered', statusTone: 'success' },
  { query: 'nike air zoom марафон отзывы', normalized: 'nike air zoom марафон отзывы', source: 'gsc', frequency: '70', geo: 'RU', flag: 'mixed intent', flagTone: 'warning', status: 'review', statusTone: 'warning' },
  { query: 'скачать беговые кроссовки', normalized: 'скачать беговые кроссовки', source: 'suggest', frequency: '8', geo: 'RU', flag: 'garbage', flagTone: 'danger', status: 'rejected', statusTone: 'danger' },
]

export const parseRows = [
  { query: 'лучшие беговые кроссовки для асфальта', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'для асфальта', geo: 'none', intent: 'comparison', confidence: '0.91', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки nike', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'brand:nike', geo: 'none', intent: 'commercial', confidence: '0.95', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки москва', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'none', geo: 'Moscow', intent: 'local', confidence: '0.84', review: 'check geo', reviewTone: 'warning' },
  { query: 'как выбрать беговые кроссовки', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'none', geo: 'none', intent: 'informational', confidence: '0.96', review: 'auto-ok', reviewTone: 'success' },
]

export const clusterRows = [
  {
    id: 'road-running',
    label: 'road-running-shoes',
    entity: 'беговые кроссовки',
    intent: 'commercial',
    intentTone: 'success',
    frequency: '1,120',
    status: 'approved',
    statusTone: 'success',
    pageType: 'filter-page',
    h1: 'Беговые кроссовки для асфальта',
    slug: '/running-shoes/road/',
    matchedUrl: '/catalog/running-shoes/road/',
    queries: 'беговые кроссовки для асфальта, кроссовки для бега по асфальту мужские, road running shoes',
  },
  {
    id: 'best-running',
    label: 'best-running-shoes',
    entity: 'беговые кроссовки',
    intent: 'comparison',
    intentTone: 'warning',
    frequency: '780',
    status: 'needs_review',
    statusTone: 'warning',
    pageType: 'comparison-page',
    h1: 'Лучшие беговые кроссовки',
    slug: '/compare/best-running-shoes/',
    matchedUrl: 'none',
    queries: 'лучшие беговые кроссовки, топ беговых кроссовок, лучшие кроссовки для бега',
  },
  {
    id: 'nike-running',
    label: 'nike-running-shoes',
    entity: 'nike',
    intent: 'commercial',
    intentTone: 'success',
    frequency: '910',
    status: 'published_candidate',
    statusTone: 'neutral',
    pageType: 'brand-page',
    h1: 'Беговые кроссовки Nike',
    slug: '/running-shoes/nike/',
    matchedUrl: '/brands/nike-running/',
    queries: 'беговые кроссовки nike, nike running shoes, nike кроссовки для бега',
  },
]

export const siteNodes = [
  { id: 'root', label: 'Running Shoes', url: '/running-shoes/', pageType: 'category', tone: 'neutral', level: 0, parent: 'root', cluster: 'buy-running-shoes', origin: 'existing', aiNote: 'Основной category hub. Держит glossary, filters и entity anchors.' },
  { id: 'road', label: 'Road Running', url: '/running-shoes/road/', pageType: 'filter-page', tone: 'success', level: 1, parent: '/running-shoes/', cluster: 'road-running-shoes', origin: 'existing', aiNote: 'Нужен compare table, fit criteria и FAQ по покрытию.' },
  { id: 'marathon', label: 'Marathon Running', url: '/running-shoes/marathon/', pageType: 'filter-page', tone: 'success', level: 1, parent: '/running-shoes/', cluster: 'marathon-running-shoes', origin: 'new', aiNote: 'Отдельная страница оправдана устойчивым use-case и спросом.' },
  { id: 'nike', label: 'Nike Running', url: '/running-shoes/nike/', pageType: 'brand-page', tone: 'warning', level: 1, parent: '/running-shoes/', cluster: 'nike-running-shoes', origin: 'matched existing', aiNote: 'Нужно аккуратно объединить с текущей brand collection.' },
  { id: 'best', label: 'Best Running Shoes', url: '/compare/best-running-shoes/', pageType: 'comparison-page', tone: 'danger', level: 0, parent: 'root', cluster: 'best-running-shoes', origin: 'new', aiNote: 'Требует ручной выбор между comparison-page и guide-page.' },
]

export const urlMatches = [
  { cluster: 'road-running-shoes', slug: '/running-shoes/road/', url: '/catalog/running-shoes/road/', type: 'exact semantic match', confidence: '0.97', action: 'merge existing', tone: 'success' },
  { cluster: 'nike-running-shoes', slug: '/running-shoes/nike/', url: '/brands/nike-running/', type: 'brand synonym', confidence: '0.88', action: 'review merge', tone: 'warning' },
  { cluster: 'best-running-shoes', slug: '/compare/best-running-shoes/', url: 'none', type: 'no match', confidence: '0.12', action: 'create new', tone: 'neutral' },
  { cluster: 'running-shoes-moscow', slug: '/running-shoes/moscow/', url: '/running-shoes/msk/', type: 'geo translit', confidence: '0.74', action: 'manual review', tone: 'warning' },
]

export const promptRows = [
  {
    id: 'normalize',
    name: 'Normalize Query v3',
    stage: 'Preprocessing Layer',
    version: '3.2.1',
    model: 'gpt-5.4-mini',
    passRate: '98.1%',
    latency: '1.2s',
    cost: '$0.002 / item',
    schema: `{
  "normalized_query": "string",
  "tokens": ["string"],
  "modifiers": ["string"],
  "is_garbage": "boolean",
  "garbage_reason": "string | null",
  "confidence_score": "number"
}`,
  },
  {
    id: 'intent',
    name: 'Intent Classifier v5',
    stage: 'Intent Classification',
    version: '5.0.4',
    model: 'gpt-5.4-mini',
    passRate: '94.6%',
    latency: '1.7s',
    cost: '$0.003 / item',
    schema: `{
  "primary_intent": "commercial | informational | comparison | local | mixed",
  "secondary_intent": "string | null",
  "intent_confidence": "number",
  "needs_manual_review": "boolean"
}`,
  },
  {
    id: 'page-type',
    name: 'Page Type Decision v2',
    stage: 'Page Typing Layer',
    version: '2.4.0',
    model: 'gpt-5.4',
    passRate: '91.2%',
    latency: '2.4s',
    cost: '$0.005 / item',
    schema: `{
  "page_type": "category | brand-page | filter-page | guide-page | comparison-page | no-page-needed",
  "recommended_h1": "string",
  "slug_candidate": "string",
  "manual_review": "boolean"
}`,
  },
]

export const reviewRows = [
  { item: 'best-running-shoes', type: 'cluster', issue: 'comparison vs guide ambiguity', severity: 'high', severityTone: 'danger', assigned: 'Nina', status: 'open', statusTone: 'danger' },
  { item: 'running-shoes-moscow', type: 'page', issue: 'geo overlap with existing /msk/', severity: 'medium', severityTone: 'warning', assigned: 'Max', status: 'in_review', statusTone: 'warning' },
  { item: 'nike air zoom марафон отзывы', type: 'query', issue: 'mixed support/commercial intent', severity: 'medium', severityTone: 'warning', assigned: 'Ira', status: 'open', statusTone: 'danger' },
  { item: 'mens-running-shoes', type: 'cluster', issue: 'possible duplicate with gender filter tree', severity: 'low', severityTone: 'neutral', assigned: 'Lena', status: 'resolved', statusTone: 'success' },
]

export const briefRows = [
  { page: 'Беговые кроссовки для асфальта', pageType: 'filter-page', intent: 'commercial', cluster: 'road-running-shoes', status: 'brief_ready', tone: 'success', owner: 'SEO team' },
  { page: 'Лучшие беговые кроссовки', pageType: 'comparison-page', intent: 'comparison', cluster: 'best-running-shoes', status: 'awaiting_approval', tone: 'warning', owner: 'Editor team' },
  { page: 'Как выбрать беговые кроссовки', pageType: 'guide-page', intent: 'informational', cluster: 'how-to-choose-running-shoes', status: 'brief_ready', tone: 'success', owner: 'Content ops' },
]
