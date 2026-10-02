# Understanding the Cart screen

Open http://localhost:3001/cart, or select the cart icon on Home.

## The files and their jobs

- `src/app/cart/page.tsx`: Next.js uses this folder to create the `/cart` address.
- `src/components/cart-screen.tsx`: assembles the header, item cards, summary, buttons and bottom navigation.
- `src/components/cart-item-card.tsx`: draws one product. We reuse it for every item instead of writing the same layout three times.
- `src/components/cart-order-summary.tsx`: displays the subtotal, fees and total. It is also reused inside the checkout preview.
- `src/components/cart-provider.tsx`: keeps the cart shared between Home, Item Details and Cart during your visit.
- `src/lib/cart.ts`: contains the rules for adding, removing and changing quantities, plus the price calculation.
- `src/lib/products.ts`: holds the sample product information used by all screens.

## What happens when you press +?

1. The item card calls `onQuantityChange` with the next quantity.
2. The cart provider sends a `quantity` action to `cartReducer`.
3. The reducer returns a new cart with that quantity updated. This is React **state**: information that can change while the app is open.
4. The provider recalculates the totals. React updates the item card, summary and Home cart badge.

**Props** are the information passed into a component, such as a product and its quantity. The provider gives multiple pages access to the same state.

The `"use client"` line marks components that need browser interactions, such as button clicks. Tailwind classes such as `rounded-xl`, `p-4` and `text-brand` control their appearance.

## Understanding the total

The sample cart uses the jumpsuit (€15), the raincoat (€22.50) and the blocks (€12). The subtotal is €49.50. Example fees of €2.45 and €4.90 bring the total to €56.85, matching the Figma cart.

Calculations use whole cents internally: €15 is 1,500 cents. This avoids decimal rounding errors. Fees are charged once per demo cart; an empty cart has no fees.

## What works now

Change quantities from 1 to 9, remove items, open item details, and add an item through **Buy now → Add to cart and review**. Adding an item already in the cart keeps its current quantity.

The cart survives page navigation. Refreshing restores the three sample items. **Proceed to Checkout** opens the `/checkout` Payment screen, where you can preview payment and delivery choices. Pickup removes the shipping estimate. No order is created and no payment is collected. Quantities and fees are examples, not real stock or checkout rules. See `docs/checkout-screen.md` for the new screen.

Later, a backend will provide real inventory, save each user's cart and calculate checkout fees on the server.

## Checking the calculations

Run `node --test tests/cart.test.mjs` to check totals, empty carts, quantity limits and duplicate additions. Run `npm.cmd run lint` for code checks and `npm.cmd run build` to check the production build.
