import test from'node:test';import assert from'node:assert/strict';import{effectiveEvidence,normalizeVerification}from'./verification-evidence.mjs';
const k={provider:'trykitt.people.email.verify',http:200,callId:'k',costMicro:1500,checkedAt:'2026-10-13T20:00:00Z',body:{validity:'valid',validSMTP:true,validIdentity:true}};
test('a failed fallback preserves the completed primary verdict without fabricating verification',()=>{
 const risky={...k,body:{validity:'valid-risky',validSMTP:null,validIdentity:true}};
 const fallback={provider:'millionverifier.people.email.verify',http:403,costMicro:0,callId:'m'};
 assert.equal(effectiveEvidence([risky,fallback]).status,'unknown');assert.equal(effectiveEvidence([risky,fallback]).costMicro,1500);
 assert.equal(effectiveEvidence([k,fallback]).status,'valid');
});
test('conflicting providers do not overturn a definite invalid result, and generic/role mailboxes stay out',()=>{
 const invalid={...k,body:{validity:'invalid',validSMTP:false,validIdentity:false}};
 assert.equal(effectiveEvidence([invalid,k]).status,'invalid');
 assert.equal(normalizeVerification({provider:'millionverifier.people.email.verify',http:200,body:{result:'ok',quality:'good',role:true}}).status,'unknown');
});
