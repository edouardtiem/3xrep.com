export function createSmartlead(key, fetcher = fetch) {
  if (!key) throw new Error('SMARTLEAD_API_KEY missing');
  async function request(path, params = {}, body, method = 'GET') {
    const url = new URL(`https://server.smartlead.ai/api/v1/${path}`);
    url.searchParams.set('api_key', key);
    for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
    const response = await fetcher(url, {
      method, signal: AbortSignal.timeout(15000),
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    // Provider bodies and URLs can contain credentials or message content.
    if (!response.ok) throw new Error(`Smartlead HTTP ${response.status} (${path.replace(/\d+/g, ':id')})`);
    return response.json();
  }
  return {
    get: (path, params) => request(path, params),
    post: (path, body) => request(path, {}, body, 'POST'),
    remove: (path, body) => request(path, {}, body, 'DELETE'),
  };
}
