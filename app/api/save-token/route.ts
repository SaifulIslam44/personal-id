import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        // ১. রিকোয়েস্ট থেকে ডাটা নেওয়া
        const body = await req.json();
        const { fid, url, token } = body;

        // ২. ডাটা ভ্যালিডেশন
        if (!fid || !url || !token) {
            console.error("❌ API Error: Missing required fields", { fid, url, token });
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // ৩. ডাটাবেজ আপডেট বা তৈরি (Upsert)
        // 'new: true' এর বদলে 'returnDocument: "after"' ব্যবহার করা হয়েছে ওয়ার্নিং এড়াতে
        const updatedUser = await User.findOneAndUpdate(
            { fid: fid },
            { 
                notificationUrl: url, 
                notificationToken: token, 
                updatedAt: new Date() 
            },
            { 
                upsert: true, 
                returnDocument: "after" 
            }
        );

        if (updatedUser) {
            console.log(`✅ Token successfully saved for FID: ${fid}`);
            return NextResponse.json({ success: true });
        } else {
            throw new Error("User update failed");
        }

    } catch (error: any) {
        console.error("❌ API DB Error:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message }, 
            { status: 500 }
        );
    }
}