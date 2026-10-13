import {normalizeVerification} from './verification-evidence.mjs';
const FREE='contactout.people.email.verify';
const KITT='trykitt.people.email.verify';
export function verificationVerdict(body) {
 const raw=typeof body?.data?.status==='string'?body.data.status.toLowerCase():null;
 return {providerStatus:raw,status:raw==='valid'?'valid':raw==='invalid'?'invalid':['accept_all','catch_all'].includes(raw)?'accept_all':'unknown'};
}
export function createEmailVerifier(token,fetcher=fetch,{endpointId=FREE,maxCostMicro=0}={}){
 if(!token)throw new Error('TREG_TOKEN missing');
 if(![FREE,KITT].includes(endpointId)||!Number.isInteger(maxCostMicro)||maxCostMicro<0||maxCostMicro>1500||endpointId===FREE&&maxCostMicro!==0)throw new Error('Unsupported verification policy');
 let checked=false;
 async function confirmAllowedPrice(){
  const response=await fetcher(`https://treg.to/catalog/endpoints/${endpointId}`,{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('Verifier catalogue unavailable');
  const d=await response.json(),usd=d.endpoint?.cost?.usd;
  const cost=typeof usd==='number'?Math.round(usd*1e6):NaN;
  if(!Number.isFinite(cost)||cost>maxCostMicro||(maxCostMicro===0&&d.endpoint?.cost?.type!=='free')||
    d.overflow_price_usd!=null&&Math.round(d.overflow_price_usd*1e6)>maxCostMicro){
   const e=new Error('Allowed verification rate is unavailable');e.safeCode=maxCostMicro===0?'VERIFIER_NO_LONGER_FREE':'VERIFIER_PRICE_LIMIT';throw e;
  }
  checked=true;
 }
 async function verify(email,requestId){
  if(!checked)await confirmAllowedPrice();
  const url=new URL(`https://treg.to/call/${endpointId}`);
  const post=endpointId===KITT;if(!post)url.searchParams.set('email',email);
  const response=await fetcher(url,{method:post?'POST':'GET',headers:{'X-Treg-Token':token,'Idempotency-Key':requestId,
    'Cache-Control':'no-cache',...(post?{'Content-Type':'application/json'}:{})},
    ...(post?{body:JSON.stringify({email,realtime:true})}:{}),signal:AbortSignal.timeout(20000)});
  if(!response.ok){const e=new Error('Verification request failed');e.safeCode=`TREG_HTTP_${response.status}`;throw e;}
  const body=await response.json();
  if(!post&&body.status_code!==200||post&&body.email?.toLowerCase()!==email.toLowerCase()){const e=new Error('Verifier response not successful');e.safeCode='VERIFIER_RESPONSE_INVALID';throw e;}
  const charge=response.headers.get('X-Treg-Cost-Micro'),costMicro=charge==null?NaN:Number(charge);
  if(!Number.isFinite(costMicro)||costMicro<0||costMicro>maxCostMicro)throw new Error('Unexpected verification charge');
  const verdict=post?normalizeVerification({provider:endpointId,http:200,body}):verificationVerdict(body);
  return {...verdict,provider:endpointId,callId:response.headers.get('X-Treg-Call-Id'),costMicro};
 }
 return {confirmAllowedPrice,confirmFree:confirmAllowedPrice,verify};
}
