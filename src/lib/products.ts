export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
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
const details = { category: "Clothing", size: "120", condition: "Good", location: "Tampere", rating: "4.8" };
export const seasonalProducts: Product[] = [
  { ...details, id: "pink-1", name: "Pink Puffer Jacket", price: 24, image: "pink-jacket" },
];
export const recentProducts: Product[] = [
  { id: "hm-jumpsuit", name: "H&M Jumpsuit", price: 15, image: "cart/jumpsuit", category: "Clothing", size: "92", ageGroup: "1–2Y", brand: "H&M", condition: "Excellent", location: "Tampere", rating: "4.9", shortDescription: "Size: 92 (18–24M)" },
  { id: "yellow-raincoat", name: "Yellow Raincoat", price: 22.5, image: "cart/yellow-raincoat", category: "Clothing", size: "104", ageGroup: "3–4Y", condition: "New with tags", location: "Tampere", rating: "4.8", shortDescription: "Size: 104 (3–4Y)" },
  { id: "wooden-blocks", name: "Wooden Blocks Set", price: 12, image: "cart/wooden-blocks", category: "Toys", size: "One size", condition: "New with tags", location: "Tampere", rating: "4.8", shortDescription: "Eco-friendly Wood" },
  { ...details, id: "winter-1", name: "Winter jacket", price: 30, image: "winter-jacket" },
  { ...details, id: "rain-1", name: "Rain Jacket", price: 15, image: "pink-jacket" },
];

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
      description: "Great condition, soft and comfy navy corduroy jumpsuit. Perfect for playtime, outings, or casual days. Easy to wear and adjust. Washed only with fragrance-free baby detergent.",
      sizeLabel: "Size 92 (1.5-2Y)",
      color: "Navy Black",
      pickup: "Pickup in Kaleva, Tampere",
      seller: { name: "Aisha", avatar: "/images/item/seller-aisha.png", rating: "4.9", reviewCount: 12, verified: true, responseTime: "Responds in 1 hr" },
    };
  }

  return {
    product,
    description: `${product.name} in ${product.condition.toLowerCase()} condition, size ${product.size}. This is a sample listing. A full seller description will be available when real listings are added.`,
    sizeLabel: `Size ${product.size}`,
    pickup: `Pickup in ${product.location}`,
  };
}
