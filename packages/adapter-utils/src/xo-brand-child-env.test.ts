import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isForbiddenConfigEnvKey,
  isPaperclipRuntimeEnvKey,
  runChildProcess,
  sanitizeInheritedPaperclipEnv,
} from "./server-utils.js";

describe("XO runtime env namespace", () => {
  it("treats XO_* as reserved runtime keys", () => {
    expect(isPaperclipRuntimeEnvKey("XO_AGENT_ID")).toBe(true);
    expect(isPaperclipRuntimeEnvKey("PAPERCLIP_AGENT_ID")).toBe(true);
    expect(isPaperclipRuntimeEnvKey("OPENAI_API_KEY")).toBe(false);
  });

  it("forbids XO_API_KEY from config env", () => {
    expect(isForbiddenConfigEnvKey("XO_API_KEY")).toBe(true);
    expect(isForbiddenConfigEnvKey("PAPERCLIP_API_KEY")).toBe(true);
    expect(isForbiddenConfigEnvKey("XO_TASK_ID")).toBe(false);
  });

  it("strips inherited XO_* with the same exceptions as PAPERCLIP_*", () => {
    const out = sanitizeInheritedPaperclipEnv({
      PATH: "/bin",
      PAPERCLIP_HOME: "/p",
      XO_HOME: "/x",
      XO_RUNTIME_API_URL: "http://r",
      XO_LISTEN_HOST: "127.0.0.1",
      XO_LISTEN_PORT: "3100",
    });
    expect(out).toEqual({
      PATH: "/bin",
      XO_RUNTIME_API_URL: "http://r",
      XO_LISTEN_HOST: "127.0.0.1",
      XO_LISTEN_PORT: "3100",
    });
  });
});

describe("runChildProcess XO mirror", () => {
  const saved: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("XO_") || key.startsWith("PAPERCLIP_")) {
        saved[key] = process.env[key];
        delete process.env[key];
      }
    }
  });
  afterEach(() => {
    for (const [key, value] of Object.entries(saved)) {
      if (value !== undefined) process.env[key] = value;
      delete saved[key];
    }
  });

  it("gives the child both PAPERCLIP_X and XO_X", async () => {
    let stdout = "";
    await runChildProcess(
      "xo-mirror-test",
      process.execPath,
      ["-e", "process.stdout.write(`${process.env.PAPERCLIP_TASK_ID}|${process.env.XO_TASK_ID}`)"],
      {
        cwd: process.cwd(),
        env: { PAPERCLIP_TASK_ID: "task-1" },
        timeoutSec: 30,
        graceSec: 5,
        onLog: async (stream, chunk) => {
          if (stream === "stdout") stdout += chunk;
        },
      },
    );
    expect(stdout).toBe("task-1|task-1");
  });

  it("mirrors inherited PAPERCLIP_RUNTIME_API_URL to XO_RUNTIME_API_URL", async () => {
    process.env.PAPERCLIP_RUNTIME_API_URL = "http://runtime";
    let stdout = "";
    await runChildProcess(
      "xo-mirror-inherited-test",
      process.execPath,
      ["-e", "process.stdout.write(`${process.env.PAPERCLIP_RUNTIME_API_URL}|${process.env.XO_RUNTIME_API_URL}`)"],
      {
        cwd: process.cwd(),
        env: {},
        timeoutSec: 30,
        graceSec: 5,
        onLog: async (stream, chunk) => {
          if (stream === "stdout") stdout += chunk;
        },
      },
    );
    expect(stdout).toBe("http://runtime|http://runtime");
  });
});
