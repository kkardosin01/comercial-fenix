import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Janela = `${number} ${"s" | "m" | "h"}`;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

let avisou = false;
const avisar = () => {
  if (!avisou && process.env.NODE_ENV === "production") {
    avisou = true;
    console.warn("[limite] Upstash não configurado: usando limite em memória (não compartilhado entre instâncias).");
  }
};

// Fallback em memória (desenvolvimento ou ausência do Upstash).
const memoria = new Map<string, { n: number; fim: number }>();
const ms = (j: Janela) => {
  const [n, u] = j.split(" ");
  return Number(n) * (u === "s" ? 1e3 : u === "m" ? 6e4 : 36e5);
};

const cache = new Map<string, Ratelimit>();

/** Retorna true se a ação ainda está dentro do limite. */
export async function dentroDoLimite(prefixo: string, chave: string, max: number, janela: Janela) {
  if (redis) {
    const id = `${prefixo}:${max}:${janela}`;
    let rl = cache.get(id);
    if (!rl) {
      rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(max, janela), prefix: `fenix:${prefixo}` });
      cache.set(id, rl);
    }
    return (await rl.limit(chave)).success;
  }
  avisar();
  const k = `${prefixo}:${chave}`;
  const agora = Date.now();
  const e = memoria.get(k);
  if (!e || e.fim < agora) {
    memoria.set(k, { n: 1, fim: agora + ms(janela) });
    return true;
  }
  e.n += 1;
  return e.n <= max;
}

/** Bloqueio após falhas (login): contador com expiração, independente de instância. */
const SEG_BLOQUEIO = 15 * 60;

export async function contarFalha(prefixo: string, chave: string) {
  const k = `fenix:falha:${prefixo}:${chave}`;
  if (redis) {
    const n = await redis.incr(k);
    if (n === 1) await redis.expire(k, SEG_BLOQUEIO);
    return n;
  }
  const agora = Date.now();
  const e = memoria.get(k);
  if (!e || e.fim < agora) {
    memoria.set(k, { n: 1, fim: agora + SEG_BLOQUEIO * 1000 });
    return 1;
  }
  return ++e.n;
}

export async function falhas(prefixo: string, chave: string) {
  const k = `fenix:falha:${prefixo}:${chave}`;
  if (redis) return Number((await redis.get<number>(k)) ?? 0);
  const e = memoria.get(k);
  return e && e.fim > Date.now() ? e.n : 0;
}

export async function limparFalhas(prefixo: string, chave: string) {
  const k = `fenix:falha:${prefixo}:${chave}`;
  if (redis) await redis.del(k);
  else memoria.delete(k);
}
