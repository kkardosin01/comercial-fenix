import { describe, expect, it } from "vitest";
import { montarCsp } from "../src/lib/seguranca/csp";

describe("CSP", () => {
  it("bloqueia framing e objetos", () => {
    const csp = montarCsp();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("https://www.google.com");
  });
  it("no painel, só scripts do próprio domínio e nenhum iframe", () => {
    const csp = montarCsp({ painel: true });
    expect(csp).toMatch(/script-src 'self' 'unsafe-inline'(;| 'unsafe-eval')/);
    expect(csp).not.toContain("challenges.cloudflare.com;");
    expect(csp).toContain("frame-src 'none'");
  });
});
