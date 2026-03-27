export const navItems = [
  { id: 'dashboard', short: '01', label: 'Дашборд', description: 'Здоровье пайплайна, метрики и проблемные зоны.' },
  { id: 'imports', short: '02', label: 'Импорт и батчи', description: 'Загрузка, dry run и контроль обработки батчей.' },
  { id: 'raw', short: '03', label: 'Сырые запросы', description: 'Сырой спрос, мусорные флаги и статус предварительной чистки.' },
  { id: 'parsing', short: '04', label: 'Семантический разбор', description: 'Извлечение сущностей, structured output и флаги проверки.' },
  { id: 'clusters', short: '05', label: 'Кластеры', description: 'Канонические единицы спроса и решения по типу страницы.' },
  { id: 'structure', short: '06', label: 'Структура сайта', description: 'Как кластеры превращаются в дерево URL и страниц.' },
  { id: 'matcher', short: '07', label: 'Сопоставление URL', description: 'Сопоставление кластеров с текущим каталогом URL.' },
  { id: 'prompts', short: '08', label: 'Промпты и LLM Studio', description: 'Версии промптов, модели, схема и pass rate.' },
  { id: 'settings', short: '09', label: 'Настройки и ключи', description: 'Демо-настройки проекта, API-ключи и место хранения конфигурации.' },
  { id: 'review', short: '10', label: 'Очередь проверки', description: 'Human-in-the-loop для спорных или рискованных кейсов.' },
  { id: 'briefs', short: '11', label: 'Контент-брифы', description: 'Финальные брифы для редакции и SEO-команды.' },
]

export const pipelineSummary = [
  { title: 'Импорт', count: '842', rate: '100%', confidence: 'n/a', errors: '0', width: '100%', state: 'stable' },
  { title: 'Нормализация', count: '814', rate: '96%', confidence: '0.93', errors: '28', width: '96%', state: 'stable' },
  { title: 'Разбор', count: '792', rate: '97%', confidence: '0.89', errors: '12', width: '97%', state: 'stable' },
  { title: 'Классификация', count: '792', rate: '95%', confidence: '0.87', errors: '17', width: '95%', state: 'stable' },
  { title: 'Кластеризация', count: '126', rate: '91%', confidence: '0.84', errors: '9', width: '91%', state: 'focus' },
  { title: 'Тип страницы', count: '118', rate: '89%', confidence: '0.82', errors: '11', width: '89%', state: 'focus' },
  { title: 'Матч URL', count: '118', rate: '78%', confidence: '0.79', errors: '26', width: '78%', state: 'risk' },
  { title: 'Проверка', count: '34', rate: '73%', confidence: '0.68', errors: '34', width: '73%', state: 'risk' },
]

export const dashboardMetrics = [
  { label: 'Всего запросов', value: '842', delta: '+12%', tone: 'stable', note: 'Одна ниша: беговые кроссовки, бренды, фильтры, гео и сравнения.', trend: [38, 42, 48, 56, 61, 67, 71] },
  { label: 'Нормализовано', value: '814', delta: '+96%', tone: 'stable', note: 'После rule-based чистки и LLM-нормализации.', trend: [22, 36, 45, 59, 66, 74, 81] },
  { label: 'Нужно проверить', value: '34', delta: '-8%', tone: 'risk', note: 'Низкий confidence, конфликтный тип страницы или пересечение URL.', trend: [48, 44, 43, 39, 38, 35, 34] },
  { label: 'Найдено совпадений URL', value: '67', delta: '+5%', tone: 'focus', note: 'Система не плодит новые страницы без необходимости.', trend: [18, 27, 35, 42, 48, 56, 67] },
  { label: 'Предложено новых страниц', value: '51', delta: '+9%', tone: 'focus', note: 'Новые категории, бренды, гайды, гео- и comparison-страницы.', trend: [10, 16, 24, 31, 37, 44, 51] },
  { label: 'Доля конфликтов', value: '9.4%', delta: '-1.8%', tone: 'risk', note: 'Пересечение кластеров, slug-конфликты и смешанный интент.', trend: [18, 17, 16, 14, 12, 10, 9] },
  { label: 'Оценка стоимости LLM', value: '$7.80', delta: '-14%', tone: 'stable', note: 'Оценка пакета при structured output и частичных повторах.', trend: [16, 15, 14, 13, 11, 9, 8] },
  { label: 'Средний confidence', value: '0.86', delta: '+0.04', tone: 'stable', note: 'Средний confidence по разбору, классификации и типизации страниц.', trend: [58, 61, 64, 70, 74, 81, 86] },
]

