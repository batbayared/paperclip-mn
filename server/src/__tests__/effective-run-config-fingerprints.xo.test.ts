import { describe, expect, it } from "vitest";
import { createEffectiveRunConfigFingerprints } from "../services/effective-run-config-fingerprints.ts";

function sessionFingerprint(env: Record<string, string>) {
  return createEffectiveRunConfigFingerprints({ session: { adapterConfig: { env } } }).sessionFingerprint;
}

describe("effective run config fingerprints (XO brand keys)", () => {
  it("fingerprints native XO_ keys", () => {
    const base = sessionFingerprint({ XO_I18N_TRANSFORM: "1" });
    expect(base.canonicalJson).toContain("XO_I18N_TRANSFORM");
    expect(sessionFingerprint({ XO_I18N_TRANSFORM: "0" }).fingerprint).not.toBe(base.fingerprint);
  });

  it("ignores brand runtime keys under both prefixes", () => {
    const base = sessionFingerprint({ FEATURE_FLAG: "on" });
    const withBrand = sessionFingerprint({ FEATURE_FLAG: "on", XO_HOME: "/x", PAPERCLIP_HOME: "/p" });
    expect(withBrand.fingerprint).toBe(base.fingerprint);
  });
});
