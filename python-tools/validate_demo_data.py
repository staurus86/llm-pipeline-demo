from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path


REQUIRED_FIELDS = ("query", "source", "frequency", "geo")
ALLOWED_SOURCES = {"gsc", "suggest", "csv", "manual", "url parser"}


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    data_path = root / "data" / "demo-raw-queries.json"

    try:
        items = json.loads(data_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: file not found: {data_path}")
        return 1
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON in {data_path}: {exc}")
        return 1

    if not isinstance(items, list):
        print("ERROR: demo dataset must be a JSON array")
        return 1

    errors: list[str] = []
    normalized_queries: list[str] = []

    for index, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            errors.append(f"row {index}: expected object, got {type(item).__name__}")
            continue

        for field in REQUIRED_FIELDS:
            if field not in item:
                errors.append(f"row {index}: missing required field '{field}'")

        query = item.get("query")
        source = item.get("source")
        frequency = item.get("frequency")
        geo = item.get("geo")

        if not isinstance(query, str) or not query.strip():
            errors.append(f"row {index}: query must be a non-empty string")
        else:
            normalized_queries.append(query.strip().lower())

        if not isinstance(source, str) or source not in ALLOWED_SOURCES:
            errors.append(
                f"row {index}: source must be one of {sorted(ALLOWED_SOURCES)}, got {source!r}"
            )

        if not isinstance(frequency, int) or frequency < 0:
            errors.append(f"row {index}: frequency must be a non-negative integer")

        if not isinstance(geo, str) or not geo.strip():
            errors.append(f"row {index}: geo must be a non-empty string")

    duplicates = {query: count for query, count in Counter(normalized_queries).items() if count > 1}

    if duplicates:
        errors.append(
            "duplicate queries found: "
            + ", ".join(f"{query} ({count})" for query, count in sorted(duplicates.items()))
        )

    if errors:
        print("Validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    total_frequency = sum(item["frequency"] for item in items)
    geo_count = len({item["geo"] for item in items})
    print("Validation passed")
    print(f"- rows: {len(items)}")
    print(f"- total frequency: {total_frequency}")
    print(f"- sources: {', '.join(sorted({item['source'] for item in items}))}")
    print(f"- geo buckets: {geo_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
