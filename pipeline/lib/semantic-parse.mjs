import { normalizeQuery } from './preprocess.mjs'

export function getEntity(query) {
  if (/gel kayano/.test(query)) return ['asics gel kayano', 'product_model_family']
  if (/pegasus/.test(query)) return ['nike pegasus', 'product_model_family']
  if (/hoka clifton/.test(query)) return ['hoka clifton', 'product_model']
  if (/adidas/.test(query) && /nike/.test(query)) return ['adidas vs nike', 'brand_comparison']
  if (/nike/.test(query)) return ['nike', 'brand']
  if (/asics/.test(query)) return ['asics', 'brand']
  if (/salomon/.test(query)) return ['salomon', 'brand']
  return ['беговые кроссовки', 'product_category']
}

export function parseSemanticRows(queryRows, getCluster) {
  return queryRows
    .filter((row) => row.status !== 'rejected')
    .map((row) => {
      const normalized = normalizeQuery(row.normalized)
      const [entity, entityType] = getEntity(normalized)
      const [clusterId] = getCluster({ query: normalized })
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
}

