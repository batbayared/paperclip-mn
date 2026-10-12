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
| Feedback trace sharing | off | set the feedback export backend URL |

`PAPERCLIP_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, CI variables and `PAPERCLIP_UPDATE_CHECK=0` still win over the config.
