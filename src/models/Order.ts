import { model, models, Schema } from "mongoose";

const itemSchema = new Schema({ productId: Schema.Types.ObjectId, slug: String, name: String, image: String, quantity: Number, unitPriceCents: Number, lineTotalCents: Number }, { _id: false });
const customerSchema = new Schema({ name: String, email: String, phone: String }, { _id: false });
const deliverySchema = new Schema({ address: String, city: String, state: String, country: String }, { _id: false });

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  guestEmail: String,
  items: { type: [itemSchema], required: true },
  subtotalCents: Number,
  discountCents: Number,
  shippingCents: Number,
  totalCents: Number,
  promoCode: String,
  customer: customerSchema,
  delivery: deliverySchema,
  paymentMethod: { type: String, enum: ["balance", "simulated-card"], required: true },
  paymentStatus: { type: String, default: "paid" },
  orderStatus: { type: String, default: "processing" },
  idempotencyKey: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Order = models.Order ?? model("Order", orderSchema);
