import { describe, expect, it } from "vitest";
import { gerarMalha } from "../src/lib/mapa";

describe("mapa estilizado", () => {
  it("gera pontos para o Brasil e para cada estado atendido", () => {
    const m = gerarMalha();
    expect(m.base.length).toBeGreaterThan(1000);
    for (const uf of ["SC", "PR", "RS", "SP", "CE"]) expect(m.estados[uf].length).toBeGreaterThan(0);
  });
});
