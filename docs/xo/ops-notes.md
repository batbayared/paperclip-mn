# XO ops notes

## Port fallback

If the requested port (default 3100, or `PORT`) is busy, the server does not fail. `detectPort` (`server/src/index.ts:679-683`) picks the next free port and logs:

```
Requested port is busy; using next free port (requestedPort=3100, selectedPort=3101)
```

(`server/src/index.ts:931-933`.) The UI and agents then live on `selectedPort`, so a bookmark or launch config pointing at 3100 shows a different instance or nothing.

What to do:

1. Read `selectedPort` from that log line.
2. Find what holds the requested port: `lsof -nP -iTCP:3100 -sTCP:LISTEN`.
3. Stop the stale process, or pin a free port explicitly with `PORT=3110` (as the `xo-y3b-test` launch config does).

XO keeps upstream behavior here. No code change.

## Outbound calls (Ү3-В)

XO turns off every call to Paperclip infrastructure unless the config opts in:

| Feature | Default | Opt in |
|---|---|---|
| Usage telemetry | off | `telemetry.enabled: true` in config |
| Announcements feed (pages.paperclip.ing) | off | `PAPERCLIP_ANNOUNCEMENTS_ENABLED=true` |
| npm update notice | off | `updates.checkEnabled: true` in config |
| Feedback trace sharing | off | `PAPERCLIP_FEEDBACK_EXPORT_BACKEND_URL` env var (falls back to `PAPERCLIP_TELEMETRY_BACKEND_URL`); token via `PAPERCLIP_FEEDBACK_EXPORT_BACKEND_TOKEN`. Read in server/src/config.ts, env only, no config-file key |

User-triggered third-party calls (not Paperclip infra, so not gated):

| Call | Trigger |
|---|---|
| registry.npmjs.org | Adapter latest-version lookup from the browser (ui AdapterManager.tsx:169-195) |
| openrouter.ai | OpenRouter model list, fetched on demand (server/src/services/openrouter-models.ts:11) |

D2 caveat: an issue-less continuation source is accepted when an interaction on the issue names it (company, issue, agent and non-explicit-user checks). The interaction status is not checked, and there are no priorRuns receipts for issue-less sources.

`PAPERCLIP_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, CI variables and `PAPERCLIP_UPDATE_CHECK=0` still win over the config.
