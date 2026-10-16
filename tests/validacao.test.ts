import { describe, expect, it } from "vitest";
import { leadSchema, limparTexto } from "../src/lib/validacao";

const base = {
  nome: "Maria Teste",
  instituicao: "Hospital Exemplo",
  cargo: "",
  email: "MARIA@Example.com ",
  telefone: "(48) 99999-0000",
  area: "uti-adulto",
  produtos: ["cartucho-cg8"],
  cidade: "Florianópolis",
  uf: "SC",
  mensagem: "Olá",
  consentimento: "on",
};

describe("leadSchema", () => {
  it("aceita um lead válido e normaliza o e-mail", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("maria@example.com");
  });

  it("exige consentimento LGPD", () => {
    expect(leadSchema.safeParse({ ...base, consentimento: undefined }).success).toBe(false);
  });

  it("rejeita telefone sem DDD e e-mail inválido", () => {
    expect(leadSchema.safeParse({ ...base, telefone: "9999" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "nao-e-email" }).success).toBe(false);
  });

  it("rejeita UF inexistente e textos longos demais", () => {
    expect(leadSchema.safeParse({ ...base, uf: "XX" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, mensagem: "a".repeat(2001) }).success).toBe(false);
  });
});

describe("limparTexto", () => {
  it("remove caracteres de controle e de direção bidi", () => {
    expect(limparTexto("  a\u0000b‮c  ")).toBe("abc");
  });
});
