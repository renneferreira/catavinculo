// CataVínculo - Service Worker para PWA Offline-First
const CACHE_NAME = 'catavinculo-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Instalação: Cache dos assets essenciais do App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpeza de caches obsoletos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Fetch:
// - Requisições para APIs da Receita e DataJud: Network-first
// - Assets estáticos (JS, CSS, Imagens, Fontes): Cache-first / Stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Evitar interceptação de requisições que não sejam GET
  if (event.request.method !== 'GET') return;

  // APIs públicas de dados cadastrais e jurídicos
  const isApiRequest = 
    url.hostname.includes('brasilapi.com.br') || 
    url.hostname.includes('minhareceita.org') || 
    url.hostname.includes('datajud.cnj.jus.br') || 
    url.hostname.includes('dns.google') || 
    url.hostname.includes('crt.sh');

  if (isApiRequest) {
    // Network-first com fallback para não quebrar em perda temporária de sinal
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets da aplicação: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback para página principal caso offline e navegação
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
