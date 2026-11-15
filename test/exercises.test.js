import test from 'node:test';
import assert from 'node:assert/strict';
import {
  collectSettledResults,
  delayResult,
  EmailNotification,
  findProductBySku,
  getUniqueSortedTags,
  getUserSummary,
  indexProductsBySku,
  Notification,
  runEventLoopExample,
  SmsNotification
} from '../src/exercises.js';
import { createInventory } from '../src/inventory.js';

test('1. destructures nested user data once', () => {
  const user = {
    id: 10,
    profile: { name: 'Lina', city: 'Amman' },
    roles: ['editor', 'reviewer']
  };
  assert.deepEqual(getUserSummary(user), {
    id: 10, name: 'Lina', city: 'Amman', primaryRole: 'editor', secondaryRole: 'reviewer'
  });
});

test('2. combines tags, removes duplicates, and sorts them', () => {
  const articles = [
    { tags: ['javascript', 'testing'] },
    { tags: ['testing', 'node'] },
    { tags: ['async'] }
  ];
  assert.deepEqual(getUniqueSortedTags(articles), ['async', 'javascript', 'node', 'testing']);
});

test('3. indexes products by SKU for direct lookup', () => {
  const products = [{ sku: 'A1', name: 'Keyboard' }, { sku: 'B2', name: 'Mouse' }];
  const index = indexProductsBySku(products);
  assert.equal(index.size, 2);
  assert.equal(findProductBySku(index, 'B2').name, 'Mouse');
  assert.equal(findProductBySku(index, 'missing'), undefined);
});

test('4. inventory supports add, remove, update, lookup, low stock, and valuation', () => {
  const inventory = createInventory([
    { sku: 'A1', name: 'Keyboard', quantity: 4, price: 20 },
    { sku: 'B2', name: 'Mouse', quantity: 1, price: 10 }
  ]);
  assert.deepEqual(inventory.findBySku('A1'), { sku: 'A1', name: 'Keyboard', quantity: 4, price: 20 });
  assert.deepEqual(inventory.lowStock(1).map((item) => item.sku), ['B2']);
  assert.equal(inventory.inventoryValue(), 90);
  inventory.updateQuantity('A1', 2);
  assert.equal(inventory.inventoryValue(), 50);
  assert.equal(inventory.addItem({ sku: 'C3', name: 'Cable', quantity: 3, price: 5 }).sku, 'C3');
  assert.equal(inventory.removeItem('B2').name, 'Mouse');
  assert.equal(inventory.findBySku('B2'), undefined);
  assert.throws(() => inventory.addItem({ sku: 'A1', name: 'Duplicate', quantity: 1, price: 1 }), /already exists/);
  assert.throws(() => inventory.updateQuantity('A1', -1), /non-negative integer/);
});

test('5. notification subclasses share the send interface', () => {
  const notifications = [new EmailNotification('lina@example.com', 'Hello'), new SmsNotification('+962700000000', 'Hello')];
  assert.deepEqual(notifications.map((notification) => notification.send()), [
    'Email to lina@example.com: Hello', 'SMS to +962700000000: Hello'
  ]);
  assert.throws(() => new Notification('x', 'y').send(), /must implement/);
});

test('6. delayResult resolves with its value', async () => {
  assert.equal(await delayResult('done', 5), 'done');
});

test('7. collects four successes and one failure without rejecting', async () => {
  const outcomes = await collectSettledResults([
    Promise.resolve('one'), Promise.resolve('two'), Promise.reject(new Error('failed')),
    Promise.resolve('four'), Promise.resolve('five')
  ]);
  assert.deepEqual(outcomes.successes, ['one', 'two', 'four', 'five']);
  assert.equal(outcomes.failures.length, 1);
  assert.equal(outcomes.failures[0].message, 'failed');
});

test('8. event loop logs synchronous work, promise, then timer', async () => {
  const lines = [];
  runEventLoopExample((line) => lines.push(line));
  assert.deepEqual(lines, ['start', 'end']);
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.deepEqual(lines, ['start', 'end', 'promise', 'timeout']);
});
