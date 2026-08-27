import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { calculatePricing } from "@/lib/pricing";
import { checkoutSchema } from "@/lib/validation";
import { createOrderAccessToken, getSessionUserId, RECENT_ORDER_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { notifyUser } from "@/lib/notifications";

function makeOrderNumber() { return `TEL-${Date.now().toString().slice(-6)}${Math.floor(Math.random()*90+10)}`; }

export async function POST(request: Request) {
  try {
    const parsed = checkoutSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please complete every required checkout field." }, { status: 400 });
    await connectDb(); const sessionUserId = await getSessionUserId();
    if (parsed.data.paymentMethod === "balance" && !sessionUserId) return NextResponse.json({ error: "Sign in to use Telapsy Balance." }, { status: 401 });
    const existing = await Order.findOne({ idempotencyKey: parsed.data.idempotencyKey }).lean() as unknown as { orderNumber: string } | null;
    if (existing) return NextResponse.json({ orderNumber: existing.orderNumber });
    const requested = new Map(parsed.data.items.map((item) => [item.slug, item.quantity]));
    const products = await Product.find({ slug: { $in: [...requested.keys()] } }).lean();
    if (products.length !== requested.size) return NextResponse.json({ error: "One or more products are no longer available." }, { status: 409 });
    const items = products.map((product) => { const quantity=requested.get(product.slug)!; if(quantity>product.stock) throw new Error(`${product.name} only has ${product.stock} available.`); return { productId: product._id, slug: product.slug, name: product.name, image: product.image, quantity, unitPriceCents: product.priceCents, lineTotalCents: product.priceCents*quantity }; });
    const pricing = calculatePricing(items.map(({unitPriceCents,quantity})=>({priceCents:unitPriceCents,quantity})), parsed.data.promoCode);
    let deducted = false;
    if (parsed.data.paymentMethod === "balance") { const result=await User.updateOne({_id:sessionUserId,balanceCents:{$gte:pricing.totalCents}},{$inc:{balanceCents:-pricing.totalCents}}); if(!result.modifiedCount)return NextResponse.json({error:"Your Telapsy Balance is not enough for this order."},{status:409}); deducted=true; }
    try {
      const order=await Order.create({orderNumber:makeOrderNumber(),userId:sessionUserId??undefined,guestEmail:sessionUserId?undefined:parsed.data.customer.email,items,...pricing,customer:parsed.data.customer,delivery:parsed.data.delivery,paymentMethod:parsed.data.paymentMethod,paymentStatus:"paid",orderStatus:"processing",idempotencyKey:parsed.data.idempotencyKey||randomUUID()});
      if (sessionUserId) await notifyUser({ userId: sessionUserId, type: "order", title: `Order ${order.orderNumber} confirmed`, message: `Your order is confirmed and is now being prepared.`, actionUrl: `/orders/${order.orderNumber}`, dedupeKey: `order:${order.orderNumber}:confirmed` });
      const response=NextResponse.json({orderNumber:order.orderNumber,totalCents:order.totalCents},{status:201});response.cookies.set(RECENT_ORDER_COOKIE,await createOrderAccessToken(order.orderNumber),{...sessionCookieOptions,maxAge:86400});return response;
    } catch (error) { if(deducted)await User.updateOne({_id:sessionUserId},{$inc:{balanceCents:pricing.totalCents}});throw error; }
  } catch (error) { return NextResponse.json({error:error instanceof Error?error.message:"We couldn’t place your order. Please try again."},{status:500}); }
}
