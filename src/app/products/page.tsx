import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSessionUserId } from "@/lib/auth";
import { ProductsClient } from "./products-client";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (await getSessionUserId()) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "string") params.set(key, value);
    }
    redirect(`/dashboard/products${params.size ? `?${params}` : ""}`);
  }
  return <Suspense fallback={<div className="shell py-20">Loading collection…</div>}><ProductsClient /></Suspense>;
}
