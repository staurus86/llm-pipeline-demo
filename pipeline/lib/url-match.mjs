export function buildUrlMatches(clusterRows) {
  return clusterRows.slice(0, 8).map((cluster) => ({
    cluster: cluster.label,
    slug: cluster.slug,
    url: cluster.matchedUrl,
    type: cluster.matchedUrl === 'none' ? 'new page candidate' : 'semantic match',
    confidence: cluster.status === 'approved' ? '0.92' : '0.74',
    action:
      cluster.matchedUrl === 'none'
        ? 'create new'
        : cluster.status === 'approved'
          ? 'merge existing'
          : 'review merge',
    tone:
      cluster.matchedUrl === 'none'
        ? 'neutral'
        : cluster.status === 'approved'
          ? 'success'
          : 'warning',
  }))
}