export const overviewStats = [
  { label: 'Активный батч', value: 'spring-running-shoes-01', note: '842 запроса / владелец Nina / регион RU+Moscow' },
  { label: 'Главный риск', value: 'Пересечение URL', note: '26 кейсов в URL Matcher ещё требуют решения аналитика' },
  { label: 'Пропускная способность', value: '14.2k q/hr', note: 'На основе текущего батча и очереди импортов' },
]

export const funnelStages = [
  { title: 'Импортировано', count: '842', share: '100%', detail: 'CSV + GSC + suggest parser + URL конкурентов.' },
  { title: 'Отфильтрован мусор', count: '28', share: '3.3%', detail: 'Шум, дубли и нерелевантные хвосты.' },
  { title: 'Извлечены сущности', count: '792', share: '94%', detail: 'LLM вернул сущность, атрибуты, гео и интент.' },
  { title: 'Построены кластеры', count: '126', share: '15%', detail: 'Спрос собран в единицы page intent.' },
  { title: 'Кандидаты в страницы', count: '118', share: '14%', detail: '8 кластеров помечены как страницы не нужны.' },
]

export const topConflicts = [
  { cluster: 'best-running-shoes', reason: 'guide-page vs comparison-page ambiguity', severity: 'high', severityTone: 'danger', owner: 'Nina' },
  { cluster: 'running-shoes-moscow', reason: 'geo-page overlaps with existing category /moskva/', severity: 'medium', severityTone: 'warning', owner: 'Max' },
  { cluster: 'nike-air-zoom', reason: 'brand-page collides with existing model filter', severity: 'medium', severityTone: 'warning', owner: 'Ira' },
]

export const pageTypeRows = [
  { label: 'Фильтр-страница', value: '38', width: '100%', note: 'Road, cushioning, men, women, marathon.' },
  { label: 'Бренд-страница', value: '24', width: '63%', note: 'Nike, Adidas, Asics, Hoka.' },
  { label: 'Гайд-страница', value: '19', width: '50%', note: 'How to choose, best models, FAQ.' },
  { label: 'Гео-страница', value: '14', width: '37%', note: 'Moscow, SPb and city intent.' },
  { label: 'Страница сравнения', value: '9', width: '24%', note: 'Brand vs brand and model family comparisons.' },
]

export const batchRows = [
  { batch: 'spring-running-shoes-01', source: 'csv import', queries: '842', progress: '100%', status: 'processed', tone: 'success', owner: 'Nina', createdAt: '2026-03-26 10:20' },
  { batch: 'competitor-urls-mar-24', source: 'url parser', queries: '214', progress: '76%', status: 'processing', tone: 'warning', owner: 'Max', createdAt: '2026-03-25 17:04' },
  { batch: 'gsc-brand-tail-q1', source: 'gsc', queries: '1,124', progress: '100%', status: 'processed', tone: 'success', owner: 'Ira', createdAt: '2026-03-24 09:11' },
  { batch: 'manual-corrections-geo', source: 'manual', queries: '39', progress: '0%', status: 'draft', tone: 'neutral', owner: 'Lena', createdAt: '2026-03-26 14:46' },
  { batch: 'asics-adidas-comparison-pack', source: 'csv import', queries: '167', progress: '100%', status: 'processed', tone: 'success', owner: 'Artem', createdAt: '2026-03-23 12:18' },
  { batch: 'brand-model-faq-mar', source: 'gsc', queries: '308', progress: '62%', status: 'processing', tone: 'warning', owner: 'Nina', createdAt: '2026-03-26 08:42' },
  { batch: 'trash-and-support-tail', source: 'manual', queries: '91', progress: '100%', status: 'processed', tone: 'success', owner: 'Lena', createdAt: '2026-03-22 18:07' },
]

