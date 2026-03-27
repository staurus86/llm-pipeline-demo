# Decide Page Type

## Goal

Map a validated cluster to the most appropriate page type and propose a candidate H1 and slug.

## Allowed Page Types

- category
- brand-page
- filter-page
- guide-page
- comparison-page
- geo-page
- no-page-needed

## Output JSON

```json
{
  "page_type": "category | brand-page | filter-page | guide-page | comparison-page | geo-page | no-page-needed",
  "recommended_h1": "string",
  "slug_candidate": "string",
  "manual_review": true,
  "reasoning_summary": "string"
}
```

## Decision Heuristics

- prefer existing catalog structures where possible
- avoid generating new pages for support-only intent
- route geo demand to geo pages only when structure justifies it
- comparison and editorial demand should not collide silently with commercial PLPs

