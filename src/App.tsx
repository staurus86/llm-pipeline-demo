import { useMemo, useState } from 'react'
import './App.css'
import {
  batchRows,
  briefRows,
  clusterRows,
  dashboardMetrics,
  funnelStages,
  navItems,
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

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard')
  const [selectedClusterId, setSelectedClusterId] = useState(clusterRows[0].id)
  const [selectedNodeId, setSelectedNodeId] = useState(siteNodes[0].id)
  const [selectedPromptId, setSelectedPromptId] = useState(promptRows[0].id)

  const selectedCluster =
    clusterRows.find((cluster) => cluster.id === selectedClusterId) ?? clusterRows[0]
  const selectedNode = siteNodes.find((node) => node.id === selectedNodeId) ?? siteNodes[0]
  const selectedPrompt =
    promptRows.find((prompt) => prompt.id === selectedPromptId) ?? promptRows[0]

  const screenTitle = useMemo(
    () => navItems.find((item) => item.id === activeScreen) ?? navItems[0],
    [activeScreen],
  )

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
          <strong>spring-running-shoes-01</strong>
          <p>842 queries from GSC, suggest parser and competitor URLs.</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h2>{screenTitle.label}</h2>
            <p>{screenTitle.description}</p>
          </div>
          <div className="header-actions">
            <button type="button" className="secondary-action">
              Dry run
            </button>
            <button type="button" className="primary-action">
              Run pipeline
            </button>
          </div>
        </header>

        <section className="pipeline-strip" aria-label="Pipeline summary">
          {pipelineSummary.map((stage) => (
            <article key={stage.title} className="pipeline-card">
              <div className="pipeline-top">
                <span>{stage.title}</span>
                <strong>{stage.count}</strong>
              </div>
              <div className="pipeline-meta">
                <p>{stage.rate} success</p>
                <p>{stage.confidence} avg confidence</p>
                <p>{stage.errors} errors</p>
              </div>
            </article>
          ))}
        </section>

        {activeScreen === 'dashboard' && (
          <section className="screen-grid">
            <div className="metric-grid">
              {dashboardMetrics.map((metric) => (
                <article key={metric.label} className="metric-card">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.note}</p>
                </article>
              ))}
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="eyebrow">Funnel</p>
                  <h3>Pipeline health</h3>
                </div>
                <span className="chip neutral">Batch updated 8 min ago</span>
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
                {batchRows.map((row) => (
                  <div key={row.batch} className="grid-line six">
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
                {batchRows.map((row) => (
                  <div key={row.batch} className="grid-line six">
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
                  <p className="eyebrow">Drawer</p>
                  <h3>Upload preview</h3>
                </div>
              </div>
              <div className="detail-card">
                <strong>spring-running-shoes-01.csv</strong>
                <p>CSV columns mapped to `query_text`, `source`, `frequency`, `region` and `source_url`.</p>
                <div className="mini-stack">
                  <div className="mini-box">
                    <span>Rows preview</span>
                    <p>842 / 842 valid</p>
                  </div>
                  <div className="mini-box">
                    <span>Dry run</span>
                    <p>18 risky rows detected before parse</p>
                  </div>
                  <div className="mini-box">
                    <span>API cost</span>
                    <p>$7.80 estimated with GPT-5.4-mini</p>
                  </div>
                </div>
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
