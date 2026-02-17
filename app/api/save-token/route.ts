

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { fid, url, token } = await req.json();

        if (!fid || !url || !token) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        await User.findOneAndUpdate(
            { fid },
            { 
                notificationUrl: url, 
                notificationToken: token, 
                updatedAt: new Date() 
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}