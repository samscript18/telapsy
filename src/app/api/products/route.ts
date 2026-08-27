import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() ?? "";
  const category = request.nextUrl.searchParams.get("category") ?? "All";
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(40, Math.max(1, Number(request.nextUrl.searchParams.get("limit") ?? "40") || 40));
  const filtered = catalog.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && (!search || haystack.includes(search));
  });
  const start = (page - 1) * limit;
  return NextResponse.json({ products: filtered.slice(start, start + limit), count: filtered.length, page, limit });
}
