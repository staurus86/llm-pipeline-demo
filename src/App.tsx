import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BellDot,
  Bot,
  Briefcase,
  CheckCircle2,
  CircleAlert,
  Database,
  Flag,
  FolderUp,
  LayoutDashboard,
  Link2,
  Search,
  ShieldAlert,
  Settings2,
  Workflow,
} from 'lucide-react'
import './App.css'
import {
  defaultDemoBundle,
  navItems,
} from './data'

type DemoBundle = typeof defaultDemoBundle
type BatchRow = DemoBundle['batchRows'][number]

type DemoSettings = {
  projectName: string
  domain: string
  llmProvider: string
  model: string
  embeddingsModel: string
  openaiKey: string
  cerebrasKey: string
  storageMode: string
  storagePath: string
  notes: string
}

const SETTINGS_KEY = 'llm-pipeline-demo-settings'
const BATCHES_KEY = 'llm-pipeline-demo-batches'

const defaultSettings: DemoSettings = {
  projectName: 'Running Shoes Demand Graph',
  domain: 'demo.running-shoes.local',
  llmProvider: 'OpenAI',
  model: 'gpt-5.4-mini',
  embeddingsModel: 'text-embedding-3-large',
  openaiKey: '',
  cerebrasKey: '',
  storageMode: 'localStorage браузера',
  storagePath: 'window.localStorage -> llm-pipeline-demo-*',
  notes:
    'Для демо ключи и настройки сохраняются только в localStorage браузера. Для реального проекта нужен backend-хранилище секретов.',
}

const quickActions = [
  {
    id: 'imports',
    title: 'Загрузить новый батч',
    note: 'CSV, GSC или ручные правки',
    icon: FolderUp,
  },
  {
    id: 'matcher',
    title: 'Проверить совпадения URL',
    note: 'Разобрать пересечения и низкий confidence',
    icon: Link2,
  },
  {
    id: 'prompts',
    title: 'Подкрутить промпты',
    note: 'Модели, схемы и pass rate',
    icon: Bot,
  },
  {
    id: 'settings',
    title: 'Ключи и хранение',
    note: 'Демо-ключи и способ сохранения',
    icon: Settings2,
  },
] as const

const localRunSteps = [
  'Клонировать репозиторий',
  'Установить зависимости',
  'Добавить ключ LLM-провайдера в .env',
  'Запустить пайплайн на демо-датасете',
  'Открыть админку и пройти результат по шагам',
]

const pipelineJourney = [
  'Сырые запросы',
  'Нормализованные запросы',
  'Сущности и интенты',
  'Кластеры',
  'Типы страниц',
  'Структура сайта',
  'Конфликты и ручная проверка',
  'Контент-брифы',
]

const articleDemoSections = [
  'Обзорная панель',
  'Импорты и пакеты загрузки',
  'Сырые запросы',
  'Смысловой разбор',
  'Кластеры',
  'Структура сайта',
  'Сопоставление URL',
  'Студия промптов',
  'Очередь проверки',
  'Контент-брифы',
]

const localRunCommands = [
  'git clone <repo>',
  'npm install',
  'Copy-Item .env.example .env',
  'npm run pipeline:demo',
  'npm run dev',
]

function ToneFlagIcon({ tone }: { tone: string }) {
  if (tone === 'danger' || tone === 'risk') {
    return <ShieldAlert size={12} strokeWidth={2.2} />
  }

  if (tone === 'warning' || tone === 'focus') {
    return <Flag size={12} strokeWidth={2.2} />
  }

  return <CheckCircle2 size={12} strokeWidth={2.2} />
}

const sourceLabels: Record<string, string> = {
  'csv import': 'CSV import',
  gsc: 'GSC',
  'url parser': 'URL parser',
  manual: 'Вручную',
  suggest: 'Suggest',
  csv: 'CSV',
}

const statusLabels: Record<string, string> = {
  processed: 'обработан',
  processing: 'в работе',
  draft: 'черновик',
  parsed: 'разобран',
  clustered: 'в кластере',
  rejected: 'отклонён',
  approved: 'подтверждено',
  needs_review: 'нужна проверка',
  published_candidate: 'к публикации',
  open: 'открыто',
  in_review: 'на проверке',
  resolved: 'решено',
  brief_ready: 'бриф готов',
  awaiting_approval: 'ждёт согласования',
}

const flagLabels: Record<string, string> = {
  clean: 'чистый',
  review: 'проверить',
  garbage: 'мусор',
  'mixed intent': 'смешанный интент',
  comparison: 'сравнение',
  'model intent': 'модельный интент',
  'geo review': 'проверить гео',
  'marketplace noise': 'маркетплейсный шум',
  'support intent': 'сервисный интент',
}

const pageTypeLabels: Record<string, string> = {
  'filter-page': 'фильтр-страница',
  'brand-page': 'бренд-страница',
  'guide-page': 'гайд-страница',
  'comparison-page': 'страница сравнения',
  'geo-page': 'гео-страница',
  category: 'категория',
}

const intentLabels: Record<string, string> = {
  commercial: 'коммерческий',
  informational: 'информационный',
  comparison: 'сравнение',
  local: 'гео',
  mixed: 'смешанный',
}

const reviewLabels: Record<string, string> = {
  'auto-ok': 'авто-ок',
  'check geo': 'проверить гео',
  'comparison check': 'проверить сравнение',
  'support content': 'сервисный контент',
  'model review': 'проверить модель',
  'check geo slug': 'проверить geo slug',
  'model + geo overlap': 'модель + гео',
}

const reviewTypeLabels: Record<string, string> = {
  cluster: 'кластер',
  page: 'страница',
  query: 'запрос',
  model: 'модель',
}

