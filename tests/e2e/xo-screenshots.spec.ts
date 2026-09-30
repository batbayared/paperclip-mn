import { test, expect } from "@playwright/test";

const ORIGIN = `http://127.0.0.1:${process.env.PAPERCLIP_E2E_PORT ?? "3199"}`;
const ROUTES = ["dashboard", "issues", "agents", "projects", "goals", "inbox", "approvals", "costs", "search", "company/settings"];
const OUT_DIR = "tests/e2e/test-results/xo-screenshots";

test.describe("XO screenshots", () => {
  test.skip(!process.env.XO_SCREENSHOTS, "XO_SCREENSHOTS=1 үед л ажиллана (docs/xo/screenshot-review.md-д зориулсан)");
  test.use({
    viewport: { width: 1280, height: 800 },
    storageState: {
      cookies: [],
      origins: [{ origin: ORIGIN, localStorage: [{ name: "xo.locale", value: "mn" }] }],
    },
  });

  test("captures T1 routes in Mongolian", async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.request.post("/api/companies", { data: { name: `XO Screens ${Date.now()}` } });
    expect(res.ok(), `create company failed ${res.status()}: ${await res.text()}`).toBe(true);
    const company = (await res.json()) as { issuePrefix: string };

    // networkidle хэрэглэхгүй: апп SSE/websocket холболт барьдаг тул хэзээ ч idle болохгүй.
    await page.goto("/onboarding");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT_DIR}/onboarding.png`, fullPage: true });

    for (const route of ROUTES) {
      await page.goto(`/${company.issuePrefix}/${route}`);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${OUT_DIR}/${route.replace("/", "-")}.png`, fullPage: true });
    }
  });
});
