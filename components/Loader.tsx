"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { HERO_IMG, PIECES } from "@/lib/data";

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

// Fotos del pase rápido: los cortes, y al final la foto de portada (la que queda al abrir).
const SHOTS = [
  ...PIECES.map((p) => p.img),
  "/img/cut/gitano-studio-crop-fade-barba-linea-merida.webp",
  "/img/cut/gitano-studio-corte-shag-mujer-capas-merida.webp",
  "/img/cut/gitano-studio-taper-fade-rizado-merida.webp",
  "/img/cut/gitano-studio-buzz-cut-mujer-fade-merida.webp",
];
const STEP = 0.13; // segundos por foto

/**
 * Pantalla de carga: aparece el logo, en el medio pasan los cortes uno tras otro (rapidito)
 * y el último es la foto de portada. Esa ventana se abre hasta llenar la pantalla y ya estamos en la home.
 * El contador sigue la carga real (fotos + tipografías). Si algo falla, el CSS la esconde sola a los 8 s.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const html = document.documentElement;
    html.classList.add("no-scroll");
    window.scrollTo(0, 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      html.classList.remove("no-scroll");
      window.__gsReady = true;
      window.dispatchEvent(new Event("gs:ready"));
    };

    // Carga real: tipografías + cada foto del pase + la portada.
    const load = (src: string) =>
      new Promise<void>((r) => {
        const im = new Image();
        im.onload = im.onerror = () => r();
        im.src = src;
      });
    const tasks = [document.fonts.ready, ...SHOTS.map(load), load(HERO_IMG)];
    let loaded = 0;
    tasks.forEach((t) => t.then(() => loaded++));
    const all = Promise.all(tasks);

    if (reduced) {
      all.then(() => gsap.to(el, { opacity: 0, duration: 0.5, onStart: finish, onComplete: () => setGone(true) }));
      return () => html.classList.remove("no-scroll");
    }

    // Contador: avanza con lo que va cargando y con el pase de fotos, sin saltos.
    let shown = 0;
    let shot = 0;
    const counters = q(".ld-count");
    const tick = () => {
      const target = Math.min((loaded / tasks.length) * 100, ((shot + 1) / (SHOTS.length + 1)) * 100);
      shown += (target - shown) * 0.15;
      if (target - shown < 0.5) shown = target;
      counters.forEach((c) => (c.textContent = String(Math.round(shown)).padStart(3, "0")));
    };
    gsap.ticker.add(tick);

    const imgs = q(".ld-frame img");
    const show = (i: number) => imgs.forEach((im, k) => ((im as HTMLElement).style.visibility = k === i ? "visible" : "hidden"));
    show(0);

    // Ventana del medio, en coordenadas de pantalla (para abrirla después sobre la foto de portada).
    // (relativa a la caja de la foto final: en celular esa caja es solo la parte de arriba).
    const win = () => {
      const r = q(".ld-frame")[0].getBoundingClientRect();
      const h = q(".ld-hero")[0].getBoundingClientRect();
      return [r.top - h.top, h.right - r.right, h.bottom - r.bottom, r.left - h.left].map((v) => Math.max(0, v));
    };

    let alive = true;
    let timer = 0;
    const intro = gsap
      .timeline()
      .from(q(".ld-logo > span"), { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08 })
      .from(q(".ld-count, .ld-place"), { opacity: 0, duration: 0.5 }, "<0.2")
      .fromTo(q(".ld-frame"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "expo.inOut" }, "<0.15");

    // Pase rápido: una foto cada STEP; da al menos una vuelta y sigue girando hasta que todo cargó.
    let ready = false;
    all.then(() => (ready = true));
    intro.then(() => {
      const next = () => {
        if (!alive) return;
        if (shot >= SHOTS.length - 1 && ready) return open();
        shot = (shot + 1) % SHOTS.length;
        show(shot);
        timer = window.setTimeout(next, STEP * 1000);
      };
      timer = window.setTimeout(next, STEP * 1000);
    });

    // Último corte → la foto de portada en la misma ventana → la ventana se abre a pantalla completa.
    const open = () => {
      shot = SHOTS.length;
      const hero = q(".ld-hero")[0] as HTMLElement;
      // La ventana crece pareja hacia los cuatro lados, desde el centro.
      const from = win();
      const grow = { p: 0 };
      const clip = () => (hero.style.clipPath = `inset(${from.map((v) => `${(v * (1 - grow.p)).toFixed(2)}px`).join(" ")})`);
      clip();
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .set(hero, { visibility: "visible" })
        .set(q(".ld-frame"), { visibility: "hidden" })
        .to(grow, { p: 1, duration: 1.05, ease: "expo.inOut", onUpdate: clip }, "+=0.28")
        .to(q(".ld-logo, .ld-count, .ld-place"), { opacity: 0, duration: 0.35, ease: "power2.in" }, "<")
        .call(finish, [], "<0.75") // la portada arranca cuando la ventana ya casi llenó la pantalla
        .to(el, { opacity: 0, duration: 0.35, ease: "power1.out" });
    };

    return () => {
      alive = false;
      clearTimeout(timer);
      intro.kill();
      gsap.ticker.remove(tick);
      html.classList.remove("no-scroll");
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="ld" aria-hidden>
      <div className="ld-frame">
        {SHOTS.map((src, i) => (
          <img key={src} src={src} alt="" decoding="async" style={{ visibility: i === 0 ? "visible" : "hidden" }} />
        ))}
      </div>
      <div className="ld-hero">
        <img src={HERO_IMG} alt="" />
      </div>
      <div className="ld-logo">
        <span className="ld-word">gitano</span>
        <span className="ld-sub">studio</span>
      </div>
      <span className="mono ld-count">000</span>
      <span className="mono ld-place">Barbería de autor · Mérida</span>
    </div>
  );
}
