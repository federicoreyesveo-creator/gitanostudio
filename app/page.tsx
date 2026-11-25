import SmoothScroll from "@/components/SmoothScroll";
import { Header } from "@/components/Nav";
import Hero from "@/components/Hero";
import Cut from "@/components/Cut";
import Collection from "@/components/Collection";
import Artist from "@/components/Artist";
import Menu from "@/components/Menu";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import DebugPanel from "@/components/DebugPanel";
import { ADDRESS, FAQS, GEO, HOURS, INSTAGRAM_URL, MAPS_URL } from "@/lib/data";

// Datos estructurados para Google (negocio local).
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "Gitano Studio",
  description: "Barbería de autor en Mérida, Yucatán.",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.line1,
    addressLocality: "Mérida",
    addressRegion: "Yucatán",
    addressCountry: "MX",
  },
  geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
  hasMap: MAPS_URL,
  openingHoursSpecification: Object.entries(HOURS)
    .filter(([, h]) => h)
    .map(([d, h]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAY[Number(d)],
      opens: hhmm(h![0]),
      closes: hhmm(h![1]),
    })),
  priceRange: "$80–$650 MXN",
  founder: { "@type": "Person", name: "Dayner", jobTitle: "Barbero" },
  sameAs: [INSTAGRAM_URL],
};

// FAQPage: mismo texto que la sección visible (components/Faq.tsx), como pide Google.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SmoothScroll />
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero />
        <Cut
          before="no es un corte."
          after="es una pieza."
          caption={["Tijera, navaja y paciencia.", "Una cabeza a la vez, con tiempo para el detalle."]}
          imgs={[
            "/img/cut/gitano-studio-crop-fade-barba-linea-merida.webp",
            "/img/cut/gitano-studio-taper-fade-rizado-merida.webp",
            "/img/cut/gitano-studio-corte-shag-mujer-capas-merida.webp",
            "/img/cut/gitano-studio-buzz-cut-mujer-fade-merida.webp",
          ]}
          alts={[
            "Crop con fade alto, línea marcada y barba, corte de Gitano Studio en Mérida",
            "Taper fade con rizo natural de perfil, barbería Gitano Studio Mérida",
            "Corte shag en capas con flequillo en mujer, Gitano Studio Mérida",
            "Buzz cut con fade en mujer, barbería Gitano Studio Mérida",
          ]}
        />
        <Collection />
        <Artist />
        <Menu />
        <Faq />
        <Visit />
      </main>
      <DebugPanel />
    </>
  );
}
