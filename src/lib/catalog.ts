import type { Category, ProductData } from "@/types";

const names: Record<Category, string[]> = {
  Fashion: ["Velocity Sneakers", "Urban Classic Hoodie", "Meridian Overshirt", "Everyday Relaxed Tee", "Nova Denim Jacket", "Avenue Chinos", "Cloud Knit Sweater", "Motion Joggers", "Studio Polo", "Metro Bomber"],
  Electronics: ["Pulse Wireless Headphones", "Arc Mechanical Keyboard", "Halo Bluetooth Speaker", "Flux Wireless Mouse", "Beam Desk Light", "Orbit USB-C Hub", "Echo Mini Earbuds", "Frame Portable Monitor", "Volt Power Bank", "Nest Charging Stand"],
  Home: ["Cove Table Lamp", "Loom Throw Blanket", "Terra Ceramic Vase", "Haven Storage Basket", "Drift Scent Diffuser", "Ember Coffee Mug Set", "Ridge Wall Clock", "Linen Cushion Set", "Grove Plant Pot", "Slate Serving Board"],
  Accessories: ["Atlas Backpack", "Axis Wristwatch", "Metro Sunglasses", "Loop Leather Belt", "Forma Crossbody Bag", "Pivot Card Holder", "Trail Cap", "Halo Bracelet", "Grid Laptop Sleeve", "Meridian Tote"],
};

const categoryCopy: Record<Category, string> = {
  Fashion: "Comfort-led design with an elevated everyday silhouette.",
  Electronics: "Thoughtful technology engineered for a calmer daily setup.",
  Home: "A warm, tactile accent made to bring ease into your space.",
  Accessories: "A considered finishing piece built for everyday movement.",
};

const basePrices: Record<Category, number> = { Fashion: 6800, Electronics: 8900, Home: 4200, Accessories: 5400 };

export const catalog: ProductData[] = (Object.entries(names) as [Category, string[]][]).flatMap(
  ([category, categoryNames], categoryIndex) => categoryNames.map((name, index) => ({
    id: `${categoryIndex + 1}-${index + 1}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: `${categoryCopy[category]} ${name} pairs durable materials with clean detailing and dependable performance.`,
    priceCents: basePrices[category] + index * 700 + categoryIndex * 300,
    category,
    image: `/products/${category.toLowerCase()}.svg`,
    stock: 8 + ((index * 7 + categoryIndex * 3) % 24),
    featured: index < 2,
    rating: Number((4.2 + ((index + categoryIndex) % 7) / 10).toFixed(1)),
    reviewCount: 28 + index * 17 + categoryIndex * 11,
  })),
);

export function findProduct(slug: string) { return catalog.find((product) => product.slug === slug); }
