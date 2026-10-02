# Order confirmation and tracking

Open `/order-confirmation` and choose **View Order Tracking**, or open `/order-tracking` directly.

To try the full flow: **Cart → Proceed to Checkout → Preview payment → View demo confirmation → View Order Tracking**.

## How the React pieces work

- The two `page.tsx` files inside `src/app/order-confirmation` and `src/app/order-tracking` create the URLs.
- `order-confirmation-screen.tsx` renders the green success message, order summary, item cards, and shopping/tracking links.
- `order-tracking-screen.tsx` renders the courier card, progress timeline, contact editor, shipment items, and shared bottom navigation.
- `order-shared.tsx` contains the header and item card used by both screens.
- `order-preview-provider.tsx` holds a shared copy of the order in React state. The root layout wraps the pages in this provider, so navigating between them keeps the same data.
- `lib/order-preview.ts` copies the checkout items and contact details. Later cart changes cannot change that copy. It also chooses the appropriate delivery or pickup timeline.
- `lib/checkout-contact.ts` provides sample contact details and a basic phone-format check, reused by checkout and tracking.

## Screenshot and design corrections

The implementation uses the supplied screenshot as the reference because the Figma connection reached its tool limit. It preserves the existing 412px page width, purple `#941696`, Roboto body text, Plus Jakarta Sans headings, rounded cards, and 16/24px spacing. The black device frame and Figma editor outlines are not part of the app.

Both screens use the same sample order number. Product photos, quantities, prices, and totals come from the existing product data or the checkout preview. The confirmation no longer promises a receipt email or a real successful payment. Arrival times and tracking updates are explicitly examples. Pickup shows collection stages, not a shipped parcel or a courier map.

`order-tracking-map.tsx` is a local SVG illustration, not the original map asset or a geographic/live map. Courier initials are used because the original courier portrait was not available. The existing Home/Search/Sell/Chat/Profile navigation is reused; Profile has no active highlight because there is no profile route yet.

## Demo limits

No payment, order, email, courier call, or courier message is sent. Call and message buttons explain the demo limitation. The map does not request your location. Editing contact details changes only this preview. Refreshing resets the preview to a single sample jumpsuit with delivery selected; navigating inside the app preserves the preview. The cart is not cleared. A direct visit also shows that sample order.

Real order IDs, persistent records, accurate delivery estimates, courier tracking, and authentication belong to the later backend stage.

## Checks to try

1. Preview a delivery checkout and confirm all cart quantities appear in confirmation and tracking.
2. Go back to checkout, choose pickup, and create another preview. Tracking should show Ready for Pickup without a courier map.
3. Edit the tracking contact. Letters in the phone field should show an error; a valid number should save. Closing without saving should keep the previous details.
4. Change the cart after creating a preview. The existing preview should stay unchanged.
5. Try both pages at narrow mobile widths and use Tab to reach every button and link.
