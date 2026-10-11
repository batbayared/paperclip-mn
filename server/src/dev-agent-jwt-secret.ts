// XO (Ү3-В): dev-only helper. `pnpm dev` used to start without an agent JWT
// secret, so local agents could not authenticate. Production startup does not
// call this; operators there must set the secret themselves.
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parse } from "dotenv";
import { updateEnvFileContents, writeEnvFileAtomicallyIfChanged } from "@paperclipai/shared/env-file";
import { resolvePaperclipEnvPath } from "./paths.js";

const KEY = "PAPERCLIP_AGENT_JWT_SECRET";

export function ensureDevAgentJwtSecret(
  env: NodeJS.ProcessEnv,
  envFilePath: string = resolvePaperclipEnvPath(),
): { created: boolean; envPath: string } {
  if (env[KEY]?.trim() || env.BETTER_AUTH_SECRET?.trim()) return { created: false, envPath: envFilePath };

  const previous = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, "utf8") : null;
  const existing = previous ? parse(previous)[KEY]?.trim() : undefined;
  if (existing) {
    env[KEY] = existing;
    return { created: false, envPath: envFilePath };
  }

  const secret = randomBytes(32).toString("hex");
  const next = updateEnvFileContents(previous ?? "", { [KEY]: secret }, { valueEncoding: "minimal" });
  fs.mkdirSync(path.dirname(envFilePath), { recursive: true });
  writeEnvFileAtomicallyIfChanged(envFilePath, previous, next);
  env[KEY] = secret;
  return { created: true, envPath: envFilePath };
}
