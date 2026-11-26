"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRESHA_URL, SERVICES } from "@/lib/data";
import { Chevron } from "./Ui";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Hazlo tuyo.";

export default function Menu() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      const once = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });

      // Encabezado: kicker, palabras del título que suben, botón.
      gsap.timeline({ scrollTrigger: once(q(".menu-head")[0]) })
        .from(q(".menu-kicker"), { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" })
        .from(q(".menu-title .w > span"), { yPercent: 110, duration: 0.9, stagger: 0.07, ease: "expo.out" }, "<0.1")
        .from(q(".menu-head .pill"), { opacity: 0, x: 24, duration: 0.7, ease: "power3.out" }, "<0.3");

      // Cada rubro: la línea se dibuja y el título entra.
      q(".menu-group").forEach((g) => {
        const gq = gsap.utils.selector(g);
        gsap.timeline({ scrollTrigger: once(g, "top 88%") })
          .fromTo(g, { "--rule": 0 }, { "--rule": 1, duration: 0.8, ease: "power2.inOut" })
          .from(gq(".menu-group-head > *"), { opacity: 0, y: 24, duration: 0.7, stagger: 0.06, ease: "power3.out" }, "<0.1");
      });

      // Cada servicio (y el pie) aparece recién cuando llega a la pantalla: fade + sube un poco.
      // batch agrupa los que entran juntos para que caigan en cascada.
      const items = q(".menu-item, .menu-foot");
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", overwrite: true }),
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="menu" id="servicios">
      <div className="menu-head">
        <div>
          <h2 className="mono menu-kicker">Servicios y precios de barbería en Mérida</h2>
          <p className="display display-4 menu-title">
            {TITLE.split(" ").map((w, i) => (
              <span className="w" key={i}>
                <span>{w}</span>{" "}
              </span>
            ))}
          </p>
          <p className="menu-sub">Precios claros, en pesos y sin letras chiquitas. Pagas en el estudio.</p>
        </div>
        <a href={FRESHA_URL} target="_blank" rel="noopener" className="pill">
          Aparta tu lugar <Chevron />
        </a>
      </div>

      <div className="menu-groups">
        {SERVICES.map((g) => (
          <div className="menu-group" key={g.no}>
            <div className="menu-group-head">
              <span className="mono">{g.no}</span>
              <h3>{g.title}</h3>
            </div>
            <ul className="menu-items">
              {g.items.map((s) => (
                <li key={s.name}>
                  <a href={FRESHA_URL} target="_blank" rel="noopener" className="menu-item">
                    <span className="menu-item-name">
                      {s.name}
                      {s.note && <small className="mono">{s.note}</small>}
                    </span>
                    <span className={`menu-item-price ${s.price === null ? "is-incl" : ""}`}>
                      {s.price === null ? "Incluida" : `$${s.price}`}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="menu-foot mono">
        <span>Precios en MXN · Pagas en el estudio</span>
        <span>Agenda en línea por Fresha o por WhatsApp</span>
      </p>
    </section>
  );
}
