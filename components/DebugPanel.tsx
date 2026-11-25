"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Diagnóstico temporal: abrir el sitio con ?debug=1 para ver por qué no anima en un celular.
// TODO: borrar cuando esté resuelto.
export default function DebugPanel() {
  const [info, setInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!location.search.includes("debug")) return;
    const read = () => {
      const errs = ((window as unknown as { __errs?: string[] }).__errs ?? []).slice(-6);
      setInfo({
        "reduce-motion": String(matchMedia("(prefers-reduced-motion: reduce)").matches),
        "no-preference": String(matchMedia("(prefers-reduced-motion: no-preference)").matches),
        "ancho x alto": `${innerWidth} x ${innerHeight}`,
        triggers: String(ScrollTrigger.getAll().length),
        pins: String(document.querySelectorAll(".pin-spacer").length),
        "mazo Obra": String(!!document.querySelector(".is-deck")),
        lenis: String(document.documentElement.classList.contains("lenis")),
        webgl: String(!!document.createElement("canvas").getContext("webgl")),
        errores: errs.length ? errs.join(" | ") : "ninguno",
        navegador: navigator.userAgent,
      });
    };
    const id = window.setInterval(read, 1000);
    read();
    return () => window.clearInterval(id);
  }, []);

  if (!info) return null;
  return (
    <div
      style={{
        position: "fixed", left: 8, right: 8, bottom: 8, zIndex: 9999, background: "#fff", color: "#000",
        font: "11px/1.4 monospace", padding: 10, maxHeight: "45vh", overflow: "auto", wordBreak: "break-all",
      }}
    >
      {Object.entries(info).map(([k, v]) => (
        <div key={k}>
          <b>{k}:</b> {v}
        </div>
      ))}
    </div>
  );
}
