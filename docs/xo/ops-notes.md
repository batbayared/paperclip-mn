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

## XO env vars and home directory (Ү3-А)

- `XO_*` names are primary, `PAPERCLIP_*` are fallbacks. `XO_X` wins over `PAPERCLIP_X`; a blank or whitespace-only `XO_X` counts as unset. Examples: `XO_HOME`, `XO_INSTANCE_ID`, `XO_PORT`.
- `XO_I18N_TRANSFORM` and `XO_SCREENSHOTS` are XO-native: no `PAPERCLIP_` pair, not aliased.
- Home directory resolution: `XO_HOME` > `PAPERCLIP_HOME` > `~/.xo` (if it exists) > `~/.paperclip` (if it exists) > `~/.xo`. No data migration: a machine with an existing `~/.paperclip` keeps using it where it is.
- Agent child processes receive both `PAPERCLIP_X` and `XO_X` with the same value. New prompts and skills use the `XO_` names.
- CLI: the new `xo` bin and the old `paperclipai` bin both work. `xo --data-dir` sets both name families.
- Brand scan: `pnpm xo:brand-scan` fails if the count of user-visible "Paperclip" strings grows above `scripts/xo-brand/baseline.json`. `--update` lowers the baseline after an intentional change; `--list` prints the hits.

## Agent memory isolation (pilot)

- Claude Code loads `<ancestor>/.claude/CLAUDE.md` from every ancestor of the agent's cwd as project memory. The managed AI connection moves `HOME` and `CLAUDE_CONFIG_DIR` to a temp dir, but that does not stop this walk.
- Default agent workspace: `<XO_HOME>/instances/<id>/workspaces/<agentId>`. With the default `~/.xo` or `~/.paperclip`, the walk reaches the host user's `~/.claude/CLAUDE.md` and the agent follows the operator's personal instructions (seen 2026-10-12 on y3-close, CMP-4).
- `--setting-sources` in `extraArgs` is rejected with `ai_connection_incompatible` for managed connections, so the fix is placement: set `XO_HOME` to a path outside any user home (e.g. `/Users/Shared/xo`) or run XO as a dedicated OS user. Project workspaces with a custom `cwd` must also sit outside the operator's home.
- Check: give an agent a task asking whether a user-level CLAUDE.md is loaded; with cwd outside home it reports none (y3-close, CMP-5).
