import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() ?? "";
  const category = request.nextUrl.searchParams.get("category") ?? "All";
  const products = catalog.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && (!search || haystack.includes(search));
  });
  return NextResponse.json({ products, count: products.length });
}
