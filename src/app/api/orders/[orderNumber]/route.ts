import { NextResponse } from "next/server";
import { canAccessRecentOrder, getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(_:Request,{params}:{params:Promise<{orderNumber:string}>}){const {orderNumber}=await params;await connectDb();const userId=await getSessionUserId();const recent=await canAccessRecentOrder(orderNumber);const order=await Order.findOne({orderNumber}).lean() as unknown as ({_id:unknown;userId?:unknown;[key:string]:unknown}|null);if(!order)return NextResponse.json({error:"Order not found."},{status:404});if(String(order.userId??"")!==String(userId??"")&&!recent)return NextResponse.json({error:"You don’t have access to this order."},{status:403});return NextResponse.json({order:{...order,_id:String(order._id),userId:order.userId?String(order.userId):null}})}
