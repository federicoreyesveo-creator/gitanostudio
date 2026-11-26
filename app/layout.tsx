import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

// Titulares: grotesca pesada y condensada (eje wdth), con carácter.
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["wdth", "opsz"], variable: "--f-display" });
// Textos: sans moderna y neutra.
const sans = Geist({ subsets: ["latin"], variable: "--f-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--f-mono" });
// Solo para el wordmark del logo.
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--f-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://gitanostudio-3nr7.vercel.app"), // TODO: dominio propio
  title: "Barbería en Mérida | Gitano Studio · Cortes de autor",
  description:
    "Barbería de autor en Mérida. Fades, corte a tijera, barba con toalla caliente y cortes cortos de mujer con Dayner. México Oriente. Agenda en línea.",
  openGraph: {
    title: "Gitano Studio · No hay suerte. Hay oficio.",
    description: "Barbería de autor en Mérida, Yucatán. Una cabeza a la vez, con cita.",
    images: ["/img/hero/gitano-studio-barberia-merida-mullet.webp"],
    locale: "es_MX",
    type: "website",
    siteName: "Gitano Studio",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-MX"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
