import { test, expect } from "@playwright/test";

// Task 10-д playwright.config.ts бүх spec-ийг xo.locale=en болгосон; энэ файл л Монгол UI дээр ажиллана.
const ORIGIN = `http://127.0.0.1:${process.env.PAPERCLIP_E2E_PORT ?? "3199"}`;

test.use({
  storageState: {
    cookies: [],
    origins: [{ origin: ORIGIN, localStorage: [{ name: "xo.locale", value: "mn" }] }],
  },
});

test("onboarding renders in Mongolian", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.locator("body")).toContainText(/[Ѐ-ӿ]/, { timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("mn");
});

test("sidebar labels and document title are Mongolian", async ({ page }) => {
  const res = await page.request.post("/api/companies", { data: { name: `XO Test Co ${Date.now()}` } });
  expect(res.ok(), `create company failed ${res.status()}: ${await res.text()}`).toBe(true);
  const company = (await res.json()) as { issuePrefix: string };

  await page.goto(`/${company.issuePrefix}/dashboard`);
  await expect(page).toHaveTitle(/XO$/);
  await expect(page.locator('a[href$="/search"]').first()).toContainText("Хайх");
  await expect(page.locator('a[href$="/projects"]').first()).toContainText("Төслүүд");
  // Goals линк нь enableGoalsSidebarLink туршилтын тохиргоонд (анхдагч унтраалттай) байдаг тул Tasks-аар сольсон.
  await expect(page.locator('a[href$="/issues"]').first()).toContainText("Даалгаврууд");
});
