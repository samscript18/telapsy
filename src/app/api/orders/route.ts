import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Order } from "@/models/Order";

const PAGE_SIZE = 5;
const allowedStatuses = new Set(["processing", "shipped", "delivered", "cancelled"]);

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to view orders." }, { status: 401 });

  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.trim().slice(0, 80) ?? "";
  const requestedStatus = searchParams.get("status")?.toLowerCase() ?? "all";
  const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const filters: Record<string, unknown> = { userId };

  if (allowedStatuses.has(requestedStatus)) filters.orderStatus = requestedStatus;
  if (query) {
    const match = new RegExp(escapeRegex(query), "i");
    filters.$or = [{ orderNumber: match }, { "items.name": match }];
  }

  await connectDb();
  const total = await Order.countDocuments(filters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const orders = await Order.find(filters)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return NextResponse.json({
    orders: orders.map((order) => ({ ...order, _id: String(order._id), userId: String(order.userId) })),
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages },
  });
}
