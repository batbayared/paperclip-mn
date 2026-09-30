# Upstream sync (сар бүр)

Зарчим: зөвхөн stable tag (`vYYYY.MMDD.N`), beta/nightly хэзээ ч биш. Merge-ийг xo-main дээр хийнэ, rebase хийхгүй (xo-main нийтлэгдсэн).

1. Шинэ tag харах:
   `git fetch upstream --tags && git tag --list 'v2026.*' --sort=-version:refname | head -5`
2. Сүүлийн stable tag-ийг сонго (beta дагавартайг алгас): `TAG=v2026.XXXX.N`
3. Хуулбар ref шалгах: `find .git/refs -name '* 2*'` → хоосон.
4. Merge: `git merge --no-ff "$TAG" -m "chore(xo): sync upstream $TAG"`
5. Зөрчил гарвал зөвхөн S-set файлуудад (docs/superpowers/plans/2026-09-29-xo-paperclip-mongolian.md "Нийтлэг хязгаарлалт") гарна:
   `ui/src/i18n/index.ts`, `ui/src/lib/utils.ts`, `SidebarAccountMenu*.tsx`, `ui/index.html`,
   `site.webmanifest`, `BreadcrumbContext.tsx`, `Auth.tsx`, `ui/vite.config.ts`, `ui/vitest.config.ts`,
   `docs/docs.json`, `tests/e2e/playwright.config.ts`, `package.json`, `.gitignore`, `server/src/config.ts`.
   Upstream-ийн шинэ хувилбарыг авч XO-ийн мөрүүдийг дахин нэм.
   Ү2-оос хойш мөн доорх «Ү2-д нэмэгдсэн файлууд» хэсгийн файлууд (`tx()`/`XoTrans` нэмсэн мөрүүд).
6. Толь шинэчлэх: `pnpm xo:i18n:extract && pnpm xo:i18n:check` → шинэ/өөрчлөгдсөн түлхүүрийг `ui/src/i18n/xo/mn.json`-д орчуул, `check` OK болтол.
7. Шалгалт: `pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run) && pnpm build && pnpm test:e2e`
8. Таг: `git tag "xo-$TAG" && git push origin xo-main "xo-$TAG"` (ED зөвшөөрсний дараа).
9. `docs/xo/SYNC.md`-ийн доорх түүхэнд мөр нэм.

## Ү2-д нэмэгдсэн файлууд

Task 11-д `tx()`/`XoTrans` нэмсэн upstream файлууд (толь бичгийн commit-оос хойш өөрчлөгдсөн `ui/src`, XO-ийн өөрийн `ui/src/xo/`, `ui/src/i18n/xo/` хасагдсан):

- `ui/src/components/ApprovalPayload.tsx`
- `ui/src/components/OnboardingWizard.tsx`
- `ui/src/components/onboarding/SavedProviderKeySelect.tsx`
- `ui/src/components/ui/command.tsx`
- `ui/src/hooks/useComposerStop.ts`
- `ui/src/hooks/useDateRange.ts`
- `ui/src/hooks/useRetryNowMutation.ts`
- `ui/src/lib/activity-format.ts`
- `ui/src/lib/agent-setup-fields.ts`
- `ui/src/lib/announcement-preview.ts`
- `ui/src/lib/app-gallery-copy.ts`
- `ui/src/lib/built-in-agent-toast.ts`
- `ui/src/pages/AgentDetail.production.tsx`
- `ui/src/pages/AgentDetail.tsx`
- `ui/src/pages/ApprovalDetail.tsx`
- `ui/src/pages/CompanyAccess.tsx`
- `ui/src/pages/CompanyEnvironments.tsx`
- `ui/src/pages/CompanyExport.tsx`
- `ui/src/pages/CompanyImport.tsx`
- `ui/src/pages/CompanySettingsPluginPage.tsx`
- `ui/src/pages/Costs.production.tsx`
- `ui/src/pages/Costs.tsx`
- `ui/src/pages/Dashboard.tsx`
- `ui/src/pages/Inbox.tsx`
- `ui/src/pages/InstanceExperimentalSettings.tsx`
- `ui/src/pages/IssueDetail.tsx`
- `ui/src/pages/Projects.tsx`
- `ui/src/pages/Search.tsx`
- `ui/src/pages/WhatNeedsMe.tsx`

Нэмэлт тэмдэглэл: `scripts/xo-i18n/transform.ts`-ийн allowlist-д `message`, `action`, `subtitle` нэмэгдсэн (энэ файл XO-ийн өөрийнх тул upstream merge-д нөлөөгүй).

## Түүх

| Огноо | Upstream tag | XO tag | Тэмдэглэл |
|---|---|---|---|
| 2026-09-29 | v2026.916.1 | — | суурь |
