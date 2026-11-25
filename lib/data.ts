// Contenido del sitio. Todo lo editable vive aquí.

export const FRESHA_URL =
  "https://www.fresha.com/a/gitano-studio-merida-calle-principal-calle-31-circuito-colonias-cogcmbip/booking?menu=true&share=true&pId=3062487";

export const INSTAGRAM_URL = "https://www.instagram.com/gitano.studio/";
// TODO: número real de WhatsApp
export const WHATSAPP_URL = "https://wa.me/520000000000";
// Ubicación del estudio (link que pasó el cliente: maps.app.goo.gl/CREfbusnP73FAvhz6).
export const GEO = { lat: 20.9977016, lng: -89.6062469 };
export const MAPS_URL = "https://maps.app.goo.gl/CREfbusnP73FAvhz6";
export const MAPS_EMBED = `https://maps.google.com/maps?q=${GEO.lat},${GEO.lng}&z=17&hl=es&output=embed`;

export const ADDRESS = {
  line1: "Calle 31, Circuito Colonias",
  line2: "México Oriente, Mérida, Yuc.",
};

// Placeholder: reemplazar por frames de los reels de Dayner.
export const ph = (seed: string, w = 900, h = 1200) =>
  `https://picsum.photos/seed/gitano-${seed}/${w}/${h}?grayscale`;

// TODO: foto real del hero (la manda el cliente)
export const HERO_IMG = "/img/hero/gitano-studio-barberia-merida-mullet.webp";

export type Piece = {
  no: string;
  alt: string;
  name: string;
  detail: string;
  time: string;
  img: string;
};

// Fotos de Obra: public/img/obra/gitano-corte-N.webp (1200×1600, 3:4).
const obra = (n: number) => `/img/obra/gitano-corte-${n}.webp`;
export const PIECES: Piece[] = [
  { no: "01", name: "Fade con textura", detail: "Máquina + tijera", time: "45 min", img: obra(1), alt: "Fade con textura corta, corte de Gitano Studio en Mérida" },
  { no: "02", name: "Mullet + barba", detail: "Tijera + navaja", time: "60 min", img: obra(2), alt: "Mullet con barba perfilada, Gitano Studio Mérida" },
  { no: "03", name: "Taper rizado", detail: "Rizo natural + barba", time: "60 min", img: obra(3), alt: "Taper con rizo natural y barba, barbería Gitano Studio" },
  { no: "04", name: "High fade + barba", detail: "Perfilado a navaja", time: "60 min", img: obra(4), alt: "High fade con barba larga perfilada a navaja, Gitano Studio" },
  { no: "05", name: "Crop texturizado", detail: "Fade + textura arriba", time: "45 min", img: obra(5), alt: "Crop texturizado con fade, corte de autor en Mérida" },
  { no: "06", name: "Afro esculpido", detail: "Corte de mujer", time: "60 min", img: obra(6), alt: "Afro esculpido, corte femenino en Gitano Studio Mérida" },
];

export type Service = { name: string; note?: string; price: number | null };
export type ServiceGroup = { no: string; title: string; items: Service[] };

// Carta de servicios (precios en MXN). price: null = incluido.
export const SERVICES: ServiceGroup[] = [
  {
    no: "01",
    title: "Corte",
    items: [
      { name: "Corte personalizado", note: "Asesoría, técnica y acabado.", price: 350 },
      { name: "Corte especializado a tijera", note: "Control, textura y estilo.", price: 400 },
    ],
  },
  {
    no: "02",
    title: "Barba y afeitado",
    items: [
      { name: "Diseño y arreglo de barba", note: "Perfilado, forma y acabado.", price: 250 },
      { name: "Corte y barba", note: "Servicio completo de cabello y barba.", price: 500 },
    ],
  },
  {
    no: "03",
    title: "Servicios especiales",
    items: [
      { name: "Corte de cabello corto femenino", note: "Diseño y estilo personalizado.", price: 450 },
      { name: "Experiencia Gitano", note: "Corte, barba, toalla caliente y tratamiento facial.", price: 650 },
    ],
  },
  {
    no: "04",
    title: "Complementos",
    items: [
      { name: "Ritual de barba con toalla caliente", price: 150 },
      { name: "Tratamiento facial exprés", price: 180 },
      { name: "Diseño de cejas", price: 80 },
      { name: "Asesoría de productos y peinado", price: null },
    ],
  },
];

// 0 = domingo … 6 = sábado. Horas en formato decimal.
export const HOURS: Record<number, [number, number] | null> = {
  0: [12, 18],
  1: null,
  2: [10, 19.5],
  3: [10, 19.5],
  4: [10, 19.5],
  5: [10, 19.5],
  6: [10, 19.5],
};

// Preguntas frecuentes (SEO local + respuestas citables por buscadores con IA).
// El mismo texto alimenta la sección visible y el schema FAQPage de app/page.tsx.
// TODO: que Dayner confirme duración y formas de pago.
export type Faq = { q: string; a: string };
export const FAQS: Faq[] = [
  {
    q: "¿Cuánto cuesta un corte en Gitano Studio?",
    a: "El corte personalizado cuesta $350 MXN y el corte especializado a tijera, $400 MXN. Corte y barba juntos cuestan $500 MXN, y la Experiencia Gitano completa, $650 MXN. El pago es en el estudio.",
  },
  {
    q: "¿Necesito cita o atienden sin cita?",
    a: "Gitano Studio atiende con cita, para dedicarle a cada cabeza el tiempo que necesita. Puedes reservar en línea por Fresha o escribir por WhatsApp.",
  },
  {
    q: "¿Qué horario tienen?",
    a: "De martes a sábado, de 10:00 a 19:30. Los domingos, de 12:00 a 18:00. Los lunes está cerrado.",
  },
  {
    q: "¿Dónde está la barbería?",
    a: "En la Calle 31, Circuito Colonias, colonia México Oriente, en Mérida, Yucatán.",
  },
  {
    q: "¿Hacen cortes de mujer?",
    a: "Sí. El corte de cabello corto femenino incluye diseño y estilo personalizado y cuesta $450 MXN.",
  },
  {
    q: "¿Qué incluye la Experiencia Gitano?",
    a: "Corte, arreglo de barba, toalla caliente y tratamiento facial, en una sola cita. Cuesta $650 MXN.",
  },
  {
    q: "¿Cuánto dura una cita?",
    a: "Entre 45 y 60 minutos, según el servicio. Cada cita empieza con una asesoría sobre tu tipo de cabello, la forma de tu cabeza y el estilo que buscas.",
  },
];
