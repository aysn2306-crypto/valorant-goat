#!/usr/bin/env bash
# Starts the vendored vlrggapi server on http://127.0.0.1:3001 (needed for event stats).
set -euo pipefail
cd "$(dirname "$0")/../vendor/vlrggapi"
exec python -m uvicorn main:app --port 3001
