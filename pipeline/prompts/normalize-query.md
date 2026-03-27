# Normalize Query

## Goal

Convert a raw search query into a normalized canonical form for downstream pipeline stages.

## Input

- raw query
- source
- geo

## Output JSON

```json
{
  "normalized_query": "string",
  "tokens": ["string"],
  "modifiers": ["string"],
  "is_garbage": true,
  "garbage_reason": "string | null",
  "confidence_score": 0.0
}
```

## Rules

- lowercase the query
- remove accidental whitespace noise
- preserve core commercial modifiers
- mark obvious junk, support-only or marketplace noise when not suitable for page generation

