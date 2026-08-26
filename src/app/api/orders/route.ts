import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Order } from "@/models/Order";
export async function GET(){const userId=await getSessionUserId();if(!userId)return NextResponse.json({error:"Sign in to view orders."},{status:401});await connectDb();const orders=await Order.find({userId}).sort({createdAt:-1}).lean();return NextResponse.json({orders:orders.map((o)=>({...o,_id:String(o._id),userId:String(o.userId)}))})}
