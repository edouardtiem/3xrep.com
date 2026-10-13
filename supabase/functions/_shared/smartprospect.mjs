// SmartProspect uses a different host from campaign management.
export function createSmartprospect(key, fetcher = fetch) {
  if (!key) throw new Error('SMARTLEAD_API_KEY missing');
  async function request(path, body, params = {}) {
    const url = new URL(`https://prospect-api.smartlead.ai/api/v1/search-email-leads/${path}`);
    url.searchParams.set('api_key', key);
    for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
    const response = await fetcher(url, {method: body ? 'POST' : 'GET',signal:AbortSignal.timeout(30000),
      ...(body ? {headers:{'Content-Type':'application/json'},body:JSON.stringify(body)} : {})});
    if (!response.ok) {const e=new Error('SmartProspect request failed');e.safeCode=`SMARTPROSPECT_HTTP_${response.status}`;throw e;}
    const result = await response.json();
    if (result.success !== true) {const e=new Error('SmartProspect declined request');e.safeCode='SMARTPROSPECT_DECLINED';throw e;}
    return result.data;
  }
  return {get:(path,params)=>request(path,null,params),post:(path,body)=>request(path,body)};
}
