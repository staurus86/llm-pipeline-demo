from __future__ import annotations

import csv
import json
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    input_path = root / "data" / "demo-raw-queries.json"
    output_path = root / "data" / "demo-raw-queries.csv"

    items = json.loads(input_path.read_text(encoding="utf-8"))

    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["query", "source", "frequency", "geo"])
        writer.writeheader()
        writer.writerows(items)

    print(f"Exported {len(items)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
