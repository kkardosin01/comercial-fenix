import { describe, expect, it } from "vitest";
import { montarCsp } from "../src/lib/seguranca/csp";

describe("CSP", () => {
  it("bloqueia framing e objetos", () => {
    const csp = montarCsp();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("https://www.google.com");
  });
  it("usa nonce + strict-dynamic no admin", () => {
    const csp = montarCsp({ nonce: "abc" });
    expect(csp).toContain("'nonce-abc'");
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  });
});
