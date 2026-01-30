import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) return NextResponse.json({ error: "FID missing" }, { status: 400 });

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY as string
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch score" }, { status: 500 });
  }
}