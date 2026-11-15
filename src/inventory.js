export function createInventory(initialItems = []) {
  const items = new Map();

  for (const item of initialItems) {
    validateItem(item);
    if (items.has(item.sku)) throw new Error(`Duplicate SKU: ${item.sku}`);
    items.set(item.sku, { ...item });
  }

  function addItem(item) {
    validateItem(item);
    if (items.has(item.sku)) throw new Error(`SKU already exists: ${item.sku}`);
    items.set(item.sku, { ...item });
    return { ...items.get(item.sku) };
  }

  function removeItem(sku) {
    const item = items.get(sku);
    if (!item) return undefined;
    items.delete(sku);
    return { ...item };
  }

  function updateQuantity(sku, quantity) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new TypeError('Quantity must be a non-negative integer');
    }
    const item = items.get(sku);
    if (!item) return undefined;
    item.quantity = quantity;
    return { ...item };
  }

  function findBySku(sku) {
    const item = items.get(sku);
    return item ? { ...item } : undefined;
  }

  function lowStock(threshold) {
    if (!Number.isInteger(threshold) || threshold < 0) {
      throw new TypeError('Threshold must be a non-negative integer');
    }
    return [...items.values()]
      .filter((item) => item.quantity <= threshold)
      .map((item) => ({ ...item }));
  }

  function inventoryValue() {
    return [...items.values()].reduce((total, item) => total + item.price * item.quantity, 0);
  }

  return { addItem, removeItem, updateQuantity, findBySku, lowStock, inventoryValue };
}

function validateItem(item) {
  if (!item || typeof item.sku !== 'string' || item.sku.trim() === '') {
    throw new TypeError('SKU must be a non-empty string');
  }
  if (typeof item.name !== 'string' || item.name.trim() === '') {
    throw new TypeError('Name must be a non-empty string');
  }
  if (!Number.isInteger(item.quantity) || item.quantity < 0) {
    throw new TypeError('Quantity must be a non-negative integer');
  }
  if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
    throw new TypeError('Price must be a non-negative finite number');
  }
}
