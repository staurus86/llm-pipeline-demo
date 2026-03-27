export function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/2026/g, '')
    .replace(/sale/g, 'скидки')
    .trim()
}

export function classifyQuery(raw) {
  const query = normalizeQuery(raw.query)

  if (/(скачать|ремонт|wildberries)/.test(query)) {
    return {
      flag: 'garbage',
      flagTone: 'danger',
      status: 'rejected',
      statusTone: 'danger',
      intent: 'mixed',
    }
  }
  if (/(как |таблица размеров|отзывы|стирать)/.test(query)) {
    return {
      flag: 'support intent',
      flagTone: 'warning',
      status: 'review',
      statusTone: 'warning',
      intent: 'informational',
    }
  }
  if (/(лучшие|или|vs)/.test(query)) {
    return {
      flag: 'review',
      flagTone: 'warning',
      status: 'clustered',
      statusTone: 'success',
      intent: 'comparison',
    }
  }
  if (/(москва|спб|санкт|казань)/.test(query)) {
    return {
      flag: 'geo review',
      flagTone: 'warning',
      status: 'parsed',
      statusTone: 'neutral',
      intent: 'local',
    }
  }
  if (/(hoka|pegasus|gel kayano|adizero|novablast)/.test(query)) {
    return {
      flag: 'model intent',
      flagTone: 'warning',
      status: 'review',
      statusTone: 'warning',
      intent: 'commercial',
    }
  }

  return {
    flag: 'clean',
    flagTone: 'success',
    status: 'clustered',
    statusTone: 'success',
    intent: 'commercial',
  }
}

export function buildQueryRows(rawItems) {
  return rawItems.map((item) => {
    const normalized = normalizeQuery(item.query)
    return {
      query: item.query,
      normalized,
      source: item.source,
      frequency: String(item.frequency),
      geo: item.geo,
      ...classifyQuery(item),
    }
  })
}

