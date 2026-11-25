"use client";

import { useEffect, useState } from "react";
import { FRESHA_URL, WHATSAPP_URL } from "@/lib/data";
import { Chevron } from "./Ui";

const LINKS = [
  { href: "#obra", label: "Obra" },
  { href: "#dayner", label: "Dayner" },
  { href: "#servicios", label: "Servicios" },
  { href: "#visita", label: "Visita" },
];

/**
 * Navbar fijo: transparente sobre la foto del hero, oscuro con blur al bajar.
 * En celular los links se esconden detrás de un botón "Menú" que abre una capa a pantalla completa.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menú abierto: Escape lo cierra y la página de atrás no scrollea.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("nav-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  return (
    <>
      <header className={`header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <a href="#inicio" className="logo" aria-label="Gitano Studio, inicio" onClick={() => setOpen(false)}>
          <span className="logo-word">gitano</span>
          <span className="logo-sub">studio</span>
        </a>
        <nav className="header-links mono" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={FRESHA_URL} target="_blank" rel="noopener" className="header-book">
            Agendar <Chevron />
          </a>
          <button
            type="button"
            className="header-toggle mono"
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Cerrar" : "Menú"}
            <span className="burger" aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </nav>
      </header>

      <div id="mnav" className={`mnav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="Principal (celular)">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : "0s" }}>
              <span className="mono">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mnav-foot">
          <a href={FRESHA_URL} target="_blank" rel="noopener" className="pill" tabIndex={open ? 0 : -1}>
            Agendar <Chevron />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="pill pill-ghost" tabIndex={open ? 0 : -1}>
            WhatsApp <Chevron />
          </a>
        </div>
      </div>
    </>
  );
}
