// Ilustração genérica de um analisador portátil (desenho próprio, não é foto do produto).
// Substituível por foto oficial via campo imagem_url no painel.
export function IlustracaoAnalisador({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 520" className={className} role="img" aria-label="Ilustração de analisador portátil">
      <defs>
        <linearGradient id="corpo" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#2b2b2b" />
          <stop offset="1" stopColor="#121212" />
        </linearGradient>
        <linearGradient id="borda" x1="0" x2="1">
          <stop offset="0" stopColor="#E8CF9B" />
          <stop offset=".5" stopColor="#CDA35C" />
          <stop offset="1" stopColor="#A9823E" />
        </linearGradient>
        <linearGradient id="tela" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1d2a26" />
          <stop offset="1" stopColor="#0d1412" />
        </linearGradient>
      </defs>
      <rect x="18" y="10" width="224" height="500" rx="46" fill="url(#corpo)" stroke="url(#borda)" strokeWidth="2" />
      <rect x="92" y="2" width="76" height="40" rx="10" fill="#1a1a1a" stroke="#CDA35C" strokeOpacity=".5" />
      <rect x="104" y="0" width="52" height="16" rx="4" fill="#CDA35C" opacity=".85" />
      <rect x="46" y="62" width="168" height="188" rx="16" fill="url(#tela)" stroke="#CDA35C" strokeOpacity=".35" />
      <g fontFamily="var(--font-oswald), sans-serif" fill="#E8CF9B">
        <text x="62" y="96" fontSize="13" opacity=".7">pH</text>
        <text x="150" y="96" fontSize="20">7.41</text>
        <text x="62" y="128" fontSize="13" opacity=".7">pCO2</text>
        <text x="150" y="128" fontSize="20">39</text>
        <text x="62" y="160" fontSize="13" opacity=".7">pO2</text>
        <text x="150" y="160" fontSize="20">96</text>
        <text x="62" y="192" fontSize="13" opacity=".7">Lac</text>
        <text x="150" y="192" fontSize="20">1.2</text>
      </g>
      <path d="M62 222h40l8-12 10 24 8-12h66" fill="none" stroke="#CDA35C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g fill="#1f1f1f" stroke="#CDA35C" strokeOpacity=".35">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={58 + (i % 3) * 52} y={282 + Math.floor(i / 3) * 44} width="40" height="30" rx="8" />
        ))}
      </g>
      <rect x="80" y="466" width="100" height="10" rx="5" fill="#CDA35C" opacity=".5" />
    </svg>
  );
}
