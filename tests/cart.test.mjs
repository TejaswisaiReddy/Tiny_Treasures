import assert from "node:assert/strict";
import test from "node:test";
import { cartReducer, createDemoCart, getCartTotals, formatCartPrice, MAX_DEMO_QUANTITY } from "../src/lib/cart.ts";
import { allProducts } from "../src/lib/products.ts";

test("the initial cart matches the Figma selection and total", () => {
  const items = createDemoCart().map(({ productId, quantity }) => {
    const product = allProducts.find(item => item.id === productId);
    assert.ok(product, `Missing demo product: ${productId}`);
    return { price: product.price, quantity };
  });
  assert.deepEqual(getCartTotals(items), {
    itemCount: 3, subtotal: 4950, serviceFee: 245, shipping: 490, total: 5685,
  });
});

test("cart totals use current prices and charge example fees once", () => {
  assert.deepEqual(getCartTotals([{ price: 5, quantity: 1 }, { price: 22.5, quantity: 1 }, { price: 12, quantity: 1 }]), {
    itemCount: 3, subtotal: 3950, serviceFee: 245, shipping: 490, total: 4685,
  });
  assert.equal(getCartTotals([{ price: 22.5, quantity: 2 }]).total, 5235);
  assert.equal(getCartTotals([{ price: 0.1, quantity: 3 }, { price: 0.2, quantity: 1 }]).subtotal, 50);
  assert.equal(formatCartPrice(4685), "€ 46.85");
});

test("removing every item leaves no fees and a zero total", () => {
  let cart = createDemoCart();
  for (const item of cart) cart = cartReducer(cart, { type: "remove", productId: item.productId });
  assert.deepEqual(cart, []);
  assert.deepEqual(getCartTotals([]), { itemCount: 0, subtotal: 0, serviceFee: 0, shipping: 0, total: 0 });
});

test("quantity changes affect only the selected item and reject invalid values", () => {
  const original = createDemoCart();
  const changed = cartReducer(original, { type: "quantity", productId: "yellow-raincoat", quantity: 2 });
  assert.deepEqual(changed.map(item => item.quantity), [1, 2, 1]);
  assert.equal(original[1].quantity, 1);
  for (const quantity of [0, -1, 1.5, NaN, Infinity, MAX_DEMO_QUANTITY + 1]) {
    assert.deepEqual(cartReducer(changed, { type: "quantity", productId: "yellow-raincoat", quantity }), changed);
  }
});

test("adding an item twice preserves its existing quantity", () => {
  let cart = cartReducer([], { type: "add", productId: "hm-jumpsuit" });
  cart = cartReducer(cart, { type: "quantity", productId: "hm-jumpsuit", quantity: 2 });
  cart = cartReducer(cart, { type: "add", productId: "hm-jumpsuit" });
  assert.deepEqual(cart, [{ productId: "hm-jumpsuit", quantity: 2 }]);
});

test("pickup removes shipping without changing item costs or the service fee", () => {
  const items = [{ price: 15, quantity: 2 }, { price: 22.5, quantity: 1 }];
  const delivery = getCartTotals(items, "delivery");
  const pickup = getCartTotals(items, "pickup");
  assert.deepEqual(pickup, { itemCount: 3, subtotal: 5250, serviceFee: 245, shipping: 0, total: 5495 });
  assert.equal(delivery.total - pickup.total, 490);
  assert.deepEqual(getCartTotals(items), delivery);
  assert.deepEqual(getCartTotals([], "pickup"), { itemCount: 0, subtotal: 0, serviceFee: 0, shipping: 0, total: 0 });
});
