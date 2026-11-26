import { ADDRESS, FAQS, FRESHA_URL, GEO, HOURS, INSTAGRAM_URL, MAPS_URL, SERVICES } from "./data";

// Datos estructurados (schema.org). HairSalon es el tipo que corresponde a una barbería.
// TODO: sumar url (dominio final), telephone (WhatsApp real) y postalCode cuando estén.

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`;

/** Agrupa los días con el mismo horario: martes a sábado en un solo bloque, domingo aparte. */
function openingHours() {
  const groups = new Map<string, { days: string[]; opens: string; closes: string }>();
  for (const d of [2, 3, 4, 5, 6, 0, 1]) {
    const h = HOURS[d];
    if (!h) continue;
    const key = h.join("-");
    const g = groups.get(key) ?? { days: [], opens: hhmm(h[0]), closes: hhmm(h[1]) };
    g.days.push(DAY[d]);
    groups.set(key, g);
  }
  return [...groups.values()].map((g) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: g.days.length === 1 ? g.days[0] : g.days,
    opens: g.opens,
    closes: g.closes,
  }));
}

export function businessLd(opts: { url?: string; image?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Gitano Studio",
    description:
      "Barbería de autor en Mérida, Yucatán, fundada por el barbero Dayner. Fades, corte a tijera, barba con toalla caliente y cortes cortos de mujer.",
    ...(opts.url && { url: opts.url }),
    ...(opts.image && { image: opts.image }),
    priceRange: "$80–$650 MXN",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ADDRESS.line1}, México Oriente`,
      addressLocality: "Mérida",
      addressRegion: "Yucatán",
      addressCountry: "MX",
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    hasMap: MAPS_URL,
    openingHoursSpecification: openingHours(),
    founder: { "@type": "Person", name: "Dayner", jobTitle: "Barbero" },
    sameAs: [INSTAGRAM_URL, FRESHA_URL, MAPS_URL],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios",
      itemListElement: SERVICES.flatMap((g) => g.items)
        .filter((s) => s.price !== null)
        .map((s) => ({
          "@type": "Offer",
          price: String(s.price),
          priceCurrency: "MXN",
          itemOffered: { "@type": "Service", name: s.name },
        })),
    },
  };
}

// Mismo texto que la sección visible de preguntas.
export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
