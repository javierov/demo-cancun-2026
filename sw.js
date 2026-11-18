/* Cancun 2026: guarda la app en el móvil para usarla sin internet */
const V = "c26-cancun-2026-v12"; /* solo borra sus propias copias: en github.io todas las apps comparten el mismo sitio */
const FILES = ["./", "index.html", "manifest.json", "icono.png", "icono-192.png", "favicon-32.png", "apple-touch-icon.png",
  "fotos/cancun.jpg", "fotos/chichen.jpg", "fotos/rio-secreto.jpg", "fotos/tulum.jpg", "fotos/mapa-fondo.jpg", "fotos/comer-tipico.png", "fotos/comer-mar.png", "fotos/comer-noche.png", "fotos/secretos/suytun.jpg", "fotos/secretos/ekbalam.jpg", "fotos/secretos/cenotes.jpg", "fotos/secretos/esmeralda.jpg", "fotos/secretos/meco.jpg", "fotos/secretos/tortugas.jpg", "fotos/secretos/calavera.jpg", "fotos/secretos/mercado23.jpg", "fotos/tiempo/sol.png", "fotos/tiempo/solnube.png", "fotos/tiempo/nubes.png", "fotos/tiempo/lluvia.png", "fotos/tiempo/tormenta.png", "fotos/tiempo/ropa-ligera.png", "fotos/tiempo/bloqueador.png", "fotos/tiempo/bano.png", "fotos/tiempo/zapatillas.png", "fotos/tiempo/repelente.png", "fotos/tiempo/impermeable.png", "fotos/dias/hotel.jpg", "fotos/dias/delfines.jpg", "fotos/dias/isla.jpg", "fotos/dias/noche.jpg"];
/* cada archivo por separado: si falta uno, el resto se guarda igual */
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.allSettled(FILES.map(f => c.add(f)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("c26-") && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const font = /fonts\.(googleapis|gstatic)\.com/.test(r.url);
  if (new URL(r.url).origin !== location.origin && !font) return;
  /* página: primero la red (para recibir cambios), si no hay conexión, la copia guardada */
  if (r.mode === "navigate") { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("index.html")))); return; }
  /* fotos, iconos y letras: primero la copia guardada */
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; })));
});
