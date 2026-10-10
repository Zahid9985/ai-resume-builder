import { describe, expect, it } from 'vitest';
import { addArrayItem, removeArrayItem, updateAtPath } from './resumeMutators';

describe('resume mutators', () => {
  it('updates nested values immutably', () => {
    const source = { contact: { name: 'Old' } };
    const next = updateAtPath(source, ['contact', 'name'], 'New');
    expect(next.contact.name).toBe('New');
    expect(source.contact.name).toBe('Old');
  });

  it('adds and removes array items', () => {
    const source = { skills: [] };
    const added = addArrayItem(source, ['skills'], { category: 'Frontend' });
    const removed = removeArrayItem(added, ['skills'], 0);
    expect(added.skills).toHaveLength(1);
    expect(removed.skills).toHaveLength(0);
  });
});
