import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Order } from "@/models/Order";

interface StoredDelivery {
  orderNumber: string;
  delivery?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  createdAt: Date;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ addresses: [] }, { status: 401 });

  await connectDb();
  const orders = (await Order.find({ userId })
    .select("orderNumber delivery createdAt")
    .sort({ createdAt: -1 })
    .lean()) as unknown as StoredDelivery[];

  const seen = new Set<string>();
  const addresses = orders.flatMap((order) => {
    const delivery = order.delivery;
    if (!delivery?.address || !delivery.city || !delivery.state || !delivery.country) return [];
    const key = [delivery.address, delivery.city, delivery.state, delivery.country]
      .map((value) => value.trim().toLowerCase())
      .join("|");
    if (seen.has(key)) return [];
    seen.add(key);
    return [{
      id: order.orderNumber,
      address: delivery.address,
      city: delivery.city,
      state: delivery.state,
      country: delivery.country,
      lastUsedAt: order.createdAt.toISOString(),
    }];
  }).slice(0, 6);

  return NextResponse.json({ addresses });
}
