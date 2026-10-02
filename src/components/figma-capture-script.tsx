import Script from "next/script";

// Temporary export helper. Excluded from production builds.
// Open a Figma capture link to submit the selected screen to the design file.
export function FigmaCaptureScript() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />;
}
