"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderView, type OrderViewData } from "@/components/order-view";
export default function OrderPage(){const {id}=useParams<{id:string}>();const {data,isLoading,error}=useQuery<{order:OrderViewData}>({queryKey:["order",id],queryFn:async()=>{const r=await fetch(`/api/orders/${id}`);if(!r.ok)throw new Error((await r.json()).error);return r.json()},retry:false});if(isLoading)return <div className="shell py-24">Loading order…</div>;if(error||!data)return <div className="shell py-24 text-center"><h1 className="display text-5xl">Order unavailable.</h1><p className="mt-4 text-[var(--muted)]">{error instanceof Error?error.message:"It may not exist or belong to another account."}</p><Link href="/orders" className="btn btn-secondary mt-7">Back to orders</Link></div>;return <div className="shell py-16"><p className="eyebrow">Order details</p><h1 className="display mt-3 text-6xl">#{data.order.orderNumber}</h1><p className="mb-9 mt-4 text-[var(--muted)]">Placed {new Date(data.order.createdAt).toLocaleString()} · {data.order.orderStatus}</p><OrderView order={data.order}/></div>}
