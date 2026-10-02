# Batch photo capture

Start at `/sell` and choose **Take photos / Batch capture**, or open `/sell/capture` directly.

1. Use the purple camera button on a supported phone, or choose files with the gallery button. Desktop browsers may show a file picker for both.
2. Choose up to five JPG, PNG or WebP images, each no larger than 5 MB. Invalid or unreadable files show a message without discarding valid selections.
3. Tap a thumbnail to inspect it, or use the X over the large preview to remove it.
4. Choose **Done** to open `/sell/analyzing`. This checks that the images can open locally and shows progress.
5. Choose **Continue to listing** to use the photos in the existing form.

**Try with a sample photo** lets you explore without choosing a file. The screenshot's original brown jumpsuit and blue sweater were not available, so the sample uses the existing jumpsuit product image. Selected photos replace it.

## Beginner file guide

- `src/app/sell/layout.tsx` wraps the Sell routes in `ListingDraftProvider`. A shared layout keeps the form values and photos when moving between the form, capture, and preparation pages.
- `batch-capture-screen.tsx` controls the selected thumbnail, file pickers, tips, removal, and Done button. Its changes are staged locally until Done; closing capture discards unconfirmed edits.
- `photo-analysis-screen.tsx` opens each selected photo to check it, displays progress, and returns to the form. Cancel/back preserves the photos for review.
- `lib/listing-photo.ts` reads files and checks image decoding in the browser. `collectListingPhotos` in `lib/listing.ts` shares file validation and the five-photo limit with the original upload field.

The layout follows the supplied screenshot with the existing purple theme, large image area, cyan framing guide, five photo slots, and a separate progress screen. The black phone frame and Figma editor labels are not app content.

## Current limits

There is no live camera view, automatic shutter, flash control, object detection, AI lighting correction, upload, or real AI listing generation. The native device camera controls flash. The cyan guide and lighting tips are visual guidance. The preparation screen describes the actual local image check instead of claiming an AI analysis or upload. The app never requests location access.

Photos are held in browser memory. Refreshing or leaving the Sell routes resets this draft. Nothing is published. The next backend stage can add persistent storage and genuine AI analysis.
