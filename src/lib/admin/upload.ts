import "server-only";
import DOMPurify from "isomorphic-dompurify";
import type { SupabaseClient } from "@supabase/supabase-js";

const TIPOS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};
const MAX_BYTES = 2 * 1024 * 1024;

// Confere a assinatura real do arquivo (não confia só no Content-Type enviado).
function tipoReal(buf: Uint8Array, declarado: string) {
  const ini = (n: number) => Array.from(buf.slice(0, n));
  const eq = (a: number[], b: number[]) => b.every((v, i) => a[i] === v);
  if (eq(ini(8), [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (eq(ini(3), [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (eq(ini(4), [0x52, 0x49, 0x46, 0x46]) && eq(Array.from(buf.slice(8, 12)), [0x57, 0x45, 0x42, 0x50])) return "image/webp";
  if (declarado === "image/svg+xml") {
    const txt = new TextDecoder().decode(buf.slice(0, 2048)).toLowerCase();
    if (txt.includes("<svg")) return "image/svg+xml";
  }
  return null;
}

export type ResultadoUpload = { url: string } | { erro: string };

/** Valida, sanitiza (SVG) e envia uma imagem ao bucket público "midia". */
export async function enviarImagem(supabase: SupabaseClient, arquivo: File, pasta: string): Promise<ResultadoUpload> {
  if (arquivo.size === 0) return { erro: "Arquivo vazio." };
  if (arquivo.size > MAX_BYTES) return { erro: "Arquivo maior que 2 MB." };
  let buf: Uint8Array = new Uint8Array(await arquivo.arrayBuffer());
  const tipo = tipoReal(buf, arquivo.type);
  if (!tipo || !TIPOS[tipo]) return { erro: "Formato não permitido. Use SVG, PNG, JPG ou WebP." };

  if (tipo === "image/svg+xml") {
    const limpo = DOMPurify.sanitize(new TextDecoder().decode(buf), {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: ["script", "foreignObject", "iframe", "embed", "object", "a"],
      FORBID_ATTR: ["onload", "onerror", "onclick"],
    })
      // Só referências internas (#id) são mantidas em href/xlink:href.
      .replace(/\s(?:xlink:)?href\s*=\s*(["'])(?!#)[^"']*\1/gi, "");
    if (!limpo.includes("<svg")) return { erro: "SVG inválido." };
    buf = new TextEncoder().encode(limpo);
  }

  const nome = `${pasta}/${crypto.randomUUID()}.${TIPOS[tipo]}`;
  const { error } = await supabase.storage.from("midia").upload(nome, buf, {
    contentType: tipo,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { erro: "Falha no upload da imagem." };
  return { url: supabase.storage.from("midia").getPublicUrl(nome).data.publicUrl };
}
