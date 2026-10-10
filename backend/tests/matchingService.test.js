const test = require('node:test');
const assert = require('node:assert/strict');
const { estimateMatchScore, extractKeywords } = require('../src/services/matchingService');

test('extractKeywords ranks meaningful repeated terms', () => {
  const keywords = extractKeywords('React Node React MongoDB APIs and team collaboration', 3);
  assert.deepEqual(keywords, ['react', 'apis', 'collaboration']);
});

test('estimateMatchScore returns matched and missing keywords', () => {
  const result = estimateMatchScore(
    'Built React and Node applications with MongoDB.',
    'React Node MongoDB AWS Docker'
  );

  assert.equal(result.score, 60);
  assert.deepEqual([...result.matched].sort(), ['mongodb', 'node', 'react']);
  assert.deepEqual([...result.missing].sort(), ['aws', 'docker']);
});
