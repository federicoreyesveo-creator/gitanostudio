"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RATING, REVIEWS } from "@/lib/data";
import { ArrowOut } from "./Ui";

gsap.registerPlugin(ScrollTrigger);

// Estrellas en SVG (el carácter ★ puede salir como emoji en iPhone).
function Stars() {
  return (
    <span className="stars" role="img" aria-label="5 de 5 estrellas">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" aria-hidden>
          <path d="M10 1.2l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L10 15.1l-5.6 3.1 1.3-6.2L1 7.7l6.3-.7z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Reseñas de Google, después de los precios: la prueba justo antes de decidir.
 * "5.0" gigante y una retícula editorial de citas; en mobile la retícula es una tira que se desliza.
 */
export default function Reviews() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.timeline({ scrollTrigger: { trigger: q(".reviews-head")[0], start: "top 85%", once: true } })
        .from(q(".reviews-kicker"), { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" })
        .from(q(".reviews-score > span"), { yPercent: 110, duration: 1, ease: "expo.out" }, "<0.1")
        .from(q(".reviews-meta"), { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "<0.3");
      const cells = q(".review");
      gsap.set(cells, { opacity: 0, y: 30 });
      ScrollTrigger.batch(cells, {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="reviews" id="resenas">
      <div className="reviews-head">
        <div>
          <h2 className="mono reviews-kicker">Reseñas de Gitano Studio en Google</h2>
          <p className="display reviews-score" aria-hidden>
            <span>{RATING.score}</span>
          </p>
        </div>
        <div className="reviews-meta">
          <Stars />
          <p>
            {RATING.score} de 5 en Google, con {RATING.count} reseñas. Todas de cinco estrellas.
          </p>
        </div>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <figure className="review" key={r.name}>
            <span className="mono review-no">{String(i + 1).padStart(2, "0")}</span>
            <blockquote>“{r.text}”</blockquote>
            <figcaption>
              <Stars />
              <span className="review-name">{r.name}</span>
              {r.meta && <span className="mono review-sub">{r.meta}</span>}
            </figcaption>
          </figure>
        ))}
        <a className="review review-more" href={RATING.url} target="_blank" rel="noopener">
          <span className="mono review-no">+{RATING.count - REVIEWS.length} reseñas más</span>
          <span className="review-more-text">
            Lee las {RATING.count} en Google <ArrowOut />
          </span>
        </a>
      </div>
    </section>
  );
}
