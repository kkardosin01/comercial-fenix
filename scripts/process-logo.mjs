// Gera os derivados da logo (emblema/logo transparentes, favicon, apple-icon e Open Graph)
// a partir de assets/brand/logo-original.png (logo dourada sobre fundo preto).
// Uso: node scripts/process-logo.mjs
import sharp from "sharp";

const SRC = "assets/brand/logo-original.png";
const GOLD = [205, 163, 92]; // #CDA35C

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// Converte fundo preto em transparência: alfa proporcional ao brilho do pixel dourado.
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
  const a = Math.min(1, Math.max(0, (Math.max(r, g, b) - 18) / (GOLD[0] - 18)));
  rgba[i * 4] = GOLD[0]; rgba[i * 4 + 1] = GOLD[1]; rgba[i * 4 + 2] = GOLD[2];
  rgba[i * 4 + 3] = Math.round(a * 255);
}

// Encontra a caixa delimitadora das linhas com conteúdo, separando emblema e texto.
const rowHas = (y) => { for (let x = 4; x < W - 4; x++) if (rgba[(y * W + x) * 4 + 3] > 40) return true; return false; };
const bands = []; let start = -1;
for (let y = 0; y < H; y++) { const h = rowHas(y); if (h && start < 0) start = y; if (!h && start >= 0) { bands.push([start, y]); start = -1; } }
// Junta bandas próximas (o emblema tem lacunas pequenas)
const merged = [];
for (const b of bands) { const last = merged.at(-1); if (last && b[0] - last[1] < 12) last[1] = b[1]; else merged.push([...b]); }
merged.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
const [emblemBand, textBand] = [merged[0], merged[1]].sort((a, b) => a[0] - b[0]);
const colBox = (y0, y1) => { let x0 = W, x1 = 0; for (let y = y0; y < y1; y++) for (let x = 4; x < W - 4; x++) if (rgba[(y * W + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); } return [x0, x1 + 1]; };
const [ex0, ex1] = colBox(...emblemBand); const [tx0, tx1] = colBox(...textBand);
console.log({ emblemBand, textBand, ex0, ex1, tx0, tx1 });

const base = () => sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
const pad = 6;
const emblem = { left: ex0 - pad, top: emblemBand[0] - pad, width: ex1 - ex0 + 2 * pad, height: emblemBand[1] - emblemBand[0] + 2 * pad };
const full = { left: Math.min(ex0, tx0) - pad, top: emblemBand[0] - pad, width: Math.max(ex1, tx1) - Math.min(ex0, tx0) + 2 * pad, height: textBand[1] - emblemBand[0] + 2 * pad };

const emblemPng = await base().extract(emblem).png().toBuffer();
await sharp(emblemPng).resize({ height: 240 }).png({ compressionLevel: 9 }).toFile("public/brand/fenix-emblem.png");
await sharp(emblemPng).resize({ height: 240 }).webp({ quality: 90 }).toFile("public/brand/fenix-emblem.webp");
await base().extract(full).png({ compressionLevel: 9 }).toFile("public/brand/logo-completa.png");
// Versão ampliada (decorativa, usada em fundos grandes) — evita upscaling no navegador.
await sharp(emblemPng).resize({ width: 900, kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile("public/brand/fenix-emblem-grande.png");

// Ícones: emblema dourado centralizado sobre fundo preto.
const iconOn = async (size, out, bg = "#0A0A0A") => {
  const inner = Math.round(size * 0.78);
  const e = await sharp(emblemPng).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: e, gravity: "center" }]).png().toFile(out);
};
await iconOn(512, "src/app/icon.png");
await iconOn(180, "src/app/apple-icon.png");
await iconOn(192, "public/brand/icon-192.png");

// Open Graph 1200x630: logo original centralizada sobre preto.
const og = await sharp(SRC).resize({ height: 560 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#000000" } }).composite([{ input: og, gravity: "center" }]).png().toFile("src/app/opengraph-image.png");
console.log("ok");

// favicon.ico (contêiner ICO com PNGs 16/32/48 embutidos)
const tamanhos = [16, 32, 48];
const pngs = await Promise.all(
  tamanhos.map(async (s) => {
    const e = await sharp(emblemPng).resize(Math.round(s * 0.9), Math.round(s * 0.9), { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    return sharp({ create: { width: s, height: s, channels: 4, background: "#0A0A0A" } }).composite([{ input: e, gravity: "center" }]).png().toBuffer();
  }),
);
const cab = Buffer.alloc(6 + 16 * pngs.length);
cab.writeUInt16LE(0, 0); cab.writeUInt16LE(1, 2); cab.writeUInt16LE(pngs.length, 4);
let off = cab.length;
pngs.forEach((p, i) => {
  const b = 6 + i * 16, s = tamanhos[i];
  cab.writeUInt8(s, b); cab.writeUInt8(s, b + 1); cab.writeUInt8(0, b + 2); cab.writeUInt8(0, b + 3);
  cab.writeUInt16LE(1, b + 4); cab.writeUInt16LE(32, b + 6);
  cab.writeUInt32LE(p.length, b + 8); cab.writeUInt32LE(off, b + 12);
  off += p.length;
});
const { writeFileSync } = await import("node:fs");
writeFileSync("src/app/favicon.ico", Buffer.concat([cab, ...pngs]));
console.log("favicon.ico ok");
