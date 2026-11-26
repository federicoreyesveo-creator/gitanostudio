"use client";

import { useEffect, useState } from "react";
import { ADDRESS, ENTITY, FRESHA_URL, HOURS, INSTAGRAM_URL, MAPS_EMBED, MAPS_URL, WHATSAPP_URL } from "@/lib/data";
import { ArrowOut, Chevron, Marquee } from "./Ui";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const fmt = (h: number) => `${Math.floor(h)}:${h % 1 ? "30" : "00"}`;

function useStatus() {
  const [status, setStatus] = useState<{ open: boolean; text: string; today: number } | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Merida" }));
      const d = now.getDay();
      const h = now.getHours() + now.getMinutes() / 60;
      const today = HOURS[d];
      if (today && h >= today[0] && h < today[1]) {
        return { open: true, text: `Abierto hoy hasta ${fmt(today[1])}`, today: d };
      }
      if (today && h < today[0]) {
        return { open: false, text: `Abrimos hoy a las ${fmt(today[0])}`, today: d };
      }
      for (let i = 1; i <= 7; i++) {
        const nd = (d + i) % 7;
        const next = HOURS[nd];
        if (next) {
          const when = i === 1 ? "mañana" : `el ${DAYS[nd].toLowerCase()}`;
          return { open: false, text: `Cerrado · abrimos ${when} a las ${fmt(next[0])}`, today: d };
        }
      }
      return { open: false, text: "Cerrado", today: d };
    };
    setStatus(compute());
    const id = setInterval(() => setStatus(compute()), 60_000);
    return () => clearInterval(id);
  }, []);

  return status;
}

export default function Visit() {
  const status = useStatus();
  const order = [2, 3, 4, 5, 6, 0, 1];

  return (
    <section className="visit" id="visita">
      <Marquee items={[(status?.text ?? "Mar–Sáb 10:00–19:30").toUpperCase(), "CALLE 31", "MÉRIDA"]} />
      <div className="visit-title">
        <p className="mono visit-kicker">Visita · Gitano Studio, Mérida</p>
        <h2 className="display display-5">Calle 31, México Oriente.</h2>
      </div>

      <div className="visit-grid">
        <div>
          <p className="lead">Calle 31, Circuito Colonias, México Oriente, Mérida, Yuc.</p>
          {status && (
            <p className={`status mono ${status.open ? "is-open" : ""}`}>
              <i /> {status.text}
            </p>
          )}
        </div>

        <dl className="hours mono">
          {order.map((d) => {
            const h = HOURS[d];
            return (
              <div key={d} className={status?.today === d ? "today" : ""}>
                <dt>{DAYS[d]}</dt>
                <dd>{h ? `${fmt(h[0])} – ${fmt(h[1])}` : "Cerrado"}</dd>
              </div>
            );
          })}
        </dl>

        <div className="visit-actions">
          <a href={FRESHA_URL} target="_blank" rel="noopener" className="pill">
            Aparta tu lugar <Chevron />
          </a>
          <div className="visit-links mono">
            <a href={MAPS_URL} target="_blank" rel="noopener">Cómo llegar <ArrowOut /></a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener">WhatsApp <ArrowOut /></a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">Instagram <ArrowOut /></a>
          </div>
        </div>
      </div>

      <div className="visit-map">
        <iframe
          src={MAPS_EMBED}
          title="Mapa: Gitano Studio, Calle 31, Mérida"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <footer className="footer">
        <div className="footer-mark">
          <img src="/img/carita.png" alt="Gitano Studio" width={684} height={642} />
        </div>
        <p className="footer-entity">{ENTITY}</p>
        <div className="footer-row mono">
          {/* En desktop los tres datos van en fila; en celular, apilados a la izquierda con el crédito a la derecha. */}
          <div className="footer-info">
            <span>Gitano Studio · Barbería de autor en Mérida, Yucatán</span>
            <span>Mar–Sáb 10:00–19:30 · Dom 12:00–18:00</span>
            <span>Estado del Arte</span>
            <span>© 2026</span>
          </div>
          <a href="https://www.almabruta.studio" target="_blank" rel="noopener" className="footer-credit">
            Diseñado por Alma Bruta
          </a>
        </div>
      </footer>
    </section>
  );
}
