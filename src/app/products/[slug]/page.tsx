import { notFound, redirect } from "next/navigation";
import { findProduct, catalog } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/auth";

export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = findProduct(slug); if (!product) notFound();
  const destination = `/dashboard/products/${slug}`;
  if (!(await getSessionUserId())) redirect(`/signin?next=${encodeURIComponent(destination)}`);
  redirect(destination);
}
