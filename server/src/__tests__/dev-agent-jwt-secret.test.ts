import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ensureDevAgentJwtSecret } from "../dev-agent-jwt-secret.ts";

const tempRoots = new Set<string>();

afterEach(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
  tempRoots.clear();
});

function envPathIn(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(root);
  return path.join(root, ".env");
}

describe("ensureDevAgentJwtSecret", () => {
  it("creates and persists a 64-hex secret with mode 0600", () => {
    const envPath = envPathIn("xo-jwt-create-");
    const env: NodeJS.ProcessEnv = {};

    const result = ensureDevAgentJwtSecret(env, envPath);

    expect(result).toEqual({ created: true, envPath });
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toMatch(/^[0-9a-f]{64}$/);
    expect(fs.readFileSync(envPath, "utf8")).toContain(`PAPERCLIP_AGENT_JWT_SECRET=${env.PAPERCLIP_AGENT_JWT_SECRET}`);
    expect(fs.statSync(envPath).mode & 0o777).toBe(0o600);
  });

  it("reuses an existing value from the file without rewriting it", () => {
    const envPath = envPathIn("xo-jwt-reuse-");
    const existing = "a".repeat(64);
    fs.writeFileSync(envPath, `PAPERCLIP_AGENT_JWT_SECRET=${existing}\n`, { mode: 0o600 });
    const before = fs.statSync(envPath).mtimeMs;
    const env: NodeJS.ProcessEnv = {};

    const result = ensureDevAgentJwtSecret(env, envPath);

    expect(result.created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBe(existing);
    expect(fs.statSync(envPath).mtimeMs).toBe(before);
  });

  it("skips when PAPERCLIP_AGENT_JWT_SECRET is already set", () => {
    const envPath = envPathIn("xo-jwt-env-");
    const env: NodeJS.ProcessEnv = { PAPERCLIP_AGENT_JWT_SECRET: "from-env" };

    expect(ensureDevAgentJwtSecret(env, envPath).created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBe("from-env");
    expect(fs.existsSync(envPath)).toBe(false);
  });

  it("skips when BETTER_AUTH_SECRET is set", () => {
    const envPath = envPathIn("xo-jwt-better-auth-");
    const env: NodeJS.ProcessEnv = { BETTER_AUTH_SECRET: "auth-secret" };

    expect(ensureDevAgentJwtSecret(env, envPath).created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBeUndefined();
    expect(fs.existsSync(envPath)).toBe(false);
  });

  it("preserves other lines in the .env file", () => {
    const envPath = envPathIn("xo-jwt-preserve-");
    fs.writeFileSync(envPath, "PORT=3110\nPAPERCLIP_INSTANCE_ID=y3b-test\n", { mode: 0o600 });
    const env: NodeJS.ProcessEnv = {};

    ensureDevAgentJwtSecret(env, envPath);

    const contents = fs.readFileSync(envPath, "utf8");
    expect(contents).toContain("PORT=3110");
    expect(contents).toContain("PAPERCLIP_INSTANCE_ID=y3b-test");
    expect(contents).toMatch(/^PAPERCLIP_AGENT_JWT_SECRET=[0-9a-f]{64}$/m);
  });
});
