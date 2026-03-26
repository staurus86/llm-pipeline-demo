import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  batchRows,
  briefRows,
  clusterRows,
  dashboardMetrics,
  funnelStages,
  navItems,
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
} from './data'

type BatchRow = (typeof batchRows)[number]

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
  storageMode: 'Browser localStorage',
  storagePath: 'window.localStorage -> llm-pipeline-demo-*',
  notes:
    'Для демо ключи и настройки сохраняются только в localStorage браузера. Для реального проекта нужен backend vault.',
}

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [selectedClusterId, setSelectedClusterId] = useState(clusterRows[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState(siteNodes[0].id)
  const [selectedPromptId, setSelectedPromptId] = useState(promptRows[0].id)
  const [settings, setSettings] = useState<DemoSettings>(defaultSettings)
  const [savedAt, setSavedAt] = useState('not saved yet')
  const [batches, setBatches] = useState<BatchRow[]>(batchRows)
  const [uploadName, setUploadName] = useState('spring-running-shoes-01.csv')
  const [uploadSource, setUploadSource] = useState('csv import')
  const [uploadOwner, setUploadOwner] = useState('Nina')
  const [uploadCount, setUploadCount] = useState('842')
  const [isRunning, setIsRunning] = useState(false)
  const [searchValue, setSearchValue] = useState('')

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
    const storedSettings = window.localStorage.getItem(SETTINGS_KEY)
    const storedBatches = window.localStorage.getItem(BATCHES_KEY)

    if (storedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) })
      setSavedAt('restored from browser storage')
    }

    if (storedBatches) {
      setBatches(JSON.parse(storedBatches))
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(BATCHES_KEY, JSON.stringify(batches))
  }, [batches])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = window.setInterval(() => {
      setBatches((current) =>
        current.map((batch, index) => {
          if (index !== 0) {
            return batch
          }

          const progress = Math.min(Number.parseInt(batch.progress, 10) + 12, 100)
          return {
            ...batch,
            progress: `${progress}%`,
            status: progress >= 100 ? 'processed' : 'processing',
            tone: progress >= 100 ? 'success' : 'warning',
          }
        }),
      )
    }, 900)

    return () => window.clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (batches[0]?.progress === '100%' && isRunning) {
      setIsRunning(false)
    }
  }, [batches, isRunning])

  const activeBatch = batches[0] ?? batchRows[0]
  const effectiveOverview = [
    {
      ...overviewStats[0],
      value: activeBatch.batch,
      note: `${activeBatch.queries} queries / owner ${activeBatch.owner} / source ${activeBatch.source}`,
    },
    overviewStats[1],
    overviewStats[2],
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
          <p className="eyebrow">SEO AI Ops</p>
          <h1>Demand Graph Console</h1>
          <p>
            Админка превращает сырые запросы в кластеры, page candidates,
            URL-matches и review queue.
          </p>
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
          <span>Active Batch</span>
          <strong>{activeBatch.batch}</strong>
          <p>
            {activeBatch.queries} queries, {activeBatch.source}, {activeBatch.progress} complete
          </p>
        </div>

        <div className="sidebar-card sidebar-card-muted">
          <span>Workspace</span>
          <strong>{settings.projectName}</strong>
          <p>{settings.domain}</p>
        </div>
      </aside>

      <main className="workspace">
        <div className="utility-bar">
          <label className="search-shell">
            <span>Search</span>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search clusters, URLs, prompts"
            />
          </label>
          <div className="utility-actions">
            <span className="chip neutral">Review {reviewRows.length}</span>
            <span className="chip neutral">Batches {batches.length}</span>
            <span className="chip success">Storage local</span>
          </div>
        </div>

        <header className="workspace-header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2>{screenTitle.label}</h2>
            <p>{screenTitle.description}</p>
          </div>
          <div className="header-actions">
            <span className="chip neutral">LLM: {settings.model}</span>
            <span className={isRunning ? 'chip warning' : 'chip success'}>
              {isRunning ? 'pipeline running' : 'ready'}
            </span>
            <button
              type="button"
              className="secondary-action"
              onClick={() => setActiveScreen('settings')}
            >
              Settings
            </button>
            <button type="button" className="primary-action" onClick={handleRunPipeline}>
              Run pipeline
            </button>
          </div>
        </header>

        <section className="pipeline-strip" aria-label="Pipeline summary">
          {pipelineSummary.map((stage) => (
            <article key={stage.title} className={`pipeline-card ${stage.state}`}>
              <div className="pipeline-top">
                <span>{stage.title}</span>
                <strong>{stage.count}</strong>
              </div>
              <div className="pipeline-meta">
                <p>{stage.rate} success</p>
                <p>{stage.confidence} avg confidence</p>
                <p>{stage.errors} errors</p>
              </div>
              <div className="pipeline-progress">
                <div className="pipeline-progress-fill" style={{ width: stage.width }} />
              </div>
            </article>
          ))}
        </section>

        {activeScreen === 'dashboard' && (
          <section className="screen-grid">
            <div className="overview-strip full-span">
              {effectiveOverview.map((item) => (
                <article key={item.label} className="overview-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>

            <div className="metric-grid">
              {dashboardMetrics.map((metric) => (
                <article key={metric.label} className={`metric-card ${metric.tone}`}>
                  <div className="metric-head">
                    <span>{metric.label}</span>
                    <em className={`metric-delta ${metric.tone}`}>{metric.delta}</em>
                  </div>
                  <strong>{metric.value}</strong>
                  <p>{metric.note}</p>
                  <div className="sparkline" aria-hidden="true">
                    {metric.trend.map((value, index) => (
                      <i key={`${metric.label}-${index}`} style={{ height: `${value}%` }} />
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Funnel</p>
                  <h3>Pipeline health</h3>
                </div>
                <span className="chip neutral">batch progress {activeBatch.progress}</span>
              </div>
              <div className="funnel-list">
                {funnelStages.map((item) => (
                  <div className="funnel-row" key={item.title}>
                    <div>
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

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Top Risks</p>
                  <h3>Conflict clusters</h3>
                </div>
              </div>
              <div className="list-table">
                {topConflicts.map((conflict) => (
                  <div className="list-row" key={conflict.cluster}>
                    <div>
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
                  <p className="eyebrow">Page Types</p>
                  <h3>Distribution</h3>
                </div>
              </div>
              <div className="stat-stack">
                {pageTypeRows.map((row) => (
                  <div key={row.label} className="stat-row">
                    <div className="stat-title">
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

            <div className="panel full-span">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Batch Queue</p>
                  <h3>Recent imports</h3>
                </div>
              </div>
              <div className="grid-table">
                <div className="grid-head six">
                  <span>Batch</span>
                  <span>Source</span>
                  <span>Queries</span>
                  <span>Progress</span>
                  <span>Status</span>
                  <span>Owner</span>
                </div>
                {batches.map((row) => (
                  <div key={`${row.batch}-${row.createdAt}`} className="grid-line six">
                    <span>{row.batch}</span>
                    <span>{row.source}</span>
                    <span>{row.queries}</span>
                    <span>{row.progress}</span>
                    <span className={`chip ${row.tone}`}>{row.status}</span>
                    <span>{row.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'imports' && (
          <section className="two-column-screen">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Imports</p>
                  <h3>Batch table</h3>
                </div>
              </div>
              <div className="grid-table">
                <div className="grid-head six">
                  <span>Batch</span>
                  <span>Source</span>
                  <span>Queries</span>
                  <span>Created</span>
                  <span>Status</span>
                  <span>Owner</span>
                </div>
                {batches.map((row) => (
                  <div key={`${row.batch}-${row.createdAt}`} className="grid-line six">
                    <span>{row.batch}</span>
                    <span>{row.source}</span>
                    <span>{row.queries}</span>
                    <span>{row.createdAt}</span>
                    <span className={`chip ${row.tone}`}>{row.status}</span>
                    <span>{row.owner}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Upload Drawer</p>
                  <h3>New import batch</h3>
                </div>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>File / batch name</span>
                  <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
                </label>
                <label className="field">
                  <span>Source</span>
                  <select value={uploadSource} onChange={(e) => setUploadSource(e.target.value)}>
                    <option>csv import</option>
                    <option>gsc</option>
                    <option>url parser</option>
                    <option>manual</option>
                  </select>
                </label>
                <label className="field">
                  <span>Owner</span>
                  <input value={uploadOwner} onChange={(e) => setUploadOwner(e.target.value)} />
                </label>
                <label className="field">
                  <span>Expected queries</span>
                  <input value={uploadCount} onChange={(e) => setUploadCount(e.target.value)} />
                </label>
                <label className="field full">
                  <span>Demo file input</span>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setUploadName(file.name)
                      }
                    }}
                  />
                </label>
              </div>
              <div className="detail-card">
                <strong>Where demo data is stored</strong>
                <p>
                  Upload metadata and batch queue сохраняются в browser `localStorage`.
                  Сам файл не отправляется на сервер и не парсится по-настоящему.
                </p>
              </div>
              <div className="toolbar">
                <button type="button" className="secondary-action" onClick={handleUploadBatch}>
                  Save batch draft
                </button>
                <button type="button" className="primary-action" onClick={handleSaveAndRun}>
                  Save and run
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
                  <p className="eyebrow">Settings</p>
                  <h3>Project and storage config</h3>
                </div>
                <span className="chip neutral">saved: {savedAt}</span>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Project name</span>
                  <input
                    value={settings.projectName}
                    onChange={(e) => setSettings((current) => ({ ...current, projectName: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Domain</span>
                  <input
                    value={settings.domain}
                    onChange={(e) => setSettings((current) => ({ ...current, domain: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Provider</span>
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
                  <span>Model</span>
                  <input
                    value={settings.model}
                    onChange={(e) => setSettings((current) => ({ ...current, model: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Embeddings model</span>
                  <input
                    value={settings.embeddingsModel}
                    onChange={(e) => setSettings((current) => ({ ...current, embeddingsModel: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Storage mode</span>
                  <input
                    value={settings.storageMode}
                    onChange={(e) => setSettings((current) => ({ ...current, storageMode: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Storage path</span>
                  <input
                    value={settings.storagePath}
                    onChange={(e) => setSettings((current) => ({ ...current, storagePath: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Notes</span>
                  <textarea
                    rows={4}
                    value={settings.notes}
                    onChange={(e) => setSettings((current) => ({ ...current, notes: e.target.value }))}
                  />
                </label>
              </div>
              <div className="toolbar">
                <button type="button" className="primary-action" onClick={handleSaveSettings}>
                  Save config
                </button>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">API Keys</p>
                  <h3>Demo credential input</h3>
                </div>
              </div>
              <div className="form-grid">
                <label className="field full">
                  <span>OpenAI API key</span>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={settings.openaiKey}
                    onChange={(e) => setSettings((current) => ({ ...current, openaiKey: e.target.value }))}
                  />
                </label>
                <label className="field full">
                  <span>Cerebras API key</span>
                  <input
                    type="password"
                    placeholder="csk-..."
                    value={settings.cerebrasKey}
                    onChange={(e) => setSettings((current) => ({ ...current, cerebrasKey: e.target.value }))}
                  />
                </label>
              </div>
              <div className="detail-card">
                <strong>Where keys are saved in demo</strong>
                <p>
                  Ключи сохраняются только локально в `localStorage` этого браузера.
                  В demo нет backend, database или secret vault. Это имитация рабочей
                  панели настройки, а не безопасное production-хранилище.
                </p>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Current provider</span>
                  <p>{settings.llmProvider}</p>
                </div>
                <div className="mini-box">
                  <span>Current storage</span>
                  <p>{settings.storageMode}</p>
                </div>
              </div>
              <div className="toolbar">
                <button type="button" className="primary-action" onClick={handleSaveSettings}>
                  Save API config
                </button>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'raw' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Raw Queries</p>
                <h3>Сырье без прикрас</h3>
              </div>
              <div className="toolbar">
                <span className="chip neutral">geo: Moscow</span>
                <span className="chip neutral">unclustered: 74</span>
                <span className="chip warning">garbage: 28</span>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head seven">
                <span>Query</span>
                <span>Normalized</span>
                <span>Source</span>
                <span>Freq</span>
                <span>Geo</span>
                <span>Flag</span>
                <span>Status</span>
              </div>
              {queryRows.map((row) => (
                <div key={row.query} className="grid-line seven">
                  <span>{row.query}</span>
                  <span>{row.normalized}</span>
                  <span>{row.source}</span>
                  <span>{row.frequency}</span>
                  <span>{row.geo}</span>
                  <span className={`chip ${row.flagTone}`}>{row.flag}</span>
                  <span className={`chip ${row.statusTone}`}>{row.status}</span>
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
                  <p className="eyebrow">Semantic Parsing</p>
                  <h3>Entity extraction</h3>
                </div>
              </div>
              <div className="grid-table">
                <div className="grid-head eight">
                  <span>Query</span>
                  <span>Entity</span>
                  <span>Type</span>
                  <span>Attributes</span>
                  <span>Geo</span>
                  <span>Intent</span>
                  <span>Confidence</span>
                  <span>Review</span>
                </div>
                {parseRows.map((row) => (
                  <div key={row.query} className="grid-line eight">
                    <span>{row.query}</span>
                    <span>{row.entity}</span>
                    <span>{row.entityType}</span>
                    <span>{row.attributes}</span>
                    <span>{row.geo}</span>
                    <span>{row.intent}</span>
                    <span>{row.confidence}</span>
                    <span className={`chip ${row.reviewTone}`}>{row.review}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Inspection</p>
                  <h3>Structured output</h3>
                </div>
              </div>
              <div className="detail-card">
                <strong>лучшие беговые кроссовки для асфальта</strong>
                <p>Rule-based layer пометил comparison intent. LLM подтвердил guide/comparison candidate и поднял manual review в false.</p>
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
                  <p className="eyebrow">Clusters</p>
                  <h3>Page intent units</h3>
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
                      <span className={`chip ${cluster.intentTone}`}>{cluster.intent}</span>
                      <span>{cluster.frequency}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Cluster Detail</p>
                  <h3>{selectedCluster.label}</h3>
                </div>
                <span className={`chip ${selectedCluster.statusTone}`}>{selectedCluster.status}</span>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Page type</span>
                  <p>{selectedCluster.pageType}</p>
                </div>
                <div className="mini-box">
                  <span>Suggested H1</span>
                  <p>{selectedCluster.h1}</p>
                </div>
                <div className="mini-box">
                  <span>Suggested slug</span>
                  <p>{selectedCluster.slug}</p>
                </div>
                <div className="mini-box">
                  <span>Matched URL</span>
                  <p>{selectedCluster.matchedUrl}</p>
                </div>
              </div>
              <div className="detail-card">
                <strong>Incoming queries</strong>
                <p>{selectedCluster.queries}</p>
              </div>
              <div className="toolbar">
                <button type="button" className="secondary-action">
                  Merge
                </button>
                <button type="button" className="secondary-action">
                  Split
                </button>
                <button type="button" className="primary-action">
                  Approve page type
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
                  <p className="eyebrow">Site Structure</p>
                  <h3>URL tree</h3>
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
                    <span className={`chip ${node.tone}`}>{node.pageType}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Selected Node</p>
                  <h3>{selectedNode.label}</h3>
                </div>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Parent</span>
                  <p>{selectedNode.parent}</p>
                </div>
                <div className="mini-box">
                  <span>Page type</span>
                  <p>{selectedNode.pageType}</p>
                </div>
                <div className="mini-box">
                  <span>Target cluster</span>
                  <p>{selectedNode.cluster}</p>
                </div>
                <div className="mini-box">
                  <span>Existing / New</span>
                  <p>{selectedNode.origin}</p>
                </div>
              </div>
              <div className="detail-card">
                <strong>AI visibility notes</strong>
                <p>{selectedNode.aiNote}</p>
              </div>
            </div>
          </section>
        )}

        {activeScreen === 'matcher' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">URL Matcher</p>
                <h3>Existing catalog overlap</h3>
              </div>
              <div className="toolbar">
                <span className="chip neutral">show unresolved</span>
                <span className="chip success">confidence &gt; 0.85</span>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Cluster</span>
                <span>Suggested slug</span>
                <span>Existing URL</span>
                <span>Match type</span>
                <span>Confidence</span>
                <span>Action</span>
              </div>
              {urlMatches.map((row) => (
                <div key={row.cluster} className="grid-line six">
                  <span>{row.cluster}</span>
                  <span>{row.slug}</span>
                  <span>{row.url}</span>
                  <span>{row.type}</span>
                  <span>{row.confidence}</span>
                  <span className={`chip ${row.tone}`}>{row.action}</span>
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
                  <h3>Prompt registry</h3>
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
                      <p>{prompt.stage}</p>
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
                  <p className="eyebrow">Prompt Detail</p>
                  <h3>{selectedPrompt.name}</h3>
                </div>
              </div>
              <div className="detail-grid">
                <div className="mini-box">
                  <span>Stage</span>
                  <p>{selectedPrompt.stage}</p>
                </div>
                <div className="mini-box">
                  <span>Version</span>
                  <p>{selectedPrompt.version}</p>
                </div>
                <div className="mini-box">
                  <span>Avg latency</span>
                  <p>{selectedPrompt.latency}</p>
                </div>
                <div className="mini-box">
                  <span>Avg cost</span>
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
                <p className="eyebrow">Review Queue</p>
                <h3>Human in the loop</h3>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Item</span>
                <span>Type</span>
                <span>Issue</span>
                <span>Severity</span>
                <span>Assigned</span>
                <span>Status</span>
              </div>
              {reviewRows.map((row) => (
                <div key={row.item} className="grid-line six">
                  <span>{row.item}</span>
                  <span>{row.type}</span>
                  <span>{row.issue}</span>
                  <span className={`chip ${row.severityTone}`}>{row.severity}</span>
                  <span>{row.assigned}</span>
                  <span className={`chip ${row.statusTone}`}>{row.status}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeScreen === 'briefs' && (
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Content Briefs</p>
                <h3>Ready for editors</h3>
              </div>
            </div>
            <div className="grid-table">
              <div className="grid-head six">
                <span>Page</span>
                <span>Type</span>
                <span>Target intent</span>
                <span>Cluster</span>
                <span>Status</span>
                <span>Owner</span>
              </div>
              {briefRows.map((row) => (
                <div key={row.page} className="grid-line six">
                  <span>{row.page}</span>
                  <span>{row.pageType}</span>
                  <span>{row.intent}</span>
                  <span>{row.cluster}</span>
                  <span className={`chip ${row.tone}`}>{row.status}</span>
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
