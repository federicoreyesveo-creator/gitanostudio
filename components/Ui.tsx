// Piezas chicas compartidas: chevron, marquesina e iconos.

export function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 10 16" aria-hidden>
      <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Loop infinito: dos grupos idénticos, cada uno más ancho que cualquier pantalla.
 * La pista se corre exactamente un grupo (-50%) y vuelve sin salto.
 */
export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t) => `| ${t} `).join("");
  const group = (
    <div className="marquee-group">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i}>{row}</span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {group}
        {group}
      </div>
    </div>
  );
}

export const Icon = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8.5c0 3 2.5 6 6 6.5l1-1.6-2-1-1 .9c-1-.4-2.1-1.5-2.5-2.5l.9-1-1-2L9 8.5z" fill="currentColor" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.3" fill="currentColor" />
    </svg>
  ),
};

/** Flecha "sale del sitio" en SVG: el carácter ↗ se dibuja como emoji en iPhone. */
export function ArrowOut() {
  return (
    <svg className="arrow-out" viewBox="0 0 12 12" aria-hidden>
      <path d="M3 9L9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}
