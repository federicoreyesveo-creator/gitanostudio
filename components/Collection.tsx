"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PIECES } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// Inclinación de cada foto cuando están apiladas como un mazo.
const TILT = [-7, 5, -3, 8, -5, 3];

export default function Collection() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop: las 6 fotos arrancan apiladas en el centro como un mazo
    // y al scrollear se reparten hasta quedar en fila, todas del mismo tamaño.
    mm.add("(min-width: 1200px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".piece", grid.current);
      const toCenter = (i: number, axis: "x" | "y") => {
        const g = grid.current!.getBoundingClientRect();
        const c = cards[i].getBoundingClientRect();
        return axis === "x"
          ? g.left + g.width / 2 - (c.left + c.width / 2)
          : g.top + g.height / 2 - (c.top + c.height / 2);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=140%",
          scrub: 0.6,
          pin: true,
          refreshPriority: 2,
          invalidateOnRefresh: true,
        },
      });
      tl.from(cards, {
        x: (i) => toCenter(i, "x"),
        y: (i) => toCenter(i, "y") + 40,
        rotation: (i) => TILT[i],
        scale: 1.3,
        duration: 1,
        ease: "power3.inOut",
        stagger: { each: 0.08, from: "center" },
      })
        .from(".piece-cap, .piece-no", { opacity: 0, y: 12, duration: 0.3, stagger: 0.03 }, ">-0.2")
        .to({}, { duration: 0.3 }); // un respiro con la fila armada antes de soltar el pin
    });

    // Tablet y celular: las fotos quedan apiladas como un mazo y, al scrollear,
    // cada una sale volando hacia un costado y deja ver la siguiente (como pasar fotos con el dedo).
    mm.add("(max-width: 1199px) and (prefers-reduced-motion: no-preference)", () => {
      const g = grid.current!;
      const cards = gsap.utils.toArray<HTMLElement>(".piece", g);
      g.classList.add("is-deck");
      cards.forEach((c, i) => (c.style.zIndex = String(cards.length - i)));
      gsap.set(cards, { rotation: (i) => (i ? TILT[i] * 0.6 : 0), scale: (i) => (i ? 0.96 : 1) });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${(cards.length - 1) * window.innerHeight * 0.6}`,
          scrub: 0.5,
          pin: true,
          refreshPriority: 2,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(0, -1).forEach((card, i) => {
        const dir = i % 2 ? 1 : -1;
        tl.to(card, { xPercent: 135 * dir, yPercent: -8, rotation: 16 * dir, duration: 1, ease: "power2.in" })
          .to(cards[i + 1], { rotation: 0, scale: 1, duration: 0.6, ease: "power2.out" }, "<+0.4");
      });
      tl.to({}, { duration: 0.4 }); // la última queda un momento antes de soltar

      return () => {
        g.classList.remove("is-deck");
        cards.forEach((c, i) => (c.style.zIndex = String((PIECES.length - Math.abs(i - 2.5) * 2) | 0)));
      };
    });

    // Siempre: el título entra con movimiento y opacidad.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".collection-head",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 30%", scrub: 0.6 } },
      );
    });

    // Las secciones fijas (Cut → Obra → Dayner) se tienen que medir en orden de página:
    // si una se recrea después (cambio de tamaño, recarga en vivo), Dayner calcularía su pin
    // sin contar el espacio que agrega Obra y aparecería encima. La prioridad + sort lo evita.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="collection" id="obra">
      <div className="collection-head">
        <h2 className="display collection-title">Obra: cortes de autor en Mérida.</h2>
      </div>

      <div ref={grid} className="collection-grid">
        {PIECES.map((p, i) => (
          <article key={p.no} className="piece" style={{ zIndex: PIECES.length - Math.abs(i - 2.5) * 2 | 0 }}>
            <div className="piece-img">
              <img src={p.img} alt={p.alt} width={1200} height={1600} loading="lazy" />
            </div>
            <span className="piece-no" aria-hidden>{p.no}</span>
            <div className="piece-cap">
              <p className="piece-label mono">{p.detail}</p>
              <h3 className="piece-name">{p.name}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
