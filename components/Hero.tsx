"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRESHA_URL, HERO_IMG, WHATSAPP_URL } from "@/lib/data";
import { Chevron } from "./Ui";
import { onReady } from "./Loader";

gsap.registerPlugin(ScrollTrigger);

// Cada renglón se estira hasta ocupar todo el ancho del bloque (titular tipo afiche).
// Desktop: columna angosta en el negro de la izquierda, a la altura de los ojos; botones abajo a la derecha.
// Celular: titular a todo el ancho, abajo, con los botones debajo.
const LINES = [
  { text: "En el espejo", hit: false },
  { text: "no hay suerte.", hit: false },
  { text: "Hay oficio.", hit: true },
];

/** Ajusta el cuerpo de cada renglón visible para que llene el ancho del contenedor. */
function fitLines(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".hero-title").forEach((title) => {
    if (!title.offsetParent) return; // la versión oculta (desktop/móvil) no se mide
    const width = title.clientWidth * 0.995; // margen mínimo para que nunca se corte la última letra
    title.querySelectorAll<HTMLElement>(".fit").forEach((el) => {
      el.style.fontSize = "100px";
      // Dos pasadas: el kerning no escala perfecto lineal y la primera queda ~1% pasada.
      for (let i = 0; i < 3; i++) {
        const size = parseFloat(el.style.fontSize);
        el.style.fontSize = `${(size * width) / el.getBoundingClientRect().width}px`;
      }
    });
  });
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const fit = () => fitLines(el);
    fit();
    document.fonts.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });
    // La fuente puede terminar de cargar después de fonts.ready: re-medimos cuando llega
    // y cuando cambia el ancho del contenedor (scrollbar, zoom, resize).
    document.fonts.addEventListener("loadingdone", fit);
    const ro = new ResizeObserver(fit);
    el.querySelectorAll(".hero-title").forEach((t) => ro.observe(t));
    const late = window.setTimeout(fit, 1200);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada: queda en pausa hasta que se abre la pantalla de carga.
        const intro = gsap.timeline({ paused: true })
          .fromTo(".hero-img", { scale: 1.18 }, { scale: 1.04, duration: 2.4, ease: "expo.out" }, 0)
          .from(".hero-title .line > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0.25)
          .from(".hero-meta > *, .hero-kicker", { opacity: 0, y: 12, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.8);
        const off = onReady(() => intro.play());

        // Al bajar: la foto se hunde y el texto se va antes que ella.
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-img-wrap", { yPercent: 18, ease: "none", scrollTrigger: st });
        gsap.to(".hero-content", { yPercent: -30, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
        return off;
      });
    }, el);
    return () => {
      document.fonts.removeEventListener("loadingdone", fit);
      ro.disconnect();
      window.clearTimeout(late);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="hero" id="inicio">
      <div className="hero-img-wrap">
        <img className="hero-img" src={HERO_IMG} alt="Cliente con mullet y fade recién cortado en Gitano Studio, barbería en Mérida" width={2048} height={1152} />
      </div>
      <div className="hero-shade" />

      <div className="hero-content">
        <div className="hero-copy">
          <h1 className="hero-kicker mono">Barbería de autor en Mérida, Yucatán</h1>
          <p className="display hero-title" aria-hidden>
            {LINES.map((l) => (
              <span className={`line ${l.hit ? "is-hit" : ""}`} key={l.text}>
                <span className="fit">{l.text}</span>{" "}
              </span>
            ))}
          </p>
          <p className="hero-sub">
            Fades, tijera y navaja con tiempo para el detalle. Dayner atiende una cabeza a la vez en la Calle 31 de México Oriente. Sin fila, sin prisa, sin cortes de catálogo.
          </p>
        </div>

        <div className="hero-meta">
          <p className="hero-where mono">Martes a domingo · Solo con cita</p>
          <a href={FRESHA_URL} target="_blank" rel="noopener" className="pill">
            Aparta tu lugar <Chevron />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="pill pill-ghost">
            Escríbenos por WhatsApp <Chevron />
          </a>
        </div>
      </div>
    </section>
  );
}
