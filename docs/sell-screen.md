# List an Item screen

Open `/sell`, or choose **Sell** in the bottom navigation.

## How the files fit together

- `src/app/sell/page.tsx` creates the address and page title.
- `src/components/sell-screen.tsx` holds the form values in React state and handles validation and dialogs.
- `src/components/listing-photo-upload.tsx` reads up to five local photos, checks their type and size, and lets you remove them. The first photo becomes the cover.
- `src/components/listing-preview.tsx` shows the photos and entered details without publishing anything. Closing it keeps your form values.
- `src/lib/listing.ts` contains the types and validation rules, including converting euro prices into cents.
- `src/components/bottom-navigation.tsx` is shared by the existing screens. Sell now links to this page.

## Corrections to the Figma reference

- Use the existing 412px maximum width, 64px header and full-width shared navigation; omit the decorative black device frame.
- Keep Roboto for form content, Plus Jakarta Sans for the heading/navigation, and the existing `#941696` brand colour.
- Use 16px side padding and section/field gaps, and 8px between labels and controls, matching the updated September 30 reference.
- Give every field a 12px corner radius, purple border and minimum 48px height. Labels and inputs are 16px, and help text is 12px for readability.
- Render one dropdown arrow instead of the two overlapping arrows in the design.
- Use the existing Home / Search / Sell / Chat / Profile navigation, including every icon and a visible active Sell state.
- Match the grey 160px photo area and solid purple 60px AI button. Keep the explicit coming-soon explanation because AI suggestions are not connected.
- Use the current Figma photo and dropdown assets, with the dropdown SVG at its original 21px dimensions.
- Add the missing condition selector, reuse the filter options, and require a size only for clothes/accessories.
- Add associated labels, required markers, error messages, keyboard focus and space above the fixed navigation.

## Try it

1. Submit the empty form: the first missing field receives focus and the fields explain what to add.
2. Add a JPG, PNG or WebP image, no larger than 5 MB. Try removing it or selecting more than five.
3. Enter a title and a price such as `12.50` or `12,50`.
4. Select Clothes and a size, then switch to Books: the size resets and is no longer required.
5. Choose a condition, add a description and select Preview Listing.
6. Check your details, then choose Continue editing. Your entries are still there.

Use **Take photos / Batch capture** to open the photo-capture and preparation screens. The shared Sell layout preserves form details and photos while moving between these steps. See `docs/photo-capture.md`.

This is a frontend preview. Photos are read in your browser, not uploaded. The form resets when you leave the Sell routes or refresh the page. Publishing, persistent drafts, accounts, storage and real AI suggestions are future work.

Run the validation tests with `node --experimental-strip-types --test tests/listing.test.mjs`.
