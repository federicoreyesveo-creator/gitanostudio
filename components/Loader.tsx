"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

declare global {
  interface Window {
    __gsReady?: boolean;
  }
}

/** Corre `fn` cuando terminó la pantalla de carga (o ya, si terminó antes). */
export function onReady(fn: () => void) {
  if (window.__gsReady) {
    fn();
    return () => {};
  }
  window.addEventListener("gs:ready", fn, { once: true });
  return () => window.removeEventListener("gs:ready", fn);
}

const MIN_MS = 1900; // que el contador llegue a leerse aunque la página cargue al instante

// Lo que se ve en la pantalla de carga. Se dibuja dos veces (una por mitad) para poder partirla.
function Face() {
  return (
    <div className="ld-face">
      <div className="ld-logo">
        <span className="ld-word">gitano</span>
        <span className="ld-sub">studio</span>
      </div>
      <span className="mono ld-count">
        000
      </span>
      <span className="mono ld-place">Barbería de autor · Mérida</span>
    </div>
  );
}

/**
 * Pantalla de carga "el tajo": el logo y un contador que sigue la carga real (foto de portada + tipografías).
 * Al llegar a 100, una línea corta la pantalla por la mitad y las dos mitades se abren
 * (arrancan lento y salen de golpe). Si algo falla, el CSS la esconde sola a los 7 s.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const html = document.documentElement;
    html.classList.add("no-scroll");
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // El contador corre hacia el progreso real, sin saltos.
    const shown = { v: 0 };
    let target = 0;
    const paint = () => {
      const txt = String(Math.round(shown.v)).padStart(3, "0");
      el.querySelectorAll(".ld-count").forEach((c) => (c.textContent = txt));
    };
    const tick = () => {
      shown.v += (target - shown.v) * 0.12;
      if (target - shown.v < 0.5) shown.v = target;
      paint();
    };
    gsap.ticker.add(tick);

    const img = document.querySelector<HTMLImageElement>(".hero-img");
    const tasks: Promise<unknown>[] = [
      document.fonts.ready,
      img && !img.complete ? new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); }) : Promise.resolve(),
      new Promise((r) => setTimeout(r, MIN_MS)),
    ];
    let done = 0;
    tasks.forEach((t) => t.then(() => (target = Math.max(target, (++done / tasks.length) * 90))));
    // Mientras espera, avanza solo un poco para que nunca quede quieto.
    const creep = gsap.to({}, { duration: MIN_MS / 1000, onUpdate() { target = Math.max(target, this.progress() * 80); } });

    let alive = true;
    Promise.all(tasks).then(() => {
      if (!alive) return;
      target = 100;
      const finish = () => {
        html.classList.remove("no-scroll");
        window.__gsReady = true;
        window.dispatchEvent(new Event("gs:ready"));
      };
      if (reduced) {
        gsap.to(el, { opacity: 0, duration: 0.5, delay: 0.3, onStart: finish, onComplete: () => setGone(true) });
        return;
      }
      const q = gsap.utils.selector(el);
      gsap
        .timeline({ delay: 0.35, onComplete: () => setGone(true) })
        .to(q(".ld-face"), { opacity: 0.55, duration: 0.3, ease: "power1.out" })
        .fromTo(q(".ld-cut"), { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "expo.inOut" }, "<")
        // Las mitades se abren: arrancan lento y salen de golpe.
        .to(q(".ld-top"), { yPercent: -100, duration: 0.95, ease: "expo.in" }, "+=0.12")
        .to(q(".ld-bottom"), { yPercent: 100, duration: 0.95, ease: "expo.in" }, "<")
        .to(q(".ld-cut"), { opacity: 0, duration: 0.25 }, "<0.55")
        .call(finish, [], "<0.15"); // la portada arranca mientras se abre
    });

    return () => {
      alive = false;
      creep.kill();
      gsap.ticker.remove(tick);
      html.classList.remove("no-scroll");
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="ld" aria-hidden>
      <div className="ld-half ld-top">
        <Face />
      </div>
      <div className="ld-half ld-bottom">
        <Face />
      </div>
      <i className="ld-cut" />
    </div>
  );
}
