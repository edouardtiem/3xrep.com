export function normalizeVerification(attempt) {
  const b=attempt.body;
  if(attempt.http!==200||!b||typeof b!=='object')return {status:'error',providerStatus:`http_${attempt.http}`};
  if(attempt.provider==='trykitt.people.email.verify'){
    const raw=b.validity;
    return {status:raw==='valid'&&b.validSMTP===true&&b.validIdentity===true?'valid':
      raw==='invalid'?'invalid':['catch_all','accept_all'].includes(raw)?'accept_all':'unknown',providerStatus:raw||'unknown'};
  }
  if(attempt.provider==='millionverifier.people.email.verify'){
    const raw=b.result;
    return {status:raw==='ok'&&b.quality==='good'&&b.role!==true?'valid':
      ['invalid','disposable'].includes(raw)?'invalid':raw==='catch_all'?'accept_all':'unknown',providerStatus:raw||'unknown'};
  }
  if(attempt.provider==='contactout.people.email.verify'){
    const raw=b.data?.status;return {status:raw==='valid'?'valid':raw==='invalid'?'invalid':raw==='accept_all'?'accept_all':'unknown',providerStatus:raw||'unknown'};
  }
  throw new Error('Unsupported verification provider');
}
export function effectiveEvidence(attempts) {
  const completed=attempts.filter(a=>a.http===200);
  if(!completed.length)return {status:'error',providerStatus:'provider_unavailable'};
  // A definitive negative result is not replaced by an optimistic provider.
  const negative=completed.find(a=>normalizeVerification(a).status==='invalid');
  const selected=negative||completed.findLast(a=>normalizeVerification(a).status==='valid')||completed.at(-1);
  return {...normalizeVerification(selected),provider:selected.provider,callId:selected.callId,checkedAt:selected.checkedAt,
    costMicro:attempts.reduce((n,a)=>n+a.costMicro,0)};
}
