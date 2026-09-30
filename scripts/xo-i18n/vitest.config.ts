import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["scripts/xo-i18n/**/*.test.ts"],
    environment: "node",
  },
});
