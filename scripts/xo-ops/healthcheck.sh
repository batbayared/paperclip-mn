#!/usr/bin/env bash
set -uo pipefail

# Polls the XO server health endpoint. After $XO_HEALTH_FAILS consecutive failures it shows
# a macOS notification and, when XO_LAUNCHD_LABEL is set, restarts that launchd job.
#
# Env:
#   XO_HEALTH_URL       (default: http://127.0.0.1:3100/api/health)
#   XO_HEALTH_FAILS     failures before acting (default: 3)
#   XO_LAUNCHD_LABEL    launchd label of the XO server job (optional)
#   XO_HEALTH_STATE     failure counter file (default: /Users/Shared/xo/healthcheck.state)

URL="${XO_HEALTH_URL:-http://127.0.0.1:3100/api/health}"
MAX_FAILS="${XO_HEALTH_FAILS:-3}"
STATE="${XO_HEALTH_STATE:-/Users/Shared/xo/healthcheck.state}"

log() { printf '%s [xo-health] %s\n' "$(date '+%F %T')" "$*"; }

fails=$(cat "$STATE" 2>/dev/null || echo 0)

if curl -fsS -m 10 "$URL" | grep -q '"status":"ok"'; then
  [ "$fails" -gt 0 ] && log "recovered after $fails failure(s)"
  echo 0 > "$STATE"
  exit 0
fi

fails=$((fails + 1))
echo "$fails" > "$STATE"
log "health check failed ($fails/$MAX_FAILS): $URL"

if [ "$fails" -ge "$MAX_FAILS" ]; then
  osascript -e "display notification \"XO сервер $fails удаа хариу өгсөнгүй\" with title \"XO health\"" 2>/dev/null || true
  if [ -n "${XO_LAUNCHD_LABEL:-}" ]; then
    log "restarting launchd job $XO_LAUNCHD_LABEL"
    launchctl kickstart -k "gui/$(id -u)/$XO_LAUNCHD_LABEL" || log "kickstart failed"
  fi
  echo 0 > "$STATE"
fi
exit 1
