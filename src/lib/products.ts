export type Product = {
  id: string;
  name: string;
  price: number;
  /** Product image file name or an absolute path within /public. */
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
  { id: "scooter", name: "Scooter", price: 18, image: "scooter.jpg", category: "Toys", size: "One size", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Green three-wheel kick scooter with a wide deck and child-size hand grips." },
  { id: "stroller", name: "ABC Stroller", price: 30, image: "stroller.jpg", category: "Baby Gear", size: "One size", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Navy stroller with a red canopy, safety harness and under-seat basket." },
  { id: "white-frock", name: "White Party Dress", price: 18, image: "white-frock.jpg", category: "Clothing", size: "110", ageGroup: "4–5Y", condition: "Like new", location: "Tampere", rating: "4.8", shortDescription: "White sleeveless party dress with a gathered tulle skirt." },
  { id: "wooden-blocks", name: "Wooden Alphabet Blocks", price: 8, image: "wooden-blocks.png", category: "Toys", size: "One size", condition: "Like new", location: "Tampere", rating: "4.8", shortDescription: "Muted wooden alphabet and play blocks for early learning." },
  { id: "yellow-raincoat", name: "Yellow Raincoat", price: 15, image: "yellow-raincoat.png", category: "Clothing", size: "104", ageGroup: "3–4Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "Bright yellow hooded raincoat with a snap front and roomy patch pockets." },
];
export const categoryProducts: Product[] = [
  { id: "picture-books", name: "Children's Picture Book Set", price: 10, image: undefined, category: "Books", size: "One size", ageGroup: "2–3Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "A small set of colourful picture books for young readers." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "animal-storybook", name: "Animal Storybook", price: 6, image: undefined, category: "Books", size: "One size", ageGroup: "1–2Y", condition: "Like new", location: "Helsinki", rating: "4.9", shortDescription: "A sturdy illustrated story about friendly forest animals." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "first-words-books", name: "First Words Board Books", price: 8, image: undefined, category: "Books", size: "One size", ageGroup: "1–2Y", condition: "Good", location: "Espoo", rating: "4.7", shortDescription: "A set of durable board books for learning first words." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "nature-storybook", name: "Little Nature Stories", price: 5, image: undefined, category: "Books", size: "One size", ageGroup: "3–4Y", condition: "Fair", location: "Tampere", rating: "4.6", shortDescription: "A gently used collection of short nature-themed stories." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "wooden-animal-puzzle", name: "Wooden Animal Jigsaw", price: 12, image: undefined, category: "Puzzles", size: "One size", ageGroup: "3–4Y", condition: "Good", location: "Tampere", rating: "4.9", shortDescription: "A wooden animal puzzle with chunky pieces for small hands." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "farm-piece-puzzle", name: "Farm Friends Large-Piece Puzzle", price: 9, image: undefined, category: "Puzzles", size: "One size", ageGroup: "2–3Y", condition: "Like new", location: "Espoo", rating: "4.8", shortDescription: "A colourful farm puzzle with easy-to-grip pieces." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "rainbow-shape-puzzle", name: "Rainbow Shape Puzzle", price: 7, image: undefined, category: "Puzzles", size: "One size", ageGroup: "1–2Y", condition: "Good", location: "Vantaa", rating: "4.7", shortDescription: "A simple shape-matching puzzle for early learners." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "space-jigsaw", name: "Space Adventure 48-Piece Puzzle", price: 6, image: undefined, category: "Puzzles", size: "One size", ageGroup: "4–5Y", condition: "Fair", location: "Helsinki", rating: "4.6", shortDescription: "A gently used space-themed puzzle with 48 pieces." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "plush-bunny", name: "Plush Bunny Soft Toy", price: 12, image: undefined, category: "Soft toys", size: "One size", ageGroup: "1–2Y", condition: "Like new", location: "Tampere", rating: "4.9", shortDescription: "A soft plush bunny ready for a new cuddle buddy." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "classic-teddy", name: "Classic Teddy Bear", price: 10, image: undefined, category: "Soft toys", size: "One size", ageGroup: "2–3Y", condition: "Good", location: "Helsinki", rating: "4.8", shortDescription: "A cuddly brown teddy bear in good pre-loved condition." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "soft-elephant", name: "Soft Elephant Plush", price: 8, image: undefined, category: "Soft toys", size: "One size", ageGroup: "1–2Y", condition: "Good", location: "Espoo", rating: "4.7", shortDescription: "A small, soft elephant toy for playtime or bedtime." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "dinosaur-plush", name: "Green Dinosaur Soft Toy", price: 7, image: undefined, category: "Soft toys", size: "One size", ageGroup: "3–4Y", condition: "Fair", location: "Vantaa", rating: "4.6", shortDescription: "A well-loved green dinosaur plush with plenty of play left." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "stacking-rings", name: "Wooden Stacking Rings", price: 9, image: undefined, category: "More", size: "One size", ageGroup: "1–2Y", condition: "Good", location: "Tampere", rating: "4.8", shortDescription: "A classic wooden stacking toy for little hands." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "kids-backpack", name: "Toddler Backpack", price: 14, image: undefined, category: "More", size: "One size", ageGroup: "2–3Y", condition: "Like new", location: "Helsinki", rating: "4.9", shortDescription: "A lightweight small backpack, just right for nursery days." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "rain-boots", name: "Kids' Rain Boots", price: 11, image: undefined, category: "More", size: "25", ageGroup: "2–3Y", condition: "Good", location: "Espoo", rating: "4.7", shortDescription: "Everyday children's rain boots in a practical toddler size." }, // TODO: Add a photo under public/images/products/ before setting this image.
  { id: "bath-toys", name: "Bath Time Toy Set", price: 6, image: undefined, category: "More", size: "One size", ageGroup: "1–2Y", condition: "Fair", location: "Vantaa", rating: "4.6", shortDescription: "A set of simple bath toys, ready for another little one." }, // TODO: Add a photo under public/images/products/ before setting this image.
];

export const categoryPageDefinitions = [
  { slug: "books", title: "Books", category: "Books" },
  { slug: "puzzles", title: "Puzzles", category: "Puzzles" },
  { slug: "soft-toys", title: "Soft toys", category: "Soft toys" },
  { slug: "more", title: "More", category: "More" },
] as const;

export function getCategoryPage(slug: string) {
  const definition = categoryPageDefinitions.find(category => category.slug === slug);
  if (!definition) return undefined;
  return {
    title: definition.title,
    products: categoryProducts.filter(product => product.category === definition.category),
  };
}

/** Public path of a product's photo, or undefined when it has none (SafeImage then shows its fallback). */
export function productImageSrc(product: Pick<Product, "image">): string | undefined {
  if (!product.image) return undefined;
  return product.image.startsWith("/") ? product.image : `/images/products/${product.image}`;
}

export const allProducts = [...seasonalProducts, ...recentProducts, ...categoryProducts];

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
