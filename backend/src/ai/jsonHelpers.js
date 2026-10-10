const { AppError } = require('../utils/AppError');

function extractJson(text) {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');

  if (first === -1 || last === -1 || last <= first) {
    throw new AppError('AI response did not contain valid JSON.', 502);
  }

  try {
    return JSON.parse(candidate.slice(first, last + 1));
  } catch (error) {
    throw new AppError('AI response JSON could not be parsed.', 502);
  }
}

module.exports = { extractJson };
