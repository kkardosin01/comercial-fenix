// Ilustração genérica de cartucho de teste (desenho próprio).
export function IlustracaoCartucho({ rotulo, className }: { rotulo: string; className?: string }) {
  const id = `cart-${rotulo.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox="0 0 160 240" className={className} role="img" aria-label={`Ilustração do cartucho ${rotulo}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#262626" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
      <rect x="20" y="8" width="120" height="224" rx="14" fill={`url(#${id})`} stroke="#CDA35C" strokeOpacity=".6" />
      <rect x="36" y="26" width="88" height="70" rx="8" fill="#CDA35C" />
      <text x="80" y="70" textAnchor="middle" fontFamily="var(--font-oswald), sans-serif" fontSize="22" fill="#0A0A0A">
        {rotulo}
      </text>
      <circle cx="80" cy="128" r="12" fill="none" stroke="#CDA35C" strokeOpacity=".6" />
      <g stroke="#CDA35C" strokeOpacity=".45" strokeWidth="2">
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={44 + i * 14} x2={44 + i * 14} y1="170" y2="212" />
        ))}
      </g>
    </svg>
  );
}
