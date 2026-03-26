import { useState } from 'react'
import './App.css'
import {
  architectureNodes,
  checks,
  clusterJourney,
  metrics,
  prompts,
  queryRows,
  stages,
} from './data'

function App() {
  const [activeStageId, setActiveStageId] = useState(stages[0].id)
  const activeStage = stages.find((stage) => stage.id === activeStageId) ?? stages[0]

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">LLM Pipeline Demo</p>
          <h1>Захват ниши начинается не с текста, а с инженерии спроса.</h1>
          <p className="hero-summary">
            Демонстрационный продукт показывает, как сырой список запросов
            превращается в кластеры, типы страниц, H1, URL и AI-ready артефакты
            для SEO-команды.
          </p>
          <div className="hero-actions">
            <a href="#pipeline-map">Смотреть pipeline</a>
            <a href="#cluster-route" className="ghost-link">
              Один кластер целиком
            </a>
          </div>
        </div>

        <aside className="hero-aside">
          <div className="status-card">
            <span>Demo dataset</span>
            <strong>54 raw queries</strong>
            <p>Окна / коммерческий сегмент / Москва и регионы</p>
          </div>
          <div className="status-card warm">
            <span>Output</span>
            <strong>17 production-ready pages</strong>
            <p>Категории, фильтры, FAQ, comparison и geo pages</p>
          </div>
        </aside>
      </section>

      <section className="metrics-grid" aria-label="Pipeline metrics">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="section-block" id="pipeline-map">
        <div className="section-header">
          <p className="eyebrow">Pipeline Map</p>
          <h2>Контролируемый LLM workflow вместо генерации в вакууме</h2>
          <p>
            LLM встроен как ускоритель на этапах нормализации, типизации и
            объяснения спорных кейсов. Каждое решение проходит через правила,
            словари и ручной QA.
          </p>
        </div>

        <div className="pipeline-layout">
          <nav className="stage-rail" aria-label="Stages">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                className={stage.id === activeStage.id ? 'stage-chip active' : 'stage-chip'}
                onClick={() => setActiveStageId(stage.id)}
              >
                <span>{stage.index}</span>
                <strong>{stage.title}</strong>
              </button>
            ))}
          </nav>

          <article className="stage-detail">
            <div className="stage-topline">
              <p>{activeStage.tag}</p>
              <span>{activeStage.automation}</span>
            </div>
            <h3>{activeStage.title}</h3>
            <p className="detail-text">{activeStage.description}</p>
            <div className="detail-grid">
              <div>
                <h4>Что делает этап</h4>
                <ul>
                  {activeStage.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Обязательные проверки</h4>
                <ul>
                  {activeStage.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sample-box">
              <span>Sample output</span>
              <code>{activeStage.output}</code>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header narrow">
          <p className="eyebrow">Data Slice</p>
          <h2>Фрагмент сырых запросов и результата обработки</h2>
        </div>

        <div className="table-card">
          <div className="table-row table-head">
            <span>Raw query</span>
            <span>Intent</span>
            <span>Page type</span>
            <span>Canonical cluster</span>
          </div>
          {queryRows.map((row) => (
            <div className="table-row" key={row.raw}>
              <span>{row.raw}</span>
              <span>{row.intent}</span>
              <span>{row.pageType}</span>
              <span>{row.cluster}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block" id="cluster-route">
        <div className="section-header">
          <p className="eyebrow">One Cluster Route</p>
          <h2>От запроса до URL на одном рабочем примере</h2>
          <p>
            Этот блок нужен команде как explainability layer: видно, почему
            кластер остался отдельной страницей и какие поля у него появились на
            выходе.
          </p>
        </div>

        <div className="journey-grid">
          {clusterJourney.map((item) => (
            <article className="journey-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="double-panel">
        <article className="section-block compact">
          <div className="section-header narrow">
            <p className="eyebrow">Site Architecture</p>
            <h2>Какие типы страниц реально нужны сайту</h2>
          </div>
          <div className="architecture-list">
            {architectureNodes.map((node) => (
              <div className="architecture-node" key={node.title}>
                <div>
                  <strong>{node.title}</strong>
                  <p>{node.reason}</p>
                </div>
                <code>{node.url}</code>
              </div>
            ))}
          </div>
        </article>

        <article className="section-block compact">
          <div className="section-header narrow">
            <p className="eyebrow">Manual QA</p>
            <h2>Где человек обязателен</h2>
          </div>
          <div className="check-list">
            {checks.map((item) => (
              <div className="check-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-header">
          <p className="eyebrow">Prompt Pack</p>
          <h2>Промты в production-формате, а не магические заклинания</h2>
          <p>
            Каждый шаблон задает роль, ограничения, JSON-схему и антигаллюцинацию.
            Это делает LLM частью системы, а не отдельным оракулом.
          </p>
        </div>
        <div className="prompt-grid">
          {prompts.map((prompt) => (
            <article className="prompt-card" key={prompt.title}>
              <span>{prompt.tag}</span>
              <h3>{prompt.title}</h3>
              <p>{prompt.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
