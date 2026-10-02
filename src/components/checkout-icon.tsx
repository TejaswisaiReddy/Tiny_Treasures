import Image from "next/image";

// Each SVG keeps the original dimensions exported by Figma.
const dimensions = {
  "condition": [20, 20],
  "credit-card": [20, 16],
  "contactless": [30, 30],
  "mobile-pay": [19, 18],
  "apple-pay": [15, 22],
  "pickup": [16, 20],
  "delivery": [22, 16],
  "edit": [10.5, 10.5],
  "shipping": [12.8333, 9.33333],
  "back": [16, 16],
  "info": [20, 20],
  "lock": [16, 21],
} as const;

export type CheckoutIconName = keyof typeof dimensions;

export function CheckoutIcon({ name }: { name: CheckoutIconName }) {
  const [width, height] = dimensions[name];
  return <Image src={`/images/checkout/${name}.svg`} alt="" width={width} height={height} className="shrink-0" />;
}
