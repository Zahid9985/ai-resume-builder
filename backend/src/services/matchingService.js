const STOPWORDS = new Set([
  'and', 'the', 'with', 'for', 'you', 'are', 'will', 'our', 'that', 'this', 'from',
  'have', 'has', 'into', 'using', 'work', 'team', 'role', 'job', 'your', 'their',
  'experience', 'years', 'skills', 'required', 'preferred', 'ability'
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .match(/[a-z][a-z0-9+#.\-]{1,}/g)
    ?.map((token) => token.replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, ''))
    .filter((token) => !STOPWORDS.has(token) && token.length > 2) || [];
}

function extractKeywords(text, limit = 40) {
  const counts = new Map();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([keyword]) => keyword);
}

function estimateMatchScore(resumeText, jobDescription) {
  const jobKeywords = extractKeywords(jobDescription, 50);
  const resumeTokens = new Set(tokenize(resumeText));
  if (!jobKeywords.length) return { score: 0, matched: [], missing: [] };

  const matched = jobKeywords.filter((keyword) => resumeTokens.has(keyword));
  const missing = jobKeywords.filter((keyword) => !resumeTokens.has(keyword));
  const coverage = matched.length / jobKeywords.length;
  const score = Math.round(Math.max(0, Math.min(100, coverage * 100)));

  return { score, matched, missing };
}

module.exports = { tokenize, extractKeywords, estimateMatchScore };
