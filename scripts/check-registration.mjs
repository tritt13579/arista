import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

let calls = [];
let fail = false;
const code = fs.readFileSync('src/wix/backend/trial-registration.web.js', 'utf8')
  .replace(/^import .*;$/gm, '')
  .replace('export const submitTrialRegistration =', 'globalThis.submitTrialRegistration =');
const context = {
  Permissions: {Anyone:'Anyone'},
  webMethod(permission, handler) { assert.equal(permission, 'Anyone'); return handler; },
  elevate: method => method,
  submissions: {async createSubmission(payload) {calls.push(payload); if (fail) throw new Error('network'); return {submission:{_id:'test'}};}},
};
vm.runInNewContext(code, context);
const submit = context.submitTrialRegistration;
const valid = {full_name:' Test User ', phone:'093.567.2244', student_type:'Người lớn', program:'Piano', message:' Test ', website:''};
for (const values of [null, [], {...valid,full_name:''}, {...valid,phone:'abc'}, {...valid,program:'Unknown'}, {...valid,student_type:'Unknown'}, {...valid,message:'a'.repeat(2001)}, {...valid,website:'bot'}]) {
  assert.equal((await submit(values)).ok, false);
}
assert.equal(calls.length, 0, 'Invalid submissions must never reach Wix');
assert.equal((await submit({...valid,formId:'attacker',status:'CONFIRMED'})).ok, true);
assert.deepEqual(JSON.parse(JSON.stringify(calls[0])), {formId:'1a3ca13f-0752-41c7-94ab-776889eec506',submissions:{full_name:'Test User',phone:'+84935672244',student_type:'Người lớn',program:'Piano',message:'Test'}});
assert.equal((await submit(valid)).ok, false, 'Duplicate phone blocked in cooldown');
fail = true;
assert.equal((await submit({...valid,phone:'0912345678'})).ok, false);
assert.equal((await submit({...valid,phone:'0912345678'})).ok, false, 'Uncertain outcome must keep cooldown');
assert.equal(calls.length, 2);
fail = false;
assert.equal((await submit({full_name:'Test',phone:'+12025550123'})).ok, true, 'Optional choices can be omitted');
console.log('PASS: registration validation, normalization, field allowlist, fixed form ID, duplicate guard and API failure.');
