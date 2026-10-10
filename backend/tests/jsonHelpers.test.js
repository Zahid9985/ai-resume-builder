const test = require('node:test');
const assert = require('node:assert/strict');
const { extractJson } = require('../src/ai/jsonHelpers');

test('extractJson parses fenced JSON', () => {
  const parsed = extractJson('```json\n{"matchScore":88}\n```');
  assert.equal(parsed.matchScore, 88);
});

test('extractJson throws for non-json responses', () => {
  assert.throws(() => extractJson('not json'), /valid JSON/);
});
