from __future__ import annotations

import json
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    runtime_path = root / "public" / "demo-run.json"

    if not runtime_path.exists():
        print("ERROR: public/demo-run.json not found. Run `npm run pipeline:demo` first.")
        return 1

    bundle = json.loads(runtime_path.read_text(encoding="utf-8"))

    generated_at = bundle.get("generatedAt", "unknown")
    provider = bundle.get("provider", "unknown")
    model = bundle.get("model", "unknown")
    query_rows = bundle.get("queryRows", [])
    cluster_rows = bundle.get("clusterRows", [])
    review_rows = bundle.get("reviewRows", [])
    brief_rows = bundle.get("briefRows", [])
    url_matches = bundle.get("urlMatches", [])

    matched_existing = sum(1 for row in url_matches if row.get("action") == "merge existing")
    create_new = sum(1 for row in url_matches if row.get("action") == "create new")
    warnings = sum(1 for row in review_rows if row.get("severity") in {"medium", "high"})

    print("Demo Run Summary")
    print(f"- generated at: {generated_at}")
    print(f"- provider: {provider}")
    print(f"- model: {model}")
    print(f"- queries: {len(query_rows)}")
    print(f"- clusters: {len(cluster_rows)}")
    print(f"- review items: {len(review_rows)}")
    print(f"- brief items: {len(brief_rows)}")
    print(f"- matched existing URLs: {matched_existing}")
    print(f"- new page candidates: {create_new}")
    print(f"- medium/high review warnings: {warnings}")

    if cluster_rows:
        top_cluster = max(cluster_rows, key=lambda row: int(str(row.get("frequency", "0")).replace(",", "")))
        print(f"- top cluster: {top_cluster.get('label')} ({top_cluster.get('frequency')})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
