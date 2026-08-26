import { Suspense } from "react";
import { ProductsClient } from "./products-client";

export default function ProductsPage() { return <Suspense fallback={<div className="shell py-20">Loading collection…</div>}><ProductsClient /></Suspense>; }
