"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { OrderView, type OrderViewData } from "@/components/order-view";
import { useCart } from "@/store/cart";

export default function SuccessPage(){const {orderNumber}=useParams<{orderNumber:string}>();const clear=useCart((s)=>s.clearCart);const qc=useQueryClient();const {data,isLoading,error}=useQuery<{order:OrderViewData}>({queryKey:["order",orderNumber],queryFn:async()=>{const r=await fetch(`/api/orders/${orderNumber}`);if(!r.ok)throw new Error((await r.json()).error);return r.json()}});useEffect(()=>{if(data){clear();qc.invalidateQueries({queryKey:["me"]});qc.invalidateQueries({queryKey:["orders"]});}},[data,clear,qc]);if(isLoading)return <div className="shell py-24">Loading confirmation…</div>;if(error||!data)return <div className="shell py-24 text-center"><h1 className="display text-5xl">Confirmation unavailable.</h1><p className="mt-4 text-red-700">{error instanceof Error?error.message:"Order not found."}</p></div>;return <div className="shell py-16"><div className="mb-10 text-center"><CheckCircle2 className="mx-auto text-[var(--forest)]" size={48}/><p className="eyebrow mt-5">Payment successful</p><h1 className="display mt-3 text-6xl">Order confirmed!</h1><p className="mt-4 text-[var(--muted)]">Order #{data.order.orderNumber}</p><div className="mt-7 flex justify-center gap-3"><Link href="/products" className="btn btn-primary">Continue shopping</Link><Link href={`/orders/${data.order.orderNumber}`} className="btn btn-secondary">View order</Link></div></div><OrderView order={data.order}/></div>}
