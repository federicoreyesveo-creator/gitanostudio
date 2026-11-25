"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MeshShader from "./MeshShader";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  before: string;
  after: string;
  /** Cada elemento es un renglón */
  caption: string[];
  /** Collage: [principal, arriba a la derecha, sangrando por el borde derecho, chica montada sobre la principal] */
  imgs: string[];
  /** Texto alternativo de cada foto (SEO y lectores de pantalla) */
  alts?: string[];
  id?: string;
};

/**
 * La firma del sitio: un tajo horizontal parte la frase en dos;
 * las mitades se abren y debajo aparece una composición fuera de grilla
 * (foto recortada + texto al costado montado sobre su borde).
 */
export default function Cut({ before, after, caption, imgs, alts, id }: Props) {
  const root = useRef<HTMLElement>(null);

  // Centra la frase en el tajo usando la altura de mayúsculas real de la fuente.
  useEffect(() => {
    const center = () => {
      root.current?.querySelectorAll<HTMLElement>(".cut-before-inner").forEach((p) => {
        const cs = getComputedStyle(p);
        const fs = parseFloat(cs.fontSize);
        const ctx = document.createElement("canvas").getContext("2d")!;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontStretch} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText("H");
        const asc = m.fontBoundingBoxAscent;
        const desc = m.fontBoundingBoxDescent;
        const baseline = (fs - (asc + desc)) / 2 + asc;
        const capCenter = baseline - m.actualBoundingBoxAscent / 2;
        p.style.top = `${fs / 2 - capCenter}px`;
      });
    };
    document.fonts.ready.then(center);
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=200%",
          scrub: 0.6,
          pin: true,
          refreshPriority: 3, // ver nota en Collection.tsx
        },
      });
      tl.from(q(".cut-before-inner"), { yPercent: 8, opacity: 0, duration: 0.5 })
        .fromTo(q(".cut-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" })
        .addLabel("open")
        .to(q(".cut-top"), { yPercent: -100, duration: 1, ease: "power3.in" }, "open+=0.1")
        .to(q(".cut-bottom"), { yPercent: 100, duration: 1, ease: "power3.in" }, "open+=0.1")
        .to(q(".cut-line"), { opacity: 0, duration: 0.2 }, "open+=0.15")
        // Al abrirse, el fondo pasa de negro a gris.
        .to(q(".cut-stage"), { backgroundColor: "#3a3a3a", duration: 1, ease: "power2.out" }, "open+=0.3")
        // y aparece el fondo con manchas de luz en movimiento.
        .fromTo(q(".cut-shader"), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power2.out" }, "open+=0.4")
        .fromTo(q(".cut-frame"), { clipPath: "inset(18% 22% 18% 22%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.25, ease: "power3.out" }, "open+=0.5")
        .fromTo(q(".cut-img"), { scale: 1.35 }, { scale: 1, duration: 1.6, stagger: 0.25, ease: "power2.out" }, "open+=0.5")
        .from(q(".cut-after .w > span"), { yPercent: 110, stagger: 0.08, duration: 0.6, ease: "power3.out" }, "open+=1")
        .from(q(".cut-caption"), { opacity: 0, y: 12, duration: 0.4 }, "<+0.2")
        // Mientras sigue fijo, las fotos chicas derivan a distinta velocidad (profundidad).
        .to(q(".f2"), { yPercent: -14, duration: 1.2, ease: "none" }, ">")
        // En celular las fotos de abajo apenas se mueven para no montarse sobre el texto.
        .to(q(".f3"), { yPercent: () => (window.innerWidth > 900 ? -24 : -4), duration: 1.2, ease: "none" }, "<")
        .to(q(".f4"), { yPercent: () => (window.innerWidth > 900 ? -32 : -6), duration: 1.2, ease: "none" }, "<");
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="cut" id={id}>
      <div className="cut-stage">
        <MeshShader />
        {imgs.map((src, i) => (
          <figure className={`cut-frame f${i + 1}`} key={src}>
            <img className="cut-img" src={src} alt={alts?.[i] ?? ""} loading="lazy" />
          </figure>
        ))}
        <div className="cut-copy">
          <h2 className="cut-after">
            {after.split(" ").map((w, i) => (
              <span className="w" key={i}>
                <span>{w}</span>
              </span>
            ))}
          </h2>
          <p className="cut-caption">
            {caption.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
        </div>

        {/* Dos mitades con la misma frase; cada una muestra solo su mitad */}
        <div className="cut-half cut-top" aria-hidden>
          <div className="cut-before">
            <p className="cut-before-inner">{before}</p>
          </div>
        </div>
        <div className="cut-half cut-bottom">
          <div className="cut-before">
            <p className="cut-before-inner">{before}</p>
          </div>
        </div>
        <div className="cut-line" aria-hidden />
      </div>
    </section>
  );
}
