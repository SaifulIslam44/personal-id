import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const APP_ID = "WbTVgaQ34L1m"; 

  if (!fid) return NextResponse.json({ success: false, error: "FID missing" });

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=10`,
      {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY || "",
        },
      }
    );

    const data = await response.json();

    if (!data.casts || data.casts.length === 0) {
      return NextResponse.json({ success: false, message: "No casts found" });
    }

    const hasShared = data.casts.some((cast: any) => {
      // ১. মূল টেক্সটে আইডি আছে কি না চেক
      const inText = cast.text.includes(APP_ID);

      // ২. এম্বেডেড লিঙ্কের (Embeds) ভেতর আইডি আছে কি না চেক (এটিই আপনার সমস্যা সমাধান করবে)
      const inEmbeds = cast.embeds?.some((embed: any) => 
        embed.url && embed.url.includes(APP_ID)
      );

      // ৩. টাইম চেক (গত ২৪ ঘণ্টা)
    //   const isRecent = new Date(cast.timestamp).getTime() > (Date.now() - 24 * 60 * 60 * 1000);

    // ৩. টাইম চেক (৫ মিনিট = ৫ * ৬০ সেকেন্ড * ১০০০ মিলিসেকেন্ড)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      const isRecent = new Date(cast.timestamp).getTime() > fiveMinutesAgo;

      return (inText || inEmbeds) && isRecent;
    });

    return NextResponse.json({ success: hasShared });
  } catch {
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}