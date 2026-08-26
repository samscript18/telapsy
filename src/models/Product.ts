import { model, models, Schema } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  priceCents: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ["Fashion", "Electronics", "Home", "Accessories"] },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  featured: { type: Boolean, default: false },
  rating: Number,
  reviewCount: Number,
}, { timestamps: true });

export const Product = models.Product ?? model("Product", productSchema);
