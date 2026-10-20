import assert from 'node:assert/strict';
import { checkReadiness, draftChannelCopy, extractTasks, generateOwnerChecklist } from '../src/tools/launchTools';

const input = {
  productBrief:
    'Launch an enterprise admin workflow that lets platform teams review, approve, and audit AI-generated knowledge base updates before publication.',
  audience: 'Enterprise admins, platform engineering managers, support operations leads',
  launchDate: '2026-10-15',
  constraints: 'Security review required, customer beta feedback pending, docs freeze one week before launch.',
  assets: 'Beta notes, customer quotes, product screenshots, demo video, support FAQ draft.',
};

const tasks = extractTasks(input);
assert.ok(tasks.length >= 5, 'extractTasks should return a useful task list');
assert.equal(tasks[0].priority, 'P0', 'highest priority tasks should come first');

const readiness = checkReadiness(input);
assert.equal(readiness.length, 5, 'readiness rubric should cover five areas');
assert.ok(readiness.every((item) => item.score >= 1 && item.score <= 4), 'readiness scores should stay in rubric range');

const checklist = generateOwnerChecklist(input);
assert.ok(checklist.some((item) => item.owner === 'Engineering'), 'owner checklist should include Engineering');
assert.ok(checklist.every((item) => item.due.includes('2026') || item.due.startsWith('T-')), 'checklist should include due dates');

const copy = draftChannelCopy({ ...input, channels: ['Email', 'In-app', 'Social', 'Support macro'] });
assert.equal(copy.length, 4, 'copy tool should return one draft per requested channel');
assert.ok(copy.every((item) => item.headline && item.body && item.cta), 'copy drafts should include headline, body, and CTA');

console.log('Launch Desk tool tests passed');
