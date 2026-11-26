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
  line: string;
  img: string;
};

// Fotos de Obra (1200×1600, 3:4) con nombre de archivo descriptivo (SEO de imágenes).
const OBRA: Record<number, string> = {"1": "fade-con-textura-barberia-merida", "2": "mullet-con-barba-barberia-merida", "3": "taper-rizado-con-barba-barberia-merida", "4": "high-fade-con-barba-barberia-merida", "5": "crop-texturizado-barberia-merida", "6": "afro-esculpido-corte-mujer-merida"};
const obra = (n: number) => `/img/obra/${OBRA[n]}.webp`;
export const PIECES: Piece[] = [
  { no: "01", name: "Fade con textura", detail: "Máquina + tijera", time: "45 min", line: "Degradado limpio abajo, movimiento arriba. El que nunca falla.", img: obra(1), alt: "Fade con textura hecho con máquina y tijera en Gitano Studio, barbería en Mérida" },
  { no: "02", name: "Mullet + barba", detail: "Tijera + navaja", time: "60 min", line: "Corto adelante, actitud atrás. Con la barba a juego.", img: obra(2), alt: "Mullet con barba trabajado a tijera y navaja en Gitano Studio, Mérida, Yucatán" },
  { no: "03", name: "Taper rizado", detail: "Rizo natural + barba", time: "60 min", line: "Tu rizo se respeta: laterales limpios y la forma natural intacta.", img: obra(3), alt: "Taper en cabello rizado natural con barba, Gitano Studio Mérida" },
  { no: "04", name: "High fade + barba", detail: "Perfilado a navaja", time: "60 min", line: "Fade alto y barba marcada a navaja. Líneas que se notan desde la otra banqueta.", img: obra(4), alt: "High fade con barba perfilada a navaja en una barbería de Mérida" },
  { no: "05", name: "Crop texturizado", detail: "Fade + textura arriba", time: "45 min", line: "Corto, con textura y casi cero mantenimiento. Te levantas y ya quedó.", img: obra(5), alt: "Crop texturizado con fade, corte de hombre en Gitano Studio" },
  { no: "06", name: "Afro esculpido", detail: "Tijera · corte de mujer", time: "60 min", line: "Volumen con forma. Corte corto de mujer trabajado a tijera, mechón por mechón.", img: obra(6), alt: "Afro esculpido, corte corto de mujer a tijera en Gitano Studio, Mérida" },
];

export type Service = { name: string; note?: string; price: number | null };
export type ServiceGroup = { no: string; title: string; items: Service[] };

