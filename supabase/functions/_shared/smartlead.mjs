export function createSmartlead(key, fetcher = fetch) {
  if (!key) throw new Error('SMARTLEAD_API_KEY missing');
  async function request(path, params = {}, body, method = 'GET') {
    const url = new URL(`https://server.smartlead.ai/api/v1/${path}`);
    url.searchParams.set('api_key', key);
    for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = undefined;
      try {
        response = await fetcher(url, {
          method, signal: AbortSignal.timeout(15000),
          ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
        });
      } catch (error) {
        if (method !== 'GET' || attempt === 2) throw error;
      }
      if (response && (method !== 'GET' || ![429, 500, 502, 503, 504].includes(response.status) || attempt === 2)) break;
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
    // Provider bodies and URLs can contain credentials or message content.
    if (!response.ok) {
      const error = new Error(`Smartlead HTTP ${response.status} (${path.replace(/\d+/g, ':id')})`);
      error.safeCode = `SMARTLEAD_HTTP_${response.status}`;
      throw error;
    }
    return response.json();
  }
  return {
    get: (path, params) => request(path, params),
    post: (path, body) => request(path, {}, body, 'POST'),
    remove: (path, body) => request(path, {}, body, 'DELETE'),
  };
}
