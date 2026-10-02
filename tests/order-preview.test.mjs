import assert from "node:assert/strict";
import test from "node:test";
import { createOrderPreview, getOrderSteps } from "../src/lib/order-preview.ts";
import { isValidPhoneNumber, sampleCheckoutContact } from "../src/lib/checkout-contact.ts";
import { allProducts } from "../src/lib/products.ts";
import { getCartTotals } from "../src/lib/cart.ts";

test("order previews preserve checkout data when the basket or contact changes later", () => {
  const product = { ...allProducts.find(product => product.id === "hm-jumpsuit") };
  const input = { items: [{ product, quantity: 2 }], delivery: "pickup", contact: { ...sampleCheckoutContact } };
  const order = createOrderPreview(input);
  assert.ok(order);
  input.items[0].quantity = 5;
  product.price = 100;
  input.contact.name = "Changed later";
  assert.equal(order.items[0].quantity, 2);
  assert.equal(order.items[0].product.price, 15);
  assert.equal(order.contact.name, sampleCheckoutContact.name);
  const totals = getCartTotals(order.items.map(({ product, quantity }) => ({ price: product.price, quantity })), order.delivery);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.total, 3245);
});

test("an empty cart cannot create an order preview", () => {
  assert.equal(createOrderPreview({ items: [], delivery: "delivery", contact: sampleCheckoutContact }), null);
});

test("pickup tracking has collection stages and no delivery or shipping stages", () => {
  const pickup = getOrderSteps("pickup");
  assert.equal(pickup.find(step => step.status === "current").title, "Ready for Pickup");
  assert.equal(pickup.some(step => /shipped|delivery/i.test(step.title)), false);
  const delivery = getOrderSteps("delivery");
  assert.equal(delivery.find(step => step.status === "current").title, "Out for Delivery");
  assert.equal(delivery.at(-1).status, "pending");
});

test("phone validation accepts common formatting and rejects letters or implausible lengths", () => {
  for (const phone of ["+358 45 455 2318", "045-455-2318", "(045) 455 2318", " 1234567 ", "+123456789012345"]) {
    assert.equal(isValidPhoneNumber(phone), true, phone);
  }
  for (const phone of ["", "abcdefghi", "call 0454552318", "+", "() ---", "123456", "1234567890123456", "++358454552318", "045+4552318"]) {
    assert.equal(isValidPhoneNumber(phone), false, phone);
  }
});
