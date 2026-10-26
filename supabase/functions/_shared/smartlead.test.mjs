import test from 'node:test';
import assert from 'node:assert/strict';
import {createSmartlead} from './smartlead.mjs';

test('a temporary read failure is retried and recovered', async () => {
  let calls=0;
  const client=createSmartlead('secret',async()=>{calls++;return calls===1?new Response('',{status:502}):Response.json({ok:true});});
  assert.deepEqual(await client.get('campaigns/1'),{ok:true});
  assert.equal(calls,2);
});

test('writes are never retried after an uncertain provider error', async () => {
  let calls=0;
  const client=createSmartlead('secret',async()=>{calls++;return new Response('',{status:502});});
  await assert.rejects(client.post('campaigns/1/leads',{leads:[]}),{safeCode:'SMARTLEAD_HTTP_502'});
  assert.equal(calls,1);
});

test('permanent read errors fail without retry', async () => {
  let calls=0;
  const client=createSmartlead('secret',async()=>{calls++;return new Response('',{status:401});});
  await assert.rejects(client.get('campaigns/1'),{safeCode:'SMARTLEAD_HTTP_401'});
  assert.equal(calls,1);
});
