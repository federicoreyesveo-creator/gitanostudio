"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo de "Es una pieza": manchas de luz grises que derivan lento ("Mesh drift"),
 * adaptado del Shader Builder de 21st.dev a la paleta del sitio (solo negros y grises).
 * WebGL puro, sin dependencias. Quitamos lo que no usamos (cursor, blur, hue, OKLab)
 * para que sea liviano.
 * Se pausa fuera de pantalla o con la pestaña oculta; con movimiento reducido queda fijo.
 */
const VERT = `attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[4];
uniform vec3 u_scene; // resolución.xy, tiempo

float grainHash(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main(){
  vec2 res = u_scene.xy;
  float t = u_scene.z;
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y) * 1.16;

  // Cada color es una mancha que orbita lento; el pixel mezcla según la cercanía.
  vec3 acc = u_colors[0] * 0.15;
  float total = 0.15;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec2 c = vec2(sin(t * (0.21 + fi * 0.071) + fi * 2.4 + 2.1),
                  cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * 0.57;
    float w = exp(-dot(p - c, p - c) * 6.0);
    acc += u_colors[i] * w;
    total += w;
  }
  vec3 col = acc / total;

  // Un poco de grano propio para que el degradé no haga escalones (banding).
  col += (grainHash(gl_FragCoord.xy) - 0.5) * 0.02;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// Paleta del sitio, cerca del gris del fondo (#3a3a3a) para que sea sutil:
// base, luz suave, medio y sombra.
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const COLORS = ["#2e2e2e", "#5e5e5e", "#424242", "#1c1c1c"].flatMap(hex);
const TIME_SCALE = 0.6;

export default function MeshShader() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const gl = cv.getContext("webgl", { antialias: false });
    if (!gl) return; // sin WebGL: queda el gris liso de .cut-stage

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(gl.getUniformLocation(program, "u_colors"), new Float32Array(COLORS));
    const uScene = gl.getUniformLocation(program, "u_scene");

    // Es un degradé suave: con media resolución alcanza y ahorra batería.
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      const w = Math.max(1, Math.round(cv.clientWidth * scale));
      const h = Math.max(1, Math.round(cv.clientHeight * scale));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const start = performance.now();
    const draw = (now: number) => {
      resize();
      gl.uniform3f(uScene, cv.width, cv.height, ((now - start) / 1000) * TIME_SCALE);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const ro = new ResizeObserver(() => draw(performance.now()));
    ro.observe(cv);

    const cleanup = () => {
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(start + 8000);
      return cleanup;
    }

    // Anima solo en pantalla y con la pestaña visible, a ~30 fps.
    let raf = 0;
    let last = 0;
    let inView = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      draw(now);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (inView && document.visibilityState === "visible") raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      sync();
    });
    io.observe(cv);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, []);

  return <canvas ref={canvas} className="cut-shader" aria-hidden />;
}