export const queryRows = [
  { query: 'купить беговые кроссовки nike москва', normalized: 'беговые кроссовки nike москва', source: 'gsc', frequency: '320', geo: 'Moscow', flag: 'clean', flagTone: 'success', status: 'parsed', statusTone: 'neutral' },
  { query: 'лучшие беговые кроссовки для асфальта', normalized: 'лучшие беговые кроссовки для асфальта', source: 'suggest', frequency: '210', geo: 'RU', flag: 'review', flagTone: 'warning', status: 'clustered', statusTone: 'success' },
  { query: 'кроссовки для бега по асфальту мужские', normalized: 'беговые кроссовки для асфальта мужские', source: 'csv', frequency: '180', geo: 'RU', flag: 'clean', flagTone: 'success', status: 'clustered', statusTone: 'success' },
  { query: 'nike air zoom марафон отзывы', normalized: 'nike air zoom марафон отзывы', source: 'gsc', frequency: '70', geo: 'RU', flag: 'mixed intent', flagTone: 'warning', status: 'review', statusTone: 'warning' },
  { query: 'скачать беговые кроссовки', normalized: 'скачать беговые кроссовки', source: 'suggest', frequency: '8', geo: 'RU', flag: 'garbage', flagTone: 'danger', status: 'rejected', statusTone: 'danger' },
  { query: 'беговые кроссовки asics gel kayano купить', normalized: 'беговые кроссовки asics gel kayano купить', source: 'gsc', frequency: '154', geo: 'RU', flag: 'clean', flagTone: 'success', status: 'parsed', statusTone: 'neutral' },
  { query: 'лучшие кроссовки для марафона 2026', normalized: 'лучшие кроссовки для марафона', source: 'suggest', frequency: '132', geo: 'RU', flag: 'review', flagTone: 'warning', status: 'clustered', statusTone: 'success' },
  { query: 'adidas или nike для бега', normalized: 'adidas vs nike для бега', source: 'csv', frequency: '118', geo: 'RU', flag: 'comparison', flagTone: 'warning', status: 'review', statusTone: 'warning' },
  { query: 'беговые кроссовки женские 39 размер', normalized: 'беговые кроссовки женские размер 39', source: 'gsc', frequency: '96', geo: 'RU', flag: 'clean', flagTone: 'success', status: 'clustered', statusTone: 'success' },
  { query: 'беговые кроссовки спб', normalized: 'беговые кроссовки санкт-петербург', source: 'gsc', frequency: '88', geo: 'SPb', flag: 'geo review', flagTone: 'warning', status: 'parsed', statusTone: 'neutral' },
  { query: 'кроссовки для бега hoka clifton 9', normalized: 'hoka clifton 9 для бега', source: 'suggest', frequency: '74', geo: 'RU', flag: 'model intent', flagTone: 'warning', status: 'review', statusTone: 'warning' },
  { query: 'ремонт подошвы беговых кроссовок', normalized: 'ремонт подошвы беговых кроссовок', source: 'csv', frequency: '22', geo: 'RU', flag: 'garbage', flagTone: 'danger', status: 'rejected', statusTone: 'danger' },
  { query: 'как стирать беговые кроссовки', normalized: 'как стирать беговые кроссовки', source: 'suggest', frequency: '41', geo: 'RU', flag: 'support intent', flagTone: 'warning', status: 'review', statusTone: 'warning' },
  { query: 'беговые кроссовки wildberries', normalized: 'беговые кроссовки wildberries', source: 'gsc', frequency: '27', geo: 'RU', flag: 'marketplace noise', flagTone: 'danger', status: 'rejected', statusTone: 'danger' },
  { query: 'nike pegasus 41 мужские москва', normalized: 'nike pegasus 41 мужские москва', source: 'gsc', frequency: '63', geo: 'Moscow', flag: 'clean', flagTone: 'success', status: 'parsed', statusTone: 'neutral' },
  { query: 'таблица размеров asics бег', normalized: 'таблица размеров asics для бега', source: 'suggest', frequency: '36', geo: 'RU', flag: 'support intent', flagTone: 'warning', status: 'review', statusTone: 'warning' },
]