const matchActionLabels: Record<string, string> = {
  'merge existing': 'привязать к существующей',
  'review merge': 'проверить привязку',
  'create new': 'создать новую',
  'manual review': 'ручная проверка',
}

const originLabels: Record<string, string> = {
  existing: 'существующая',
  new: 'новая',
  'matched existing': 'найден существующий URL',
}

const promptStageLabels: Record<string, string> = {
  'Preprocessing Layer': 'Слой предобработки',
  'Intent Classification': 'Классификация интента',
  'Page Typing Layer': 'Определение типа страницы',
}

function humanize(value: string, dictionary: Record<string, string>) {
  return dictionary[value] ?? value
}

function App() {
  const [demoBundle, setDemoBundle] = useState<DemoBundle>(defaultDemoBundle)
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [selectedClusterId, setSelectedClusterId] = useState(defaultDemoBundle.clusterRows[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState(defaultDemoBundle.siteNodes[0].id)
  const [selectedPromptId, setSelectedPromptId] = useState(defaultDemoBundle.promptRows[0].id)
  const [settings, setSettings] = useState<DemoSettings>(defaultSettings)
  const [savedAt, setSavedAt] = useState('not saved yet')
  const [batches, setBatches] = useState<BatchRow[]>(defaultDemoBundle.batchRows)
  const [uploadName, setUploadName] = useState('spring-running-shoes-01.csv')
  const [uploadSource, setUploadSource] = useState('csv import')
  const [uploadOwner, setUploadOwner] = useState('Nina')
  const [uploadCount, setUploadCount] = useState('842')
  const [isRunning, setIsRunning] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const {
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
  } = demoBundle
  const topMetricCards = dashboardMetrics.slice(0, 4)
  const secondaryMetricCards = dashboardMetrics.slice(4, 8)

  const selectedCluster =
    clusterRows.find((cluster) => cluster.id === selectedClusterId) ?? clusterRows[0]
  const selectedNode = siteNodes.find((node) => node.id === selectedNodeId) ?? siteNodes[0]
  const selectedPrompt =
    promptRows.find((prompt) => prompt.id === selectedPromptId) ?? promptRows[0]

  const screenTitle = useMemo(
    () => navItems.find((item) => item.id === activeScreen) ?? navItems[0],
    [activeScreen],
  )

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await fetch('/demo-run.json', { cache: 'no-store' })
        if (response.ok) {
          const runtimeBundle = (await response.json()) as Partial<DemoBundle>
          setDemoBundle((current) => ({ ...current, ...runtimeBundle }))
          if (Array.isArray(runtimeBundle.batchRows)) {
            setBatches(runtimeBundle.batchRows as BatchRow[])
            if (runtimeBundle.batchRows[0]?.queries) {
              setUploadCount(String(runtimeBundle.batchRows[0].queries))
            }
          }
        }
      } catch {
        // Fallback to bundled demo data when generated runtime output is absent.
      }

      const storedSettings = window.localStorage.getItem(SETTINGS_KEY)
      const storedBatches = window.localStorage.getItem(BATCHES_KEY)

      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
        setSavedAt('restored from browser storage')
      }

      if (storedBatches) {
        setBatches(JSON.parse(storedBatches))
      }
    }

    void bootstrap()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(BATCHES_KEY, JSON.stringify(batches))
  }, [batches])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = window.setInterval(() => {
      let shouldStop = false

      setBatches((current) =>
        current.map((batch, index) => {
          if (index !== 0) {
            return batch
          }

          const progress = Math.min(Number.parseInt(batch.progress, 10) + 12, 100)
          shouldStop = progress >= 100

          return {
            ...batch,
            progress: `${progress}%`,
            status: progress >= 100 ? 'processed' : 'processing',
            tone: progress >= 100 ? 'success' : 'warning',
          }
        }),
      )

      if (shouldStop) {
        setIsRunning(false)
      }
    }, 900)

    return () => window.clearInterval(interval)
  }, [isRunning])

  const activeBatch = batches[0] ?? demoBundle.batchRows[0]
  const effectiveOverview = [
    {
      ...overviewStats[0],
      value: activeBatch.batch,
      note: `${activeBatch.queries} запросов / владелец ${activeBatch.owner} / источник ${humanize(activeBatch.source, sourceLabels)}`,
    },
    overviewStats[1],
    overviewStats[2],
  ]

  const alertItems = [
    {
      title: 'Review queue pressure',
      body: `${reviewRows.length} элементов ещё требуют решения аналитика перед публикацией.`,
      tone: 'danger',
      meta: 'Нужна реакция',
    },
    {
      title: 'Пересечение в URL Matcher',
      body: `${topConflicts[0]?.cluster ?? 'best-running-shoes'} всё ещё конфликтует с существующей страницей.`,
      tone: 'warning',
      meta: 'Нужно решение',
    },
    {
      title: 'Режим хранения',
      body: 'Демо-ключи и очередь батчей сохраняются только в localStorage.',
      tone: 'neutral',
      meta: 'Ограничение демо',
    },
  ]

  const activityFeed = [
    {
      title: `Батч ${activeBatch.batch}: ${humanize(activeBatch.status, statusLabels)}`,
      note: `Прогресс ${activeBatch.progress} · владелец ${activeBatch.owner}`,
      tone: activeBatch.tone,
    },
    {
      title: `${reviewRows[0]?.item ?? 'best-running-shoes'} отправлен на проверку`,
      note: reviewRows[0]?.issue ?? 'Неоднозначность между guide и comparison',
      tone: reviewRows[0]?.severityTone ?? 'warning',
    },
    {
      title: `${urlMatches[1]?.cluster ?? 'nike-running-shoes'} сопоставлен с URL`,
      note: `${urlMatches[1]?.url ?? '/brands/nike-running/'} · confidence ${urlMatches[1]?.confidence ?? '0.88'}`,
      tone: urlMatches[1]?.tone ?? 'warning',
    },
    {
      title: `${briefRows[0]?.page ?? 'Road running shoes'}: бриф готов`,
      note: `${briefRows[0]?.owner ?? 'SEO team'} · ${humanize(briefRows[0]?.status ?? 'brief_ready', statusLabels)}`,
      tone: briefRows[0]?.tone ?? 'success',
    },
  ]

  const handleSaveSettings = () => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    setSavedAt(new Date().toLocaleString('ru-RU'))
  }

  const buildDraftBatch = (): BatchRow => ({
      batch: uploadName.replace(/\.[^.]+$/, '') || 'new-demo-batch',
      source: uploadSource,
      queries: uploadCount || '0',
      progress: '0%',
      status: 'draft',
      tone: 'neutral',
      owner: uploadOwner || 'Unassigned',
      createdAt: new Date().toLocaleString('sv-SE').replace('T', ' '),
    })

  const handleUploadBatch = () => {
    const newBatch = buildDraftBatch()
    setBatches((current) => [newBatch, ...current])
    setActiveScreen('imports')
  }

  const handleRunPipeline = () => {
    setBatches((current) =>
      current.map((batch, index) =>
        index === 0 ? { ...batch, progress: '4%', status: 'processing', tone: 'warning' } : batch,
      ),
    )
    setIsRunning(true)
    setActiveScreen('dashboard')
  }

  const handleSaveAndRun = () => {
    const newBatch = buildDraftBatch()
    setBatches((current) => [
      { ...newBatch, progress: '4%', status: 'processing', tone: 'warning' },
      ...current,
    ])
    setIsRunning(true)
    setActiveScreen('dashboard')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">
            <span className="brand-logo">
              <LayoutDashboard size={16} strokeWidth={2.2} />
            </span>
            <p className="eyebrow">SEO Pipeline Ops</p>
          </div>
          <h1>Demand Graph Console</h1>
          <p className="brand-copy">
            Инженерное сопровождение статьи: интерфейс показывает путь от сырых запросов и
            чистки спроса до кластеров, структуры сайта, URL-сопоставления и финальных брифов.
          </p>
          <div className="brand-badges">
            <span className="inline-flag neutral">Семантика</span>
            <span className="inline-flag neutral">Структура сайта</span>
            <span className="inline-flag neutral">Инженерный walkthrough</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Sections">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeScreen === item.id ? 'nav-button active' : 'nav-button'}
              onClick={() => setActiveScreen(item.id)}
            >
              <span>{item.short}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <span>Активный батч</span>
          <strong>{activeBatch.batch}</strong>
          <div className="sidebar-meta-list">
            <p>{activeBatch.queries} запросов</p>
            <p>{humanize(activeBatch.source, sourceLabels)}</p>
            <p>Прогресс {activeBatch.progress}</p>
          </div>
        </div>

        <div className="sidebar-card sidebar-card-muted">
          <span>Проект</span>
          <strong>{settings.projectName}</strong>
          <div className="sidebar-meta-list">
            <p>{settings.domain}</p>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <div className="utility-bar">
          <label className="search-shell">
            <span>
              <Search size={14} strokeWidth={2.2} />
              Поиск
            </span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Поиск по кластерам, URL и промптам"
            />
          </label>
          <div className="utility-actions">
            <span className="chip neutral">
              <BellDot size={13} strokeWidth={2.2} />
              Проверка {reviewRows.length}
            </span>
            <span className="chip neutral">
              <Database size={13} strokeWidth={2.2} />
              Батчи {batches.length}
            </span>
            <span className="chip success">
              <CheckCircle2 size={13} strokeWidth={2.2} />
              Хранение локально
            </span>
          </div>
        </div>

        <header className="workspace-header">
          <div>
            <p className="eyebrow">Пайплайн</p>
            <h2>{screenTitle.label}</h2>
            <p>{screenTitle.description}</p>
          </div>
          <div className="header-actions">
            <span className="chip neutral">LLM: {settings.model}</span>
            <span className={isRunning ? 'chip warning' : 'chip success'}>
              {isRunning ? 'пайплайн запущен' : 'готово'}
            </span>
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveScreen('settings')}
            >
              Настройки
            </button>
            <button type="button" className="primary-action" onClick={handleRunPipeline}>
              Запустить пайплайн
            </button>
          </div>
        </header>

        <section className="pipeline-strip" aria-label="Сводка по пайплайну">
          {pipelineSummary.map((stage) => (
            <article key={stage.title} className={`pipeline-card ${stage.state}`}>
              <div className="pipeline-top">
                <span>{stage.title}</span>
                <strong>{stage.count}</strong>
              </div>
              <div className="pipeline-meta">
                <span className={`inline-flag ${stage.state === 'risk' ? 'danger' : stage.state === 'focus' ? 'warning' : 'success'}`}>
                  Успех {stage.rate}
                </span>
                <span className="inline-flag neutral">
                  Confidence {stage.confidence}
                </span>
                <span className={`inline-flag ${stage.errors === '0' ? 'success' : stage.errors === '34' || stage.errors === '26' ? 'danger' : 'warning'}`}>
                  Ошибок {stage.errors}
                </span>
              </div>
              <div className="pipeline-progress">
                <div className="pipeline-progress-fill" style={{ width: stage.width }} />
              </div>
            </article>
          ))}
        </section>

        {activeScreen === 'dashboard' && (
          <section className="screen-grid">
            <div className="hero-grid">
              <article className="hero-card">
                <div className="hero-head">
                  <div>
                    <p className="eyebrow">Демо к статье</p>
                    <h3>{effectiveOverview[0].value}</h3>
                  </div>
                  <span className={isRunning ? 'chip warning' : 'chip success'}>
                    {isRunning ? 'идёт обработка' : 'можно запускать'}
                  </span>
                </div>
                <p className="hero-copy">
                  {effectiveOverview[0].note}. Основной риск сейчас: {effectiveOverview[1].value.toLowerCase()}.
                </p>
                <div className="hero-progress">
                  <div>
                    <span className="inline-flag neutral">
                      <Flag size={12} strokeWidth={2.2} />
                      Активный батч
                    </span>
                    <strong>{activeBatch.progress}</strong>
                  </div>
                  <div className="pipeline-progress">
                    <div className="pipeline-progress-fill" style={{ width: activeBatch.progress }} />
                  </div>
                </div>
                <div className="hero-actions">
                  <button type="button" className="primary-action" onClick={handleRunPipeline}>
                    <Workflow size={15} strokeWidth={2.2} />
                    Запустить текущий батч
                  </button>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setActiveScreen('imports')}
                  >
                    <FolderUp size={15} strokeWidth={2.2} />
                    Открыть импорт
                  </button>
                </div>
                <div className="hero-stat-grid">
                  {effectiveOverview.slice(1).map((item) => (
                    <article key={item.label} className="mini-box">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <p>{item.note}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="panel quick-panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Быстрые действия</p>
                    <h3>Центр управления</h3>
                  </div>
                  <span className="chip neutral">демо-режим</span>
                </div>
                <div className="quick-actions-list">
                  {quickActions.map((action) => {
                    const Icon = action.icon

                    return (
                      <button
                        key={action.id}
                        type="button"
                        className="quick-action-card"
                        onClick={() => setActiveScreen(action.id)}
                      >
                        <span className="quick-action-icon">
                          <Icon size={16} strokeWidth={2.2} />
                        </span>
                        <div>
                          <strong>{action.title}</strong>
                          <p>{action.note}</p>
                        </div>
                        <ArrowRight size={16} strokeWidth={2.2} />
                      </button>
                    )
                  })}
                </div>
              </article>
            </div>

            <div className="metric-grid">
              {topMetricCards.map((metric: DemoBundle['dashboardMetrics'][number]) => (
                <article key={metric.label} className={`metric-card ${metric.tone}`}>
                  <div className="metric-head">
                    <span>{metric.label}</span>
                    <em className={`metric-delta ${metric.tone}`}>{metric.delta}</em>
                  </div>
                  <strong>{metric.value}</strong>
                  <p>{metric.note}</p>
                  <div className="row-flags">
                    <span className={`inline-flag ${metric.tone}`}>
                      <ToneFlagIcon tone={metric.tone} />
                      {metric.tone === 'risk'
                        ? 'нужна проверка'
                        : metric.tone === 'focus'
                          ? 'под наблюдением'
                          : 'в норме'}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="dashboard-columns">
              <div className="dashboard-main">
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="eyebrow">Воронка</p>
                      <h3>Состояние пайплайна</h3>
                    </div>
                    <span className="chip neutral">прогресс батча {activeBatch.progress}</span>
                  </div>
                  <div className="funnel-list">
                    {funnelStages.map((item) => (
                      <div className="funnel-row" key={item.title}>
                        <div>
                          <div className="row-flags">
                            <span
                              className={`inline-flag ${
                                item.share === '100%' || item.share === '94%'
                                  ? 'success'
                                  : item.share === '15%' || item.share === '14%'
                                    ? 'warning'
                                    : 'neutral'
                              }`}
                            >
                              <Workflow size={12} strokeWidth={2.2} />
                              {item.share === '100%' || item.share === '94%'
                                ? 'сильный проход'
                                : item.share === '15%' || item.share === '14%'
                                  ? 'сжатый слой'
                                  : 'отфильтровано'}
                            </span>
                          </div>
                          <strong>{item.title}</strong>
                          <p>{item.detail}</p>
                        </div>
                        <div className="funnel-stats">
                          <span>{item.count}</span>
                          <span>{item.share}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel full-span">
                  <div className="panel-head">
                    <div>
                      <p className="eyebrow">Очередь батчей</p>
                      <h3>Последние импорты</h3>
                    </div>
                    <span className="chip neutral">{batches.length} строк в очереди</span>
                  </div>
                  <div className="grid-table">
                    <div className="grid-head six">
                      <span>Батч</span>
                      <span>Источник</span>
                      <span>Запросы</span>
                      <span>Прогресс</span>
                      <span>Статус</span>
                      <span>Ответственный</span>
                    </div>
                    {batches.map((row) => (
                      <div key={`${row.batch}-${row.createdAt}`} className="grid-line six">
                        <span className="table-cell-with-flag">
                          <span className={`inline-flag ${row.tone}`}>
                            <FolderUp size={12} strokeWidth={2.2} />
                            {row.status}
                        </span>
                        <span>{row.batch}</span>
                      </span>
                        <span>{humanize(row.source, sourceLabels)}</span>
                        <span className="metric-pill-cell">{row.queries}</span>
                        <span className="metric-pill-cell metric-pill-progress">{row.progress}</span>
                        <span className={`chip ${row.tone}`}>{humanize(row.status, statusLabels)}</span>
                        <span>{row.owner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-side">
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="eyebrow">Алерты</p>
                      <h3>Операционные сигналы</h3>
                    </div>
                    <span className="chip danger">нужно внимание</span>
                  </div>
                  <div className="alert-list">
                    {alertItems.map((alert) => (
                      <article key={alert.title} className={`alert-card ${alert.tone}`}>
                        <div className="alert-icon">
                          {alert.tone === 'danger' ? (
                            <AlertTriangle size={16} strokeWidth={2.2} />
                          ) : alert.tone === 'warning' ? (
                            <CircleAlert size={16} strokeWidth={2.2} />
                          ) : (
                            <Database size={16} strokeWidth={2.2} />
                          )}
                        </div>
                        <div>
                          <div className="row-meta">
                            <strong>{alert.title}</strong>
                            <span className={`chip ${alert.tone}`}>{alert.meta}</span>
                          </div>
                          <p>{alert.body}</p>
                          <div className="row-flags">
                            <span className={`inline-flag ${alert.tone}`}>
                              <ToneFlagIcon tone={alert.tone} />
                              {alert.tone === 'danger'
                                ? 'блокер'
                                : alert.tone === 'warning'
                                  ? 'нужен разбор'
                                  : 'только демо'}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <p className="eyebrow">Последние события</p>
                      <h3>Лента операций</h3>
                    </div>
                  </div>
                  <div className="activity-list">
                    {activityFeed.map((item) => (
                      <article key={item.title} className="activity-row">
                        <span className={`activity-dot ${item.tone}`} />
                        <div>
                          <div className="row-flags">
                            <span className={`inline-flag ${item.tone}`}>
                              <ToneFlagIcon tone={item.tone} />
                              {item.tone === 'success' || item.tone === 'stable'
                                ? 'завершено'
                                : item.tone === 'warning' || item.tone === 'focus'
                                  ? 'в работе'
                                  : 'внимание'}
                            </span>
                          </div>
                          <strong>{item.title}</strong>
                          <p>{item.note}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-secondary">
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Как читать демо</p>
                    <h3>Не набор таблиц, а путь данных</h3>
                  </div>
                </div>
                <div className="detail-card">
                  <strong>Что важно увидеть</strong>
                  <p>
                    Демо показывает не абстрактную AI-схему, а последовательный инженерный
                    маршрут: как сырой список запросов превращается в сущности, кластеры,
                    типы страниц, структуру сайта, конфликты и финальные брифы.
                  </p>
                </div>
                <div className="journey-list">
                  {articleDemoSections.map((item, index) => (
                    <div key={item} className="journey-row">
                      <span className="journey-badge">{index + 1}</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Локальный запуск</p>
                    <h3>Как это прогнать руками</h3>
                  </div>
                </div>
                <div className="step-list">
                  {localRunSteps.map((step, index) => (
                    <div key={step} className="step-row">
                      <span className="step-index">{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
                <pre className="json-card">{localRunCommands.join('\n')}</pre>
                <div className="detail-card">
                  <strong>Зачем это делать</strong>
                  <p>
                    Чтобы не упираться в набор таблиц, понятных одному человеку, а руками
                    пройти весь путь: от сырых запросов до структуры страниц, конфликтов и
                    контент-брифов.
                  </p>
                </div>
                <div className="detail-card">
                  <strong>Статус сценария</strong>
                  <p>
                    Этот блок показывает целевой локальный walkthrough из статьи. Текущая версия
                    админки уже демонстрирует интерфейс и этапы, но полноценный реальный runner
                    для `.env` и `pipeline:demo` ещё не реализован.
                  </p>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Покрытие</p>
                    <h3>Типы страниц и ёмкость</h3>
                  </div>
                </div>
                <div className="stat-stack">
                  {pageTypeRows.map((row) => (
                    <div key={row.label} className="stat-row">
                      <div className="stat-title">
                        <div className="row-flags">
                          <span className="inline-flag neutral">
                            <Briefcase size={12} strokeWidth={2.2} />
                            {row.label.includes('Guide')
                              ? 'контент'
                              : row.label.includes('Brand')
                                ? 'бренд'
                                : row.label.includes('Geo')
                                  ? 'гео'
                                  : row.label.includes('Comparison')
                                    ? 'сравнение'
                                    : 'категория'}
                          </span>
                        </div>
                        <strong>{row.label}</strong>
                        <p>{row.note}</p>
                      </div>
                      <div className="stat-bar">
                        <div className="bar-fill" style={{ width: row.width }} />
                      </div>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Качество</p>
                    <h3>Рычаги оптимизации</h3>
                  </div>
                </div>
                <div className="secondary-metrics">
                  {secondaryMetricCards.map((metric: DemoBundle['dashboardMetrics'][number]) => (
                    <article key={metric.label} className="secondary-metric">
                      <div className="row-meta">
                        <strong>{metric.label}</strong>
                        <span className={`chip ${metric.tone}`}>{metric.delta}</span>
                      </div>
                      <p>{metric.note}</p>
                      <div className="row-flags">
                        <span className={`inline-flag ${metric.tone}`}>
                          <ToneFlagIcon tone={metric.tone} />
                          {metric.tone === 'risk'
                            ? 'эскалация'
                            : metric.tone === 'focus'
                              ? 'можно улучшить'
                              : 'эффективно'}
                        </span>
                      </div>
                      <div className="secondary-metric-value-wrap">
                        <span className="secondary-metric-value-label">Текущее значение</span>
                        <strong className="secondary-metric-value">{metric.value}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Главные риски</p>
                    <h3>Конфликтные кластеры</h3>
                  </div>
                </div>
                <div className="list-table">
                  {topConflicts.map((conflict) => (
                    <div className="list-row" key={conflict.cluster}>
                      <div>
                        <div className="row-flags">
                          <span className={`inline-flag ${conflict.severityTone}`}>
                            <AlertTriangle size={12} strokeWidth={2.2} />
                            {conflict.severity}
                          </span>
                        </div>
                        <strong>{conflict.cluster}</strong>
                        <p>{conflict.reason}</p>
                      </div>
                      <div className="row-meta">
                        <span className={`chip ${conflict.severityTone}`}>{conflict.severity}</span>
                        <span>{conflict.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <div>
                    <p className="eyebrow">Путь данных</p>
                    <h3>Что именно показывает демо</h3>
                  </div>
                </div>
                <div className="journey-list">
                  {pipelineJourney.map((item, index) => (
                    <div key={item} className="journey-row">
                      <span className="journey-badge">{index + 1}</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
                <div className="detail-card">
                  <strong>Что это за интерфейс</strong>
                  <p>
                    Это не попытка изобразить очередной AI SEO-сервис. Демо нужно как
                    инженерное сопровождение статьи, чтобы читатель мог не только согласиться
                    с идеей, но и пройти систему руками.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'imports' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Импорт</p>
                  <h3>Таблица батчей</h3>
                </div>
                <div className="toolbar">
                  <span className="inline-flag neutral">
                    <Database size={12} strokeWidth={2.2} />
                    Всего в очереди
                  </span>
                  <span className="metric-pill-cell">{batches.length}</span>
                </div>
              </div>
              <div className="grid-table">
                <div className="grid-head six">
                  <span>Батч</span>
                  <span>Источник</span>
                  <span>Запросы</span>
                  <span>Создан</span>
                  <span>Статус</span>
                  <span>Ответственный</span>
                </div>
                {batches.map((row) => (
                  <div key={`${row.batch}-${row.createdAt}`} className="grid-line six">
                    <span className="table-cell-with-flag">
                      <span className={`inline-flag ${row.tone}`}>
                        <FolderUp size={12} strokeWidth={2.2} />
                        {row.status}
                      </span>
                      <span>{row.batch}</span>
                      </span>
                    <span>{humanize(row.source, sourceLabels)}</span>
                    <span className="metric-pill-cell">{row.queries}</span>
                    <span>{row.createdAt}</span>
                    <span className={`chip ${row.tone}`}>{humanize(row.status, statusLabels)}</span>
                    <span>{row.owner}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Загрузка</p>
                  <h3>Новый импорт</h3>
                </div>
                <div className="toolbar">
                  <span className="inline-flag neutral">
                    <FolderUp size={12} strokeWidth={2.2} />
                    Запросов в файле
                  </span>
                  <span className="metric-pill-cell">{uploadCount}</span>
                </div>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Файл или имя батча</span>
                  <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
                </label>
                <label className="field">
                  <span>Источник</span>
                  <select value={uploadSource} onChange={(e) => setUploadSource(e.target.value)}>
                    <option>CSV import</option>
                    <option>gsc</option>
                    <option>URL parser</option>
                    <option>manual</option>
                  </select>
                </label>
                <label className="field">
                  <span>Ответственный</span>
                  <input value={uploadOwner} onChange={(e) => setUploadOwner(e.target.value)} />
                </label>
                <label className="field">
                  <span>Ожидаемое число запросов</span>
                  <input value={uploadCount} onChange={(e) => setUploadCount(e.target.value)} />
                </label>
                <label className="field full">
                  <span>Файл для демо</span>
                  <div className="file-upload-shell">
                    <label className="file-upload-button">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setUploadName(file.name)
                          }
                        }}
                      />
                      <FolderUp size={15} strokeWidth={2.2} />
                      Выбрать CSV или XLSX
                    </label>
                    <div className="file-upload-meta">
                      <strong>{uploadName}</strong>
                      <p>Файл нужен только для демо-интерфейса. На сервер ничего не отправляется.</p>
                    </div>
                  </div>
                </label>
              </div>
              <div className="detail-card">
                <strong>Где хранятся демо-данные</strong>
                <p>
                  Метаданные загрузки и очередь батчей сохраняются в `localStorage` браузера.
                  Сам файл не отправляется на сервер и не обрабатывается по-настоящему.
                </p>
              </div>
              <div className="toolbar">
                <button type="button" className="secondary-action" onClick={handleUploadBatch}>
                  Сохранить черновик
                </button>
                <button type="button" className="primary-action" onClick={handleSaveAndRun}>
                  Сохранить и запустить
                </button>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'settings' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Настройки</p>
                  <h3>Проект и хранение данных</h3>
                </div>
                <span className="chip neutral">сохранено: {savedAt}</span>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Название проекта</span>
                  <input
                    value={settings.projectName}
                    onChange={(e) => setSettings((current) => ({ ...current, projectName: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Домен</span>
                  <input
                    value={settings.domain}
                    onChange={(e) => setSettings((current) => ({ ...current, domain: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Провайдер</span>
                  <select
                    value={settings.llmProvider}
                    onChange={(e) => setSettings((current) => ({ ...current, llmProvider: e.target.value }))}
                  >
                    <option>OpenAI</option>
                    <option>Cerebras</option>
                    <option>Hybrid</option>
                  </select>
                </label>
                <label className="field">
                  <span>Модель</span>
                  <input
                    value={settings.model}
                    onChange={(e) => setSettings((current) => ({ ...current, model: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Модель эмбеддингов</span>
                  <input
                    value={settings.embeddingsModel}
                    onChange={(e) => setSettings((current) => ({ ...current, embeddingsModel: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Режим хранения</span>
                  <input
                    value={settings.storageMode}
                    onChange={(e) => setSettings((current) => ({ ...current, storageMode: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Путь хранения</span>
                  <input
                    value={settings.storagePath}
                    onChange={(e) => setSettings((current) => ({ ...current, storagePath: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Примечания</span>
                  <textarea
                    rows={4}
                    value={settings.notes}
                    onChange={(e) => setSettings((current) => ({ ...current, notes: e.target.value }))}
                  />
                </label>
              </div>
              <div className="toolbar">
                <button type="button" className="primary-action" onClick={handleSaveSettings}>
                  Сохранить настройки
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">API Keys</p>
                  <h3>Ввод демо-ключей</h3>
                </div>
              </div>
              <div className="form-grid">
                <label className="field full">
                  <span>Ключ OpenAI API</span>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={settings.openaiKey}
                    onChange={(e) => setSettings((current) => ({ ...current, openaiKey: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Ключ Cerebras API</span>
                  <input
                    type="password"
                    placeholder="csk-..."
                    value={settings.cerebrasKey}
                    onChange={(e) => setSettings((current) => ({ ...current, cerebrasKey: e.target.value }))}
                  />
                </label>
              </div>
              <div className="detail-card">
                <strong>Где хранятся ключи в демо</strong>
                <p>
                  Ключи сохраняются только локально в `localStorage` этого браузера.
                  В демо нет backend, database или secret vault. Это имитация рабочей
                  панели настройки, а не безопасное production-хранилище.
                </p>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Текущий провайдер</span>
                  <p>{settings.llmProvider}</p>
                </div>
                <div className="mini-box">
                  <span>Текущее хранилище</span>
                  <p>{settings.storageMode}</p>
                </div>
              </div>
              <div className="toolbar">
                <button type="button" className="primary-action" onClick={handleSaveSettings}>
                  Сохранить API-настройки
                </button>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'raw' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Сырые запросы</p>
                <h3>Сырьё без прикрас</h3>
              </div>
              <div className="toolbar">
                <span className="chip neutral">гео: Moscow</span>
                <span className="chip neutral">без кластера: 74</span>
                <span className="chip warning">мусор: 28</span>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head seven">
                <span>Запрос</span>
                <span>Нормализовано</span>
                <span>Источник</span>
                <span>Частота</span>
                <span>Geo</span>
                <span>Флаг</span>
                <span>Статус</span>
              </div>
              {queryRows.map((row) => (
                <div key={row.query} className="grid-line seven">
                  <span>{row.query}</span>
                  <span>{row.normalized}</span>
                  <span>{humanize(row.source, sourceLabels)}</span>
                  <span>{row.frequency}</span>
                  <span>{row.geo}</span>
                  <span className={`chip ${row.flagTone}`}>{humanize(row.flag, flagLabels)}</span>
                  <span className={`chip ${row.statusTone}`}>{humanize(row.status, statusLabels)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeScreen === 'parsing' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Семантический разбор</p>
                  <h3>Извлечение сущностей</h3>
                </div>
              </div>
              <div className="grid-table">
                <div className="grid-head eight">
                  <span>Запрос</span>
                  <span>Сущность</span>
                  <span>Тип</span>
                  <span>Атрибуты</span>
                  <span>Geo</span>
                  <span>Интент</span>
                  <span>Confidence</span>
                  <span>Проверка</span>
                </div>
                {parseRows.map((row) => (
                  <div key={row.query} className="grid-line eight">
                    <span>{row.query}</span>
                    <span>{row.entity}</span>
                    <span>{row.entityType}</span>
                    <span>{row.attributes}</span>
                    <span>{row.geo}</span>
                    <span>{humanize(row.intent, intentLabels)}</span>
                    <span>{row.confidence}</span>
                    <span className={`chip ${row.reviewTone}`}>{humanize(row.review, reviewLabels)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Проверка</p>
                  <h3>Structured output</h3>
                </div>
              </div>
              <div className="detail-card">
                <strong>лучшие беговые кроссовки для асфальта</strong>
                <p>Rule-based слой определил интент сравнения. LLM подтвердил candidate для guide/comparison и не потребовал ручной проверки.</p>
                <pre className="json-card">
{`{
  "entity": "беговые кроссовки",
  "entity_type": "product_category",
  "attributes": ["для асфальта"],
  "modifiers": ["лучшие"],
  "geo": null,
  "intent": "comparison",
  "page_type_candidate": "comparison-page",
  "confidence": 0.91
}`}
                </pre>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'clusters' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Кластеры</p>
                  <h3>Единицы page intent</h3>
                </div>
              </div>
              <div className="cluster-list">
                {clusterRows.map((cluster) => (
                  <button
                    key={cluster.id}
                    type="button"
                    className={selectedCluster.id === cluster.id ? 'cluster-row active' : 'cluster-row'}
                    onClick={() => setSelectedClusterId(cluster.id)}
                  >
                    <div>
                      <strong>{cluster.label}</strong>
                      <p>{cluster.entity}</p>
                    </div>
                    <div className="row-meta">
                      <span className={`chip ${cluster.intentTone}`}>{humanize(cluster.intent, intentLabels)}</span>
                      <span>{cluster.frequency}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Детали кластера</p>
                  <h3>{selectedCluster.label}</h3>
                </div>
                <span className={`chip ${selectedCluster.statusTone}`}>{humanize(selectedCluster.status, statusLabels)}</span>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Тип страницы</span>
                  <p>{humanize(selectedCluster.pageType, pageTypeLabels)}</p>
                </div>
                <div className="mini-box">
                  <span>Рекомендуемый H1</span>
                  <p>{selectedCluster.h1}</p>
                </div>
                <div className="mini-box">
                  <span>Рекомендуемый slug</span>
                  <p>{selectedCluster.slug}</p>
                </div>
                <div className="mini-box">
                  <span>Найденный URL</span>
                  <p>{selectedCluster.matchedUrl}</p>
                </div>
              </div>
              <div className="detail-card">
                <strong>Входящие запросы</strong>
                <p>{selectedCluster.queries}</p>
              </div>
              <div className="toolbar">
                <button type="button" className="secondary-action">
                  Объединить
                </button>
                <button type="button" className="secondary-action">
                  Разделить
                </button>
                <button type="button" className="primary-action">
                  Подтвердить тип страницы
                </button>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'structure' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Структура сайта</p>
                  <h3>Дерево URL</h3>
                </div>
              </div>
              <div className="tree-list">
                {siteNodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={selectedNode.id === node.id ? 'tree-node active' : 'tree-node'}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ paddingLeft: `${1 + node.level * 1.25}rem` }}
                  >
                    <div>
                      <strong>{node.label}</strong>
                      <p>{node.url}</p>
                    </div>
                    <span className={`chip ${node.tone}`}>{humanize(node.pageType, pageTypeLabels)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Выбранный узел</p>
                  <h3>{selectedNode.label}</h3>
                </div>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Родитель</span>
                  <p>{selectedNode.parent}</p>
                </div>
                <div className="mini-box">
                  <span>Тип страницы</span>
                  <p>{humanize(selectedNode.pageType, pageTypeLabels)}</p>
                </div>
                <div className="mini-box">
                  <span>Целевой кластер</span>
                  <p>{selectedNode.cluster}</p>
                </div>
                <div className="mini-box">
                  <span>Статус URL</span>
                  <p>{humanize(selectedNode.origin, originLabels)}</p>
                </div>
              </div>
              <div className="detail-card">
                <strong>Заметки по AI visibility</strong>
                <p>{selectedNode.aiNote}</p>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'matcher' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Сопоставление URL</p>
                <h3>Пересечения с текущим каталогом</h3>
              </div>
              <div className="toolbar">
                <span className="chip neutral">только проблемные</span>
                <span className="chip success">confidence &gt; 0.85</span>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Кластер</span>
                <span>Рекомендуемый slug</span>
                <span>Существующий URL</span>
                <span>Тип совпадения</span>
                <span>Confidence</span>
                <span>Действие</span>
              </div>
              {urlMatches.map((row) => (
                <div key={row.cluster} className="grid-line six">
                  <span>{row.cluster}</span>
                  <span>{row.slug}</span>
                  <span>{row.url}</span>
                  <span>{row.type}</span>
                  <span>{row.confidence}</span>
                  <span className={`chip ${row.tone}`}>{humanize(row.action, matchActionLabels)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeScreen === 'prompts' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">LLM Studio</p>
                  <h3>Реестр промптов</h3>
                </div>
              </div>
              <div className="prompt-list">
                {promptRows.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    className={selectedPrompt.id === prompt.id ? 'prompt-row active' : 'prompt-row'}
                    onClick={() => setSelectedPromptId(prompt.id)}
                  >
                    <div>
                      <strong>{prompt.name}</strong>
                      <p>{humanize(prompt.stage, promptStageLabels)}</p>
                    </div>
                    <div className="row-meta">
                      <span>{prompt.model}</span>
                      <span>{prompt.passRate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Детали промпта</p>
                  <h3>{selectedPrompt.name}</h3>
                </div>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Этап</span>
                  <p>{humanize(selectedPrompt.stage, promptStageLabels)}</p>
                </div>
                <div className="mini-box">
                  <span>Версия</span>
                  <p>{selectedPrompt.version}</p>
                </div>
                <div className="mini-box">
                  <span>Средняя задержка</span>
                  <p>{selectedPrompt.latency}</p>
                </div>
                <div className="mini-box">
                  <span>Средняя стоимость</span>
                  <p>{selectedPrompt.cost}</p>
                </div>
              </div>
              <pre className="json-card">{selectedPrompt.schema}</pre>
            </div>
          </section>
        )}

        {activeScreen === 'review' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Очередь проверки</p>
                <h3>Human in the loop</h3>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Объект</span>
                <span>Тип</span>
                <span>Проблема</span>
                <span>Критичность</span>
                <span>Назначено</span>
                <span>Статус</span>
              </div>
              {reviewRows.map((row) => (
                <div key={row.item} className="grid-line six">
                  <span>{row.item}</span>
                  <span>{humanize(row.type, reviewTypeLabels)}</span>
                  <span>{row.issue}</span>
                  <span className={`chip ${row.severityTone}`}>{row.severity}</span>
                  <span>{row.assigned}</span>
                  <span className={`chip ${row.statusTone}`}>{humanize(row.status, statusLabels)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeScreen === 'briefs' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Контент-брифы</p>
                <h3>Готово для редакции</h3>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Страница</span>
                <span>Тип</span>
                <span>Целевой интент</span>
                <span>Кластер</span>
                <span>Статус</span>
                <span>Ответственный</span>
              </div>
              {briefRows.map((row) => (
                <div key={row.page} className="grid-line six">
                  <span>{row.page}</span>
                  <span>{humanize(row.pageType, pageTypeLabels)}</span>
                  <span>{humanize(row.intent, intentLabels)}</span>
                  <span>{row.cluster}</span>
                  <span className={`chip ${row.tone}`}>{humanize(row.status, statusLabels)}</span>
                  <span>{row.owner}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
