// Mapa estilizado do Brasil em "pontos": contornos aproximados (lon, lat) usados apenas
// para gerar uma malha de pontos decorativa. Não é um mapa cartográfico preciso.
type P = [number, number];

const BRASIL: P[] = [
  [-73.99, -7.5], [-72.9, -5.2], [-69.94, -4.23], [-69.4, -1.0], [-70.0, 0.6], [-69.2, 1.0],
  [-67.0, 2.0], [-66.9, 1.2], [-64.0, 2.0], [-63.4, 3.9], [-60.7, 5.2], [-60.0, 4.5],
  [-59.6, 1.8], [-56.5, 1.9], [-54.0, 2.2], [-51.6, 4.4], [-50.0, 1.8], [-49.0, -0.2],
  [-48.0, -0.8], [-44.5, -2.5], [-41.8, -2.9], [-38.5, -3.7], [-35.2, -5.8], [-34.8, -7.1],
  [-34.9, -8.1], [-35.7, -9.7], [-38.5, -13.0], [-39.0, -14.8], [-39.2, -17.7], [-40.3, -20.3],
  [-42.0, -23.0], [-43.2, -23.0], [-46.3, -24.0], [-48.0, -25.3], [-48.5, -27.6], [-48.8, -28.6],
  [-50.2, -30.5], [-52.1, -32.1], [-53.4, -33.7], [-53.5, -32.5], [-55.6, -30.9], [-57.6, -30.2],
  [-55.7, -28.0], [-53.8, -27.1], [-53.7, -26.0], [-54.6, -25.5], [-54.3, -24.0], [-55.4, -23.9],
  [-55.7, -22.5], [-57.9, -22.1], [-58.1, -20.2], [-57.8, -19.0], [-58.3, -16.3], [-60.2, -15.1],
  [-60.4, -13.5], [-62.1, -13.0], [-64.4, -12.4], [-65.3, -10.9], [-66.0, -9.8], [-68.6, -11.0],
  [-70.6, -11.0], [-70.6, -9.5], [-72.2, -10.0], [-73.2, -9.4],
];

export const ESTADOS: Record<string, { nome: string; poligono: P[]; centro: P }> = {
  SC: {
    nome: "Santa Catarina",
    poligono: [[-53.8, -26.6], [-52.0, -26.3], [-49.0, -26.0], [-48.3, -26.2], [-48.5, -27.7], [-48.8, -28.6], [-49.7, -29.3], [-50.1, -28.6], [-51.5, -27.6], [-53.8, -27.1]],
    centro: [-50.5, -27.2],
  },
  RS: {
    nome: "Rio Grande do Sul",
    poligono: [[-53.8, -27.1], [-51.5, -27.6], [-50.1, -28.6], [-49.7, -29.3], [-50.4, -30.8], [-52.1, -32.1], [-53.4, -33.7], [-53.5, -32.5], [-55.6, -30.9], [-57.6, -30.2], [-55.7, -28.0]],
    centro: [-53.2, -29.8],
  },
  PR: {
    nome: "Paraná",
    poligono: [[-54.6, -25.5], [-54.3, -24.0], [-53.1, -22.6], [-51.0, -22.6], [-49.5, -23.0], [-48.6, -24.6], [-48.0, -25.3], [-48.3, -26.2], [-49.0, -26.0], [-52.0, -26.3], [-53.8, -26.6]],
    centro: [-51.5, -24.6],
  },
  SP: {
    nome: "São Paulo",
    poligono: [[-53.1, -22.6], [-51.0, -20.0], [-48.0, -20.1], [-47.2, -20.3], [-46.6, -21.5], [-44.3, -22.6], [-44.8, -23.4], [-46.3, -24.0], [-48.0, -25.3], [-48.6, -24.6], [-49.5, -23.0], [-51.0, -22.6]],
    centro: [-48.6, -22.2],
  },
  CE: {
    nome: "Ceará",
    poligono: [[-41.4, -2.9], [-38.5, -3.7], [-37.3, -4.6], [-38.3, -5.5], [-38.6, -6.8], [-39.0, -7.8], [-40.5, -7.4], [-41.2, -6.3], [-40.9, -4.2]],
    centro: [-39.6, -5.3],
  },
};

const dentro = ([x, y]: P, poli: P[]) => {
  let d = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i];
    const [xj, yj] = poli[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) d = !d;
  }
  return d;
};

const LON0 = -74.5;
const LAT0 = 5.8;
const ESCALA = 12; // px por grau
export const MAPA_LARGURA = Math.round((-34 - LON0) * ESCALA);
export const MAPA_ALTURA = Math.round((LAT0 + 34.2) * ESCALA);
export const projetar = ([lon, lat]: P): P => [
  +((lon - LON0) * ESCALA).toFixed(1),
  +((LAT0 - lat) * ESCALA).toFixed(1),
];

/** Gera paths SVG (um ponto = "Mx yh0" com stroke-linecap round), separados por estado. */
export function gerarMalha(passo = 0.7) {
  const base: string[] = [];
  const porEstado: Record<string, string[]> = Object.fromEntries(Object.keys(ESTADOS).map((k) => [k, []]));
  for (let lat = LAT0; lat > -34.2; lat -= passo) {
    for (let lon = LON0; lon < -34; lon += passo) {
      const p: P = [lon, lat];
      if (!dentro(p, BRASIL)) continue;
      const [x, y] = projetar(p);
      const estado = Object.keys(ESTADOS).find((k) => dentro(p, ESTADOS[k].poligono));
      (estado ? porEstado[estado] : base).push(`M${x} ${y}h0`);
    }
  }
  return {
    base: base.join(""),
    estados: Object.fromEntries(Object.entries(porEstado).map(([k, v]) => [k, v.join("")])),
  };
}

export const FLORIANOPOLIS: P = [-48.55, -27.6];