// Carta de servicios (precios en MXN). price: null = incluido.
export const SERVICES: ServiceGroup[] = [
  {
    no: "01",
    title: "Corte",
    items: [
      { name: "Corte personalizado", note: "Asesoría, corte y acabado pensados para tu cabeza. Máquina, tijera o las dos.", price: 350 },
      { name: "Corte especializado a tijera", note: "Todo a tijera, para quien busca textura, movimiento y un crecimiento que no se ve desaliñado.", price: 400 },
      { name: "Corte corto femenino", note: "Cortes cortos de mujer con forma y textura, diseñados para ti y no para la foto de Pinterest.", price: 450 },
    ],
  },
  {
    no: "02",
    title: "Barba",
    items: [
      { name: "Diseño y arreglo de barba", note: "Forma, perfilado a navaja y acabado. Tu barba, pero bien hecha.", price: 250 },
      { name: "Ritual con toalla caliente", note: "Toalla caliente y navaja para un afeitado al ras y la piel tranquila.", price: 150 },
    ],
  },
  {
    no: "03",
    title: "Completos",
    items: [
      { name: "Corte y barba", note: "Cabello y barba en una sola cita. Sales completo.", price: 500 },
      { name: "Experiencia Gitano", note: "Corte, barba, toalla caliente y facial exprés. Para cuando sí te quieres consentir.", price: 650 },
    ],
  },
  {
    no: "04",
    title: "Detalles",
    items: [
      { name: "Tratamiento facial exprés", note: "Un facial rápido para que la piel también salga fresca.", price: 180 },
      { name: "Diseño de cejas", note: "Cejas definidas, sin que se note que te las arreglaste.", price: 80 },
      { name: "Asesoría de productos y peinado", note: "Te decimos cómo peinarte en casa y con qué.", price: null },
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
// TODO: que Dayner confirme formas de pago (efectivo, tarjeta, transferencia) y una referencia para llegar.
export type Faq = { q: string; a: string };
export const FAQS: Faq[] = [
  { q: "¿Cuánto cuesta un corte de cabello en Gitano Studio?", a: "Un corte personalizado en Gitano Studio cuesta $350 MXN y el corte especializado a tijera, $400 MXN. Corte y barba sale en $500 y la Experiencia Gitano completa, en $650. Pagas directo en el estudio." },
  { q: "¿Necesito cita o atienden sin cita?", a: "Gitano Studio atiende solo con cita, para que cada cliente tenga su tiempo completo, sin esperas. Agenda en línea por Fresha o escríbenos por WhatsApp." },
  { q: "¿Qué horario tiene Gitano Studio?", a: "Gitano Studio abre de martes a sábado de 10:00 a 19:30 y los domingos de 12:00 a 18:00. Los lunes cerramos." },
  { q: "¿Dónde está la barbería?", a: "Gitano Studio está en la Calle 31, Circuito Colonias, colonia México Oriente, en Mérida, Yucatán." },
  { q: "¿Hacen cortes de mujer?", a: "Sí. Gitano Studio hace cortes cortos de mujer desde $450 MXN, como el afro esculpido, con el mismo trabajo de tijera y detalle que cualquier corte de la casa." },
  { q: "¿Qué incluye la Experiencia Gitano?", a: "La Experiencia Gitano incluye corte, arreglo de barba, toalla caliente y tratamiento facial exprés en una sola cita, por $650 MXN." },
  { q: "¿Cuánto dura una cita?", a: "Una cita en Gitano Studio dura entre 45 y 60 minutos, según el servicio. Un fade con textura o un crop texturizado toman unos 45 minutos; los servicios con barba, alrededor de una hora." },
  { q: "¿Hacen fades y degradados?", a: "Sí. El fade con textura, el high fade, el taper y el crop texturizado están entre los cortes que más se trabajan en Gitano Studio. Un corte personalizado con máquina y tijera cuesta $350 MXN." },
  { q: "¿Qué es una barbería de autor?", a: "Una barbería de autor es un estudio donde el barbero diseña cada corte según tu cabeza, tu tipo de cabello y tu estilo, en lugar de repetir cortes de catálogo. En Gitano Studio cada cita empieza con una asesoría con Dayner." },
  { q: "¿Cómo agendo una cita?", a: "Agenda en línea por Fresha desde el botón “Aparta tu lugar” o mándanos un WhatsApp. Eliges servicio, día y hora, y ya quedó." },
  { q: "¿Qué formas de pago aceptan?", a: "El pago se hace en el estudio, al terminar." },
];

// Frase que define la marca: idéntica en el sitio, Google Business Profile, Fresha e Instagram.
export const ENTITY = "Gitano Studio es una barbería de autor en Mérida, Yucatán, fundada por el barbero Dayner, en la Calle 31, Circuito Colonias, colonia México Oriente.";

// TODO: Dayner puede sumar años de oficio, formación y una frase suya.
export const BIO = [
  "Dayner corta con la técnica de siempre, tijera y navaja, y con el ojo de ahora. Antes de tocar una sola hebra platica contigo: forma de la cabeza, tipo de cabello y cuánto tiempo le dedicas al espejo en la mañana (sin juzgar). Luego corta. Y al final te explica cómo peinarte en casa y qué producto sí vale la pena.",
  "Atiende con cita de martes a domingo en la Calle 31, Circuito Colonias, México Oriente. ¿Quieres todo el ritual? La Experiencia Gitano suma barba, toalla caliente y facial exprés.",
];
