"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// TODO: bio en borrador; que Dayner confirme datos (trayectoria, formación).
const BIO = [
  "Dayner es barbero y fundador de Gitano Studio, una barbería de autor en Mérida, Yucatán. Su trabajo une la técnica clásica de tijera y navaja con una lectura de estilo actual: cortes personalizados, corte especializado a tijera, diseño y arreglo de barba y corte corto femenino.",
  "Cada cita empieza con una asesoría: forma de la cabeza, tipo de cabello, rutina y lo que quieres proyectar. Con eso diseña un corte pensado para ti y te explica cómo peinarlo y qué productos usar en casa.",
  "El estudio está en la Calle 31, Circuito Colonias, en la colonia México Oriente. Atiende con cita de martes a domingo, y la Experiencia Gitano suma barba, toalla caliente y tratamiento facial al corte.",
];

export default function Artist() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
          const speed = parseFloat(el.dataset.speed!);
          gsap.fromTo(
            el,
            { yPercent: 6 * speed },
            {
              yPercent: -6 * speed,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
        // Stack: Dayner se fija arriba y queda quieto un tramo (el margen de .menu) para leerlo;
        // recién después Servicios sube y lo tapa, mientras Dayner se hunde y se apaga.
        const sec = root.current!;
        // Por elemento y no por selector: el contexto de gsap busca selectores solo dentro de esta sección.
        const next = document.getElementById("servicios");
        ScrollTrigger.create({
          trigger: sec,
          start: () => (sec.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
          endTrigger: next,
          end: "top top",
          pin: true,
          refreshPriority: 1, // después de Cut y Obra, que agregan alto al fijarse
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        gsap.to(sec.children, {
          scale: 0.94,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
        });

        gsap.from(".collage figure", {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.2,
          ease: "expo.inOut",
          stagger: 0.15,
          scrollTrigger: { trigger: ".collage", start: "top 75%" },
        });
        gsap.from(".bio > *", {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".bio", start: "top 75%" },
        });
      });
    }, root);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="artist" id="dayner">
      <div className="artist-grid">
        <div className="collage">
          <figure className="c1" data-speed="0.4">
            <img src="/img/dayner/dayner-barbero-gitano-studio-merida.webp" alt="Dayner, barbero y fundador de Gitano Studio en Mérida, Yucatán" width={1400} height={1400} loading="lazy" />
          </figure>
          <figure className="c2" data-speed="1">
            <img src="/img/dayner/gitano-studio-barberia-interior-merida.webp" alt="Interior de Gitano Studio: sillones de barbero y sala de espera en Calle 31, Mérida" width={1400} height={1400} loading="lazy" />
          </figure>
          <figure className="c3" data-speed="1.6">
            <img src="/img/dayner/gitano-studio-letrero-calle-31-merida.webp" alt="Dayner colgando el letrero de Gitano Studio en la fachada" width={1120} height={1400} loading="lazy" />
          </figure>
        </div>

        <div className="bio">
          <h2 className="display display-5 artist-title">Dayner</h2>
          <p className="mono bio-kicker">Barbero y fundador · Gitano Studio</p>
          <h3 className="bio-lead">Barbería de autor en Mérida, Yucatán.</h3>
          {BIO.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
