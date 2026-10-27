// Service worker v2: Lấy trực tiếp dữ liệu từ Tenor.com & API thật của Tenor (Hàng triệu GIF!)
const TENOR = 'https://tenor.com';
const TENOR_API = 'https://tenor.googleapis.com/v2';
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_RESULTS = 50;
const cache = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || typeof msg !== 'object') return false;
  if (msg.type === 'search-gif') {
    handleGifQuery(msg.query || '').then(
      (gifs) => sendResponse({ ok: true, gifs }),
      (err) => sendResponse({ ok: false, error: String(err.message || err), gifs: [] })
    );
    return true;
  }
});

async function cached(url, loader) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) return hit.value;
  const value = await loader();
  cache.set(url, { time: Date.now(), value });
  if (cache.size > 50) cache.delete(cache.keys().next().value);
  return value;
}

function readKeys(html) {
  const m = html.match(/<script id="data" type="text\/x-cache"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    const data = JSON.parse(atob(m[1].trim()));
    if (typeof data.API_V2_KEY === 'string' && typeof data.API_V2_CLIENT_KEY === 'string') {
      return { key: data.API_V2_KEY, client_key: data.API_V2_CLIENT_KEY };
    }
  } catch (e) {}
  return null;
}

async function fetchTenorPage(url) {
  return cached(url, async () => {
    const res = await fetch(url, { credentials: 'omit', redirect: 'follow' });
    if (!res.ok) throw new Error(`Tenor HTTP ${res.status}`);
    const html = await res.text();
    const m = html.match(/<script id="store-cache" type="text\/x-cache"[^>]*>([\s\S]*?)<\/script>/);
    const keys = readKeys(html);
    if (keys) {
      try { await chrome.storage.local.set({ tenorKeys: keys }); } catch (e) {}
    }
    const store = m ? JSON.parse(m[1]) : {};
    return { store, keys };
  });
}

async function getKeys() {
  try {
    const { tenorKeys } = await chrome.storage.local.get('tenorKeys');
    if (tenorKeys && tenorKeys.key && tenorKeys.client_key) return tenorKeys;
  } catch (e) {}
  const { keys } = await fetchTenorPage(`${TENOR}/`);
  return keys;
}

async function callTenorApi(path, params) {
  let keys = await getKeys();
  if (!keys) throw new Error('No Tenor API key');
  const q = new URLSearchParams({
    ...keys,
    media_filter: 'tinygif,gif',
    limit: String(MAX_RESULTS),
    ...params
  });
  const url = `${TENOR_API}${path}?${q}`;
  return cached(url, async () => {
    const res = await fetch(url, { credentials: 'omit' });
    if (!res.ok) {
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        await chrome.storage.local.remove('tenorKeys');
      }
      throw new Error(`API HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.results || [];
  });
}

function formatGifs(results) {
  if (!Array.isArray(results)) return [];
  return results.map(r => {
    if (!r || !r.media_formats) return null;
    const tiny = r.media_formats.tinygif || r.media_formats.gif;
    const full = r.media_formats.gif || r.media_formats.tinygif;
    if (!tiny || !tiny.url) return null;
    return {
      id: String(r.id || ''),
      title: String(r.content_description || r.h1_title || r.title || 'GIF').slice(0, 120),
      preview: tiny.url,
      url: full ? full.url : tiny.url
    };
  }).filter(Boolean);
}

async function handleGifQuery(rawQuery) {
  const q = rawQuery.trim();
  if (!q) {
    // Featured
    try {
      const res = await callTenorApi('/featured', {});
      const formatted = formatGifs(res);
      if (formatted.length) return formatted;
    } catch (e) {}
    const { store } = await fetchTenorPage(`${TENOR}/`);
    return formatGifs(store?.gifs?.featured?.results || []);
  } else {
    // Search
    try {
      const res = await callTenorApi('/search', { q });
      const formatted = formatGifs(res);
      if (formatted.length) return formatted;
    } catch (e) {}
    const slug = q.toLowerCase().split(/\s+/).filter(Boolean).map(encodeURIComponent).join('-');
    const { store } = await fetchTenorPage(`${TENOR}/search/${slug}-gifs`);
    const searches = Object.values(store?.universal?.search || {});
    return formatGifs(searches[0]?.results || []);
  }
}


// Fallback loader if page CSP blocks direct img src
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'fetch-gif-blob' && msg.url) {
    fetch(msg.url, { credentials: 'omit' })
      .then(r => r.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => sendResponse({ ok: true, dataUrl: reader.result });
        reader.readAsDataURL(blob);
      })
      .catch(err => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
});
