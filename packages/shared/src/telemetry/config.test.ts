import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { telemetryConfigSchema } from "../config-schema.js";
import { resolveTelemetryConfig } from "./config.js";

const KILL_SWITCHES = [
  "PAPERCLIP_TELEMETRY_DISABLED",
  "DO_NOT_TRACK",
  "CI",
  "CONTINUOUS_INTEGRATION",
  "BUILD_NUMBER",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
];

describe("XO telemetry defaults", () => {
  beforeEach(() => {
    for (const key of KILL_SWITCHES) vi.stubEnv(key, "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is off when no file config is given", () => {
    expect(resolveTelemetryConfig().enabled).toBe(false);
    expect(resolveTelemetryConfig({}).enabled).toBe(false);
  });

  it("is on only when the config says enabled: true", () => {
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(true);
    expect(resolveTelemetryConfig({ enabled: false }).enabled).toBe(false);
  });

  it("lets env kill-switches beat enabled: true", () => {
    vi.stubEnv("PAPERCLIP_TELEMETRY_DISABLED", "1");
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(false);
    vi.stubEnv("PAPERCLIP_TELEMETRY_DISABLED", "");
    vi.stubEnv("DO_NOT_TRACK", "1");
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(false);
  });

  it("parses a missing telemetry block as disabled", () => {
    expect(telemetryConfigSchema.parse({}).enabled).toBe(false);
  });
});
