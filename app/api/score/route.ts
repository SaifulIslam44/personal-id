import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY || "", 
      },
    });

    const data = await response.json();
    const score = data.users?.[0]?.profile?.score || 0;

    return NextResponse.json({ score });
  } catch (error) {
    console.error("Neynar API Error:", error); // 🚩 এখন 'error' ব্যবহৃত হচ্ছে
    return NextResponse.json({ error: "Failed to fetch score" }, { status: 500 });
  }
}