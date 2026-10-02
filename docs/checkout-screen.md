# Payment screen

Open `/checkout`, or use **Proceed to Checkout** from `/cart`.

## How it works

- `src/app/checkout/page.tsx` adds the route and its page title.
- `src/components/checkout-screen.tsx` reads the shared cart and keeps the selected payment and delivery methods in React state.
- `src/components/checkout-payment-methods.tsx` renders accessible radio choices and the example card.
- `src/components/checkout-contact-dialog.tsx` lets you edit contact details for the preview. Closing without saving leaves the existing details unchanged.
- `src/components/checkout-icon.tsx` renders the downloaded Figma SVGs at their original dimensions.
- `CartOrderSummary` is reused with a white checkout appearance. `getCartTotals` is also shared; its optional delivery method removes shipping for pickup.

The first item is shown initially. **Show more items** expands the remaining cart items. Prices, condition and quantities come from the existing sample product data, rather than the old €7.00 example in Figma. The starting three-item cart totals €51.95 with pickup or €56.85 with delivery.

## Design consistency and corrections

The screen keeps the 412px maximum page width, purple `#941696`, Roboto text, Plus Jakarta Sans headings, rounded 12px cards and 16/24px spacing. It uses the Figma icons and product thumbnail, with a scrollable body above the fixed payment action.

Pickup no longer charges shipping or displays a delivery address. The green example card has darker text for readability, a visible Demo Card label, and an illustrative 05/29 expiry. Narrow screens wrap long item names and condition badges.

## Demo limits

Payment methods are interactive previews. **Preview payment** opens a summary; it does not charge, contact a provider, place an order or empty the cart. **View demo confirmation** copies the current basket, delivery choice and contact details into shared order-preview state, then opens `/order-confirmation`. Its tracking link opens `/order-tracking`. See `docs/order-screens.md` for the rest of the flow. The checkout contact editor checks basic phone formatting. Checkout inputs reset when leaving the page; the order preview lasts until refresh. No card-entry form, payment SDK, API, account or database is connected. Terms and buyer-protection buttons explain that those features are not active yet.

## Try it

1. Change a quantity in the cart, then proceed to checkout.
2. Expand the other items and confirm the quantities match.
3. Choose Pickup, then Delivery. All totals should change by €4.90.
4. Try each payment method using the mouse or keyboard arrow keys.
5. Change the contact details, save, and verify the card updates. Reopen, edit and close without saving to check cancellation.
6. Press Preview payment to see the demo summary, then View demo confirmation to see the new order screens.
7. Remove every cart item and open `/checkout`: the empty state appears and payment is disabled.
