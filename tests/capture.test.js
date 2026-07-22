import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCoreStore,
  findBestItem,
  isDueToday,
  parseCaptureIntent,
  parseCoreQuery,
  queryCoreItems
} from '../src/features/capture/capture.js';

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

const localDate = (year, month, day, hour = 10) => new Date(year, month - 1, day, hour, 0, 0, 0);

test('parses a dated project reminder', () => {
  const now = localDate(2026, 7, 22);
  const draft = parseCaptureIntent('Remind me Friday at 7 AM to review the strawberry order for PDP', now, 'voice');
  assert.equal(draft.type, 'reminder');
  assert.equal(draft.title, 'review the strawberry order');
  assert.equal(draft.project, 'PDP');
  assert.equal(draft.source, 'voice');
  const due = new Date(draft.dueAt);
  assert.equal(due.getDay(), 5);
  assert.equal(due.getHours(), 7);
});

test('parses a project idea as a note', () => {
  const draft = parseCaptureIntent('Save this idea under Clip Forge: automate title variants', localDate(2026, 7, 22));
  assert.equal(draft.type, 'note');
  assert.equal(draft.project, 'Clip Forge');
  assert.equal(draft.title, 'automate title variants');
  assert.equal(draft.dueAt, null);
});

test('persists updates and restores deleted items', () => {
  const storage = new MemoryStorage();
  const now = () => localDate(2026, 7, 22);
  const store = createCoreStore({ storage, now });
  const item = store.add({ type: 'task', title: 'Check inventory' });
  store.update(item.id, { status: 'done', completedAt: now().toISOString() });
  const removed = store.remove(item.id);
  assert.equal(store.list().length, 0);
  store.restore(removed);
  const reloaded = createCoreStore({ storage, now });
  assert.equal(reloaded.list()[0].status, 'done');
  assert.equal(reloaded.list()[0].title, 'Check inventory');
});

test('recognizes today and project recall queries without treating all uses of today as core queries', () => {
  assert.deepEqual(parseCoreQuery('What do I need to do today?'), { kind: 'query', view: 'today' });
  assert.equal(parseCoreQuery('Tell me something interesting today'), null);
  assert.deepEqual(parseCoreQuery('Show my PDP reminders'), {
    kind: 'query', view: 'search', term: '', project: 'PDP', type: 'reminder'
  });
});

test('filters overdue and today items for the Today view', () => {
  const now = localDate(2026, 7, 22, 12);
  const items = [
    { id: '1', status: 'open', dueAt: localDate(2026, 7, 22, 17).toISOString() },
    { id: '2', status: 'open', dueAt: localDate(2026, 7, 21, 9).toISOString() },
    { id: '3', status: 'open', dueAt: localDate(2026, 7, 23, 9).toISOString() },
    { id: '4', status: 'done', dueAt: localDate(2026, 7, 22, 8).toISOString() }
  ];
  assert.equal(items.filter((item) => isDueToday(item, now)).length, 2);
  assert.equal(queryCoreItems(items, { view: 'today' }, now).length, 2);
});

test('finds the best matching item for completion commands', () => {
  const items = [
    { id: '1', title: 'Review strawberry order', details: '', project: 'PDP', rawText: '' },
    { id: '2', title: 'Call the warehouse', details: '', project: '', rawText: '' }
  ];
  assert.equal(findBestItem(items, 'strawberry review').id, '1');
});
