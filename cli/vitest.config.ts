import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // XO (B3): in the full root run the CLI project shares the machine with the
    // UI project, and heavy tests (e.g. company-import-transfer's ~64 MB inflate)
    // cross vitest's default 5s budget while passing alone. 15s mirrors
    // server/vitest.config.ts and still catches a genuinely hung test.
    testTimeout: 15000,
  },
});
