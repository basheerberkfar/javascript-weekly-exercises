// 1. Destructuring
export function getUserSummary(user) {
  const {
    id,
    profile: { name, city },
    roles: [primaryRole, secondaryRole]
  } = user;

  return { id, name, city, primaryRole, secondaryRole };
}

// 2. Merge tags, remove duplicates, and sort alphabetically.
export function getUniqueSortedTags(articles) {
  return [...new Set(articles.flatMap(({ tags = [] }) => tags))].sort((a, b) =>
    a.localeCompare(b)
  );
}

// 3. Index products by SKU. Map preserves the product objects and gives direct lookup.
export function indexProductsBySku(products) {
  return new Map(products.map((product) => [product.sku, product]));
}

export function findProductBySku(productIndex, sku) {
  return productIndex.get(sku);
}

// 5. Notification class hierarchy.
export class Notification {
  constructor(recipient, message) {
    this.recipient = recipient;
    this.message = message;
  }

  send() {
    throw new Error('Subclasses must implement send()');
  }
}

export class EmailNotification extends Notification {
  send() {
    return `Email to ${this.recipient}: ${this.message}`;
  }
}

export class SmsNotification extends Notification {
  send() {
    return `SMS to ${this.recipient}: ${this.message}`;
  }
}

// 6. Promise that resolves with value after delay milliseconds.
export function delayResult(value, delay) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

// 7. Wait for every operation and return successes and failures separately.
export async function collectSettledResults(promises) {
  const results = await Promise.allSettled(promises);
  return {
    successes: results.filter((result) => result.status === 'fulfilled').map((result) => result.value),
    failures: results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason)
  };
}

// 8. The returned order is deterministic: sync lines, Promise microtask, timer task.
export function runEventLoopExample(log = console.log) {
  log('start');
  setTimeout(() => log('timeout'), 0);
  Promise.resolve().then(() => log('promise'));
  log('end');
}
