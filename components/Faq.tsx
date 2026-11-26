"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAQS } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Preguntas frecuentes en acordeón. Las respuestas siempre están en el HTML
 * (solo se colapsan visualmente), así Google y los buscadores con IA las leen completas.
 */
export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.from(q(".faq-head > *"), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: q(".faq-head")[0], start: "top 85%", once: true },
      });
      const items = q(".faq-item");
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
    <section ref={root} className="faq" id="preguntas">
      <div className="faq-head">
        <h2 className="mono faq-kicker">Preguntas frecuentes sobre Gitano Studio</h2>
        <p className="display faq-title">
          <span>Lo que nos preguntan</span> <span>antes de sentarse.</span>
        </p>
      </div>

      <div className="faq-list">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={f.q}>
              <h3>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="mono faq-no" data-no={String(i + 1).padStart(2, "0")} aria-hidden />
                  <span className="faq-q-text">{f.q}</span>
                  <span className="faq-icon" aria-hidden />
                </button>
              </h3>
              <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
