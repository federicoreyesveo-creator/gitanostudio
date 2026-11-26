import SmoothScroll from "@/components/SmoothScroll";
import { Header } from "@/components/Nav";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Cut from "@/components/Cut";
import Collection from "@/components/Collection";
import Artist from "@/components/Artist";
import Menu from "@/components/Menu";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Visit from "@/components/Visit";
import { HERO_IMG } from "@/lib/data";
import { businessLd, faqLd } from "@/lib/seo";

const SITE = "https://gitanostudio-3nr7.vercel.app"; // TODO: dominio propio antes de lanzar

// Datos estructurados (HairSalon + FAQPage), armados en lib/seo.ts desde lib/data.ts.
const jsonLd = businessLd({ url: SITE, image: `${SITE}${HERO_IMG}` });

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SmoothScroll />
      <Loader />
      <div className="grain" aria-hidden />
      <Header />
      <main>
        <Hero />
        <Cut
          before="no es un corte."
          heading="Esto no es un corte."
          after="Es una pieza."
          caption={[
            "Tijera, navaja y paciencia. Aquí no hay turno exprés: antes de cortar, Dayner lee la forma de tu cabeza, tu tipo de cabello y cómo te peinas en la vida real, no en la foto.",
            "Sales con un corte que te queda a ti, y que se sigue viendo bien tres semanas después.",
          ]}
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
        <Reviews />
        <Menu />
        <Faq />
        <Visit />
      </main>
    </>
  );
}
