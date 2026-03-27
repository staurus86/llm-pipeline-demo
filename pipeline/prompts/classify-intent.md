# Classify Intent

## Goal

Determine the dominant search intent and whether the query needs manual review.

## Allowed Intents

- commercial
- informational
- comparison
- local
- mixed

## Output JSON

```json
{
  "primary_intent": "commercial | informational | comparison | local | mixed",
  "secondary_intent": "string | null",
  "intent_confidence": 0.0,
  "needs_manual_review": true,
  "review_reason": "string | null"
}
```

## Review Triggers

- geo overlap
- support vs commercial ambiguity
- model-vs-category ambiguity
- comparison-vs-guide ambiguity

