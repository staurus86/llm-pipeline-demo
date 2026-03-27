export function buildBriefRows(clusterRows) {
  return clusterRows.slice(0, 8).map((cluster, index) => ({
    page: cluster.h1,
    pageType: cluster.pageType,
    intent: cluster.intent,
    cluster: cluster.label,
    status: cluster.status === 'approved' ? 'brief_ready' : index % 2 === 0 ? 'awaiting_approval' : 'in_review',
    tone: cluster.status === 'approved' ? 'success' : 'warning',
    owner: cluster.pageType === 'guide-page' ? 'Editorial team' : 'SEO team',
  }))
}

