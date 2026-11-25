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
  title: "Gitano Studio · Barbería en Mérida, Yucatán",
  description:
    "Barbería de autor en Mérida, Yucatán. Dayner y Gitano Studio: corte personalizado, corte a tijera, barba, corte corto femenino y la Experiencia Gitano. Calle 31, Circuito Colonias. Agenda en línea.",
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
