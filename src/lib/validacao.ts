import { z } from "zod";

import { UFS } from "./ufs";
export { UFS };

// Remove caracteres de controle e normaliza espaços (o texto é sempre escapado na saída).
export const limparTexto = (v: string) =>
  v
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();

const texto = (min: number, max: number, msg: string) =>
  z.string().transform(limparTexto).pipe(z.string().min(min, msg).max(max, `Use no máximo ${max} caracteres.`));
const opcional = (max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v ? limparTexto(v) : ""))
    .pipe(z.string().max(max, `Use no máximo ${max} caracteres.`));

export const leadSchema = z.object({
  nome: texto(2, 120, "Informe seu nome."),
  instituicao: texto(2, 160, "Informe a instituição."),
  cargo: opcional(120),
  email: z
    .string()
    .transform((v) => limparTexto(v).toLowerCase())
    .pipe(z.email("Informe um e-mail válido.").max(160)),
  telefone: z
    .string()
    .transform(limparTexto)
    .pipe(
      z
        .string()
        .max(30)
        .refine((v) => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 13, "Informe um telefone com DDD.")
        .refine((v) => /^[\d\s()+.-]+$/.test(v), "Use apenas números e ( ) + -."),
    ),
  area: opcional(120),
  produtos: z.array(z.string().max(60)).max(20).default([]),
  cidade: opcional(120),
  uf: z.union([z.enum(UFS), z.literal("")]).default(""),
  mensagem: opcional(2000),
  consentimento: z.literal("on", { error: "É necessário concordar com a Política de Privacidade." }),
});

export type LeadEntrada = z.infer<typeof leadSchema>;
