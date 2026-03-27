import { normalizeQuery } from './preprocess.mjs'
import { getEntity } from './semantic-parse.mjs'

export function getCluster(raw) {
  const query = normalizeQuery(raw.query)
  if (/асфальт|road/.test(query) && /женск/.test(query)) {
    return ['women-road-running-shoes', 'Женские беговые кроссовки для асфальта', 'filter-page']
  }
  if (/асфальт|road/.test(query)) {
    return ['road-running-shoes', 'Беговые кроссовки для асфальта', 'filter-page']
  }
  if (/марафон|полумарафон/.test(query)) {
    return ['marathon-running-shoes', 'Лучшие кроссовки для марафона', 'guide-page']
  }
  if (/adidas.*nike|nike.*adidas|vs/.test(query)) {
    return ['brand-comparison-running', 'Adidas или Nike для бега', 'comparison-page']
  }
  if (/spb|санкт|казань|москва/.test(query)) {
    return ['geo-running-shoes', 'Беговые кроссовки по городам', 'geo-page']
  }
  if (/nike/.test(query)) return ['nike-running-shoes', 'Беговые кроссовки Nike', 'brand-page']
  if (/asics|gel kayano/.test(query)) return ['asics-running-shoes', 'Беговые кроссовки ASICS', 'brand-page']
  if (/salomon|трейл/.test(query)) return ['trail-running-shoes', 'Кроссовки для трейлраннинга', 'filter-page']
  if (/плоскостоп/.test(query)) return ['support-running-shoes', 'Беговые кроссовки для плоскостопия', 'guide-page']
  return ['general-running-shoes', 'Беговые кроссовки', 'category']
}

export function slugify(label) {
  return label
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
}

export function buildClusterRows(queryRows) {
  const clustersMap = new Map()

  for (const row of queryRows.filter((item) => item.status !== 'rejected')) {
    const [id, h1, pageType] = getCluster({ query: row.normalized })
    const current = clustersMap.get(id) ?? {
      id,
      label: id,
      entity: getEntity(row.normalized)[0],
      intent: row.intent,
      intentTone:
        row.intent === 'commercial' ? 'success' : row.intent === 'comparison' ? 'warning' : 'neutral',
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

  return [...clustersMap.values()]
    .map((item) => ({
      ...item,
      frequency: item.frequency.toLocaleString('en-US'),
      queries: item.queries.join(', '),
    }))
    .sort(
      (a, b) =>
        Number.parseInt(b.frequency.replace(/,/g, ''), 10) -
        Number.parseInt(a.frequency.replace(/,/g, ''), 10),
    )
}

export function buildSiteNodes(clusterRows) {
  return clusterRows.slice(0, 8).map((cluster) => ({
    id: cluster.id,
    label: cluster.h1,
    url: cluster.slug,
    pageType: cluster.pageType,
    tone: cluster.statusTone,
    level: cluster.pageType === 'filter-page' ? 1 : 0,
    parent: cluster.pageType === 'filter-page' ? '/running-shoes/' : 'root',
    cluster: cluster.label,
    origin: cluster.matchedUrl === 'none' ? 'new' : 'matched existing',
    aiNote: `Кластер ${cluster.label} собран из демо-датасета и требует ${
      cluster.status === 'approved' ? 'минимальной' : 'дополнительной'
    } проверки.`,
  }))
}

