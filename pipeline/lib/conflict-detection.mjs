export function uniqueBy(items, key) {
  return [...new Map(items.map((item) => [item[key], item])).values()]
}

export function buildReviewRows(queryRows, clusterRows) {
  return uniqueBy(
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
}

export function buildTopConflicts(reviewRows) {
  return reviewRows.slice(0, 3).map((item) => ({
    cluster: item.item,
    reason: item.issue,
    severity: item.severity,
    severityTone: item.severityTone,
    owner: item.assigned,
  }))
}

