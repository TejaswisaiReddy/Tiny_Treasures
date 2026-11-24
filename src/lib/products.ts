export type Product = {
  id: string;
  name: string;
  price: number;
  /** File name, including extension, in /public/images/products. */
  image?: string;
  category: string;
  ageGroup?: string;
  brand?: string;
  size: string;
  condition: string;
  location: string;
  rating: string;
  shortDescription?: string;
};

// Temporary sample listings. A database will supply these in a later step.
export const seasonalProducts: Product[] = [
  { id: "pink-1", name: "Pink Hooded Puffer Jacket", price: 24, image: "pink-jacket.png", category: "Clothing", size: "110", ageGroup: "4–5Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Warm pink padded coat with a hood and dark star-print lining." },
  { id: "winter-1", name: "Orange and Yellow Winter Snowsuit", price: 28, image: "winter-jacket.png", category: "Clothing", size: "92", ageGroup: "1–2Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Bright mustard-and-orange hooded winter snowsuit with warm quilted panels." },
];
export const recentProducts: Product[] = [
  { id: "hm-jumpsuit", name: "Navy Baby Jumpsuit", price: 12, image: "jumpsuit.png", category: "Clothing", size: "92", ageGroup: "1–2Y", condition: "Good", location: "Tampere", rating: "4.9", shortDescription: "Dark navy long-sleeve one-piece with a button front and full-length legs." },
  { id: "scooter", name: "Green Three-Wheel Kids' Scooter", price: 18, image: "scooter.jpg", category: "Toys", size: "One size", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Green three-wheel kick scooter with a wide deck and child-size hand grips." },
  { id: "stroller", name: "Navy Stroller with Red Canopy", price: 30, image: "stroller.jpg", category: "Baby Gear", size: "One size", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Navy stroller with a red canopy, safety harness and under-seat basket." },
  { id: "white-frock", name: "White Tulle Party Dress", price: 18, image: "white-frock.jpg", category: "Clothing", size: "110", ageGroup: "4–5Y", condition: "Like new", location: "Tampere", rating: "4.8", shortDescription: "White sleeveless party dress with a gathered tulle skirt." },
  { id: "wooden-blocks", name: "Wooden Alphabet Blocks", price: 8, image: "wooden-blocks.png", category: "Toys", size: "One size", condition: "Like new", location: "Tampere", rating: "4.8", shortDescription: "Muted wooden alphabet and play blocks for early learning." },
  { id: "yellow-raincoat", name: "Yellow Hooded Kids' Raincoat", price: 15, image: "yellow-raincoat.png", category: "Clothing", size: "104", ageGroup: "3–4Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Bright yellow hooded raincoat with a snap front and roomy patch pockets." },
];

/** Public path of a product's photo, or undefined when it has none (SafeImage then shows its fallback). */
export function productImageSrc(product: Pick<Product, "image">): string | undefined {
  return product.image ? `/images/products/${product.image}` : undefined;
}

export const allProducts = [...seasonalProducts, ...recentProducts];

export type Seller = {
  name: string;
  avatar: string;
  rating: string;
  reviewCount: number;
  verified: boolean;
  responseTime: string;
};

export type ItemDetails = {
  product: Product;
  description: string;
  sizeLabel: string;
  color?: string;
  pickup: string;
  seller?: Seller;
};

export function getItemDetails(id: string): ItemDetails | undefined {
  const product = allProducts.find(item => item.id === id);
  if (!product) return undefined;

  if (id === "hm-jumpsuit") {
    return {
      product,
      description: product.shortDescription ?? `${product.name} in ${product.condition.toLowerCase()} condition, size ${product.size}.`,
      sizeLabel: "Size 92 (1.5-2Y)",
      color: "Navy",
      pickup: "Pickup in Kaleva, Tampere",
      seller: { name: "Aisha", avatar: "/images/item/seller-aisha.png", rating: "4.9", reviewCount: 12, verified: true, responseTime: "Responds in 1 hr" },
    };
  }

  return {
    product,
    description: product.shortDescription ?? `${product.name} in ${product.condition.toLowerCase()} condition, size ${product.size}.`,
    sizeLabel: `Size ${product.size}`,
    pickup: `Pickup in ${product.location}`,
  };
}