export const parseRows = [
  { query: 'лучшие беговые кроссовки для асфальта', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'для асфальта', geo: 'none', intent: 'comparison', confidence: '0.91', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки nike', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'brand:nike', geo: 'none', intent: 'commercial', confidence: '0.95', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки москва', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'none', geo: 'Moscow', intent: 'local', confidence: '0.84', review: 'check geo', reviewTone: 'warning' },
  { query: 'как выбрать беговые кроссовки', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'none', geo: 'none', intent: 'informational', confidence: '0.96', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки asics gel kayano купить', entity: 'asics gel kayano', entityType: 'product_model_family', attributes: 'brand:asics', geo: 'none', intent: 'commercial', confidence: '0.92', review: 'model review', reviewTone: 'warning' },
  { query: 'лучшие кроссовки для марафона 2026', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'marathon', geo: 'none', intent: 'comparison', confidence: '0.89', review: 'auto-ok', reviewTone: 'success' },
  { query: 'adidas или nike для бега', entity: 'adidas vs nike', entityType: 'brand_comparison', attributes: 'brand:adidas,brand:nike', geo: 'none', intent: 'comparison', confidence: '0.86', review: 'comparison check', reviewTone: 'warning' },
  { query: 'беговые кроссовки женские 39 размер', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'gender:women,size:39', geo: 'none', intent: 'commercial', confidence: '0.88', review: 'auto-ok', reviewTone: 'success' },
  { query: 'беговые кроссовки спб', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'none', geo: 'Saint Petersburg', intent: 'local', confidence: '0.82', review: 'check geo slug', reviewTone: 'warning' },
  { query: 'nike pegasus 41 мужские москва', entity: 'nike pegasus 41', entityType: 'product_model', attributes: 'brand:nike,gender:men', geo: 'Moscow', intent: 'commercial', confidence: '0.9', review: 'model + geo overlap', reviewTone: 'warning' },
  { query: 'как стирать беговые кроссовки', entity: 'беговые кроссовки', entityType: 'product_category', attributes: 'care', geo: 'none', intent: 'informational', confidence: '0.94', review: 'support content', reviewTone: 'warning' },
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
  {
    id: 'marathon-running',
    label: 'marathon-running-shoes',
    entity: 'беговые кроссовки',
    intent: 'comparison',
    intentTone: 'warning',
    frequency: '640',
    status: 'approved',
    statusTone: 'success',
    pageType: 'guide-page',
    h1: 'Лучшие кроссовки для марафона',
    slug: '/guides/best-marathon-running-shoes/',
    matchedUrl: 'none',
    queries: 'лучшие кроссовки для марафона, кроссовки для марафона 2026, в чем бежать марафон',
  },
  {
    id: 'women-road',
    label: 'women-road-running-shoes',
    entity: 'беговые кроссовки',
    intent: 'commercial',
    intentTone: 'success',
    frequency: '590',
    status: 'approved',
    statusTone: 'success',
    pageType: 'filter-page',
    h1: 'Женские беговые кроссовки для асфальта',
    slug: '/running-shoes/road/women/',
    matchedUrl: '/catalog/running-shoes/road/women/',
    queries: 'беговые кроссовки женские 39 размер, женские кроссовки для бега по асфальту, road running women',
  },
  {
    id: 'spb-running',
    label: 'running-shoes-spb',
    entity: 'беговые кроссовки',
    intent: 'local',
    intentTone: 'warning',
    frequency: '210',
    status: 'needs_review',
    statusTone: 'warning',
    pageType: 'geo-page',
    h1: 'Беговые кроссовки в Санкт-Петербурге',
    slug: '/running-shoes/spb/',
    matchedUrl: '/running-shoes/sankt-peterburg/',
    queries: 'беговые кроссовки спб, купить беговые кроссовки спб, беговые кроссовки санкт-петербург',
  },
  {
    id: 'adidas-vs-nike',
    label: 'adidas-vs-nike-running',
    entity: 'adidas vs nike',
    intent: 'comparison',
    intentTone: 'warning',
    frequency: '174',
    status: 'needs_review',
    statusTone: 'warning',
    pageType: 'comparison-page',
    h1: 'Adidas или Nike для бега',
    slug: '/compare/adidas-vs-nike-running/',
    matchedUrl: 'none',
    queries: 'adidas или nike для бега, что лучше adidas или nike бег, nike vs adidas running',
  },
]

export const siteNodes = [
  { id: 'root', label: 'Running Shoes', url: '/running-shoes/', pageType: 'category', tone: 'neutral', level: 0, parent: 'root', cluster: 'buy-running-shoes', origin: 'existing', aiNote: 'Основной category hub. Держит glossary, filters и entity anchors.' },
  { id: 'road', label: 'Road Running', url: '/running-shoes/road/', pageType: 'filter-page', tone: 'success', level: 1, parent: '/running-shoes/', cluster: 'road-running-shoes', origin: 'existing', aiNote: 'Нужен compare table, fit criteria и FAQ по покрытию.' },
  { id: 'women-road', label: 'Women Road Running', url: '/running-shoes/road/women/', pageType: 'filter-page', tone: 'success', level: 2, parent: '/running-shoes/road/', cluster: 'women-road-running-shoes', origin: 'existing', aiNote: 'Высокочастотный подфильтр, уже подтвержден коммерческий интент.' },
  { id: 'marathon', label: 'Marathon Running', url: '/running-shoes/marathon/', pageType: 'filter-page', tone: 'success', level: 1, parent: '/running-shoes/', cluster: 'marathon-running-shoes', origin: 'new', aiNote: 'Отдельная страница оправдана устойчивым use-case и спросом.' },
  { id: 'nike', label: 'Nike Running', url: '/running-shoes/nike/', pageType: 'brand-page', tone: 'warning', level: 1, parent: '/running-shoes/', cluster: 'nike-running-shoes', origin: 'matched existing', aiNote: 'Нужно аккуратно объединить с текущей brand collection.' },
  { id: 'spb', label: 'Running Shoes SPb', url: '/running-shoes/spb/', pageType: 'geo-page', tone: 'warning', level: 1, parent: '/running-shoes/', cluster: 'running-shoes-spb', origin: 'matched existing', aiNote: 'Слой гео уже есть, но нужен единый slug policy.' },
  { id: 'best', label: 'Best Running Shoes', url: '/compare/best-running-shoes/', pageType: 'comparison-page', tone: 'danger', level: 0, parent: 'root', cluster: 'best-running-shoes', origin: 'new', aiNote: 'Требует ручной выбор между comparison-page и guide-page.' },
  { id: 'marathon-guide', label: 'Best Marathon Running', url: '/guides/best-marathon-running-shoes/', pageType: 'guide-page', tone: 'success', level: 0, parent: 'root', cluster: 'marathon-running-shoes', origin: 'new', aiNote: 'Хороший кандидат для editorial + affiliate блоков.' },
  { id: 'adidas-vs-nike', label: 'Adidas vs Nike Running', url: '/compare/adidas-vs-nike-running/', pageType: 'comparison-page', tone: 'warning', level: 0, parent: 'root', cluster: 'adidas-vs-nike-running', origin: 'new', aiNote: 'Нужна валидация интента: editorial comparison или коммерческий hub.' },
]

export const urlMatches = [
  { cluster: 'road-running-shoes', slug: '/running-shoes/road/', url: '/catalog/running-shoes/road/', type: 'exact semantic match', confidence: '0.97', action: 'merge existing', tone: 'success' },
  { cluster: 'nike-running-shoes', slug: '/running-shoes/nike/', url: '/brands/nike-running/', type: 'brand synonym', confidence: '0.88', action: 'review merge', tone: 'warning' },
  { cluster: 'best-running-shoes', slug: '/compare/best-running-shoes/', url: 'none', type: 'no match', confidence: '0.12', action: 'create new', tone: 'neutral' },
  { cluster: 'running-shoes-moscow', slug: '/running-shoes/moscow/', url: '/running-shoes/msk/', type: 'geo translit', confidence: '0.74', action: 'manual review', tone: 'warning' },
  { cluster: 'women-road-running-shoes', slug: '/running-shoes/road/women/', url: '/catalog/running-shoes/road/women/', type: 'exact filter match', confidence: '0.96', action: 'merge existing', tone: 'success' },
  { cluster: 'marathon-running-shoes', slug: '/guides/best-marathon-running-shoes/', url: 'none', type: 'new guide page', confidence: '0.71', action: 'create new', tone: 'neutral' },
  { cluster: 'running-shoes-spb', slug: '/running-shoes/spb/', url: '/running-shoes/sankt-peterburg/', type: 'geo synonym', confidence: '0.77', action: 'review merge', tone: 'warning' },
  { cluster: 'adidas-vs-nike-running', slug: '/compare/adidas-vs-nike-running/', url: 'none', type: 'comparison candidate', confidence: '0.69', action: 'manual review', tone: 'warning' },
  { cluster: 'asics-gel-kayano', slug: '/running-shoes/asics/gel-kayano/', url: '/catalog/asics/gel-kayano/', type: 'model family match', confidence: '0.85', action: 'merge existing', tone: 'success' },
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
  { item: 'running-shoes-spb', type: 'page', issue: 'geo slug conflict with existing city folder', severity: 'medium', severityTone: 'warning', assigned: 'Max', status: 'open', statusTone: 'danger' },
  { item: 'adidas-vs-nike-running', type: 'cluster', issue: 'commercial vs editorial comparison intent', severity: 'high', severityTone: 'danger', assigned: 'Nina', status: 'in_review', statusTone: 'warning' },
  { item: 'как стирать беговые кроссовки', type: 'query', issue: 'support intent should not generate category page', severity: 'low', severityTone: 'neutral', assigned: 'Lena', status: 'resolved', statusTone: 'success' },
  { item: 'asics gel kayano купить', type: 'model', issue: 'decide between model page and filtered PLP', severity: 'medium', severityTone: 'warning', assigned: 'Ira', status: 'open', statusTone: 'danger' },
]

export const briefRows = [
  { page: 'Беговые кроссовки для асфальта', pageType: 'filter-page', intent: 'commercial', cluster: 'road-running-shoes', status: 'brief_ready', tone: 'success', owner: 'SEO team' },
  { page: 'Лучшие беговые кроссовки', pageType: 'comparison-page', intent: 'comparison', cluster: 'best-running-shoes', status: 'awaiting_approval', tone: 'warning', owner: 'Editor team' },
  { page: 'Как выбрать беговые кроссовки', pageType: 'guide-page', intent: 'informational', cluster: 'how-to-choose-running-shoes', status: 'brief_ready', tone: 'success', owner: 'Content ops' },
  { page: 'Лучшие кроссовки для марафона', pageType: 'guide-page', intent: 'comparison', cluster: 'marathon-running-shoes', status: 'brief_ready', tone: 'success', owner: 'Editorial team' },
  { page: 'Женские беговые кроссовки для асфальта', pageType: 'filter-page', intent: 'commercial', cluster: 'women-road-running-shoes', status: 'brief_ready', tone: 'success', owner: 'SEO team' },
  { page: 'Беговые кроссовки в Санкт-Петербурге', pageType: 'geo-page', intent: 'local', cluster: 'running-shoes-spb', status: 'awaiting_approval', tone: 'warning', owner: 'Local SEO team' },
  { page: 'Adidas или Nike для бега', pageType: 'comparison-page', intent: 'comparison', cluster: 'adidas-vs-nike-running', status: 'in_review', tone: 'warning', owner: 'Content ops' },
  { page: 'Беговые кроссовки ASICS Gel Kayano', pageType: 'brand-page', intent: 'commercial', cluster: 'asics-gel-kayano', status: 'brief_ready', tone: 'success', owner: 'Catalog team' },
]

export const defaultDemoBundle = {
  batchRows,
  briefRows,
  clusterRows,
  dashboardMetrics,
  funnelStages,
  overviewStats,
  pageTypeRows,
  parseRows,
  pipelineSummary,
  promptRows,
  queryRows,
  reviewRows,
  siteNodes,
  topConflicts,
  urlMatches,
} as const
