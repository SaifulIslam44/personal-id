// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");
//   const APP_ID = "WbTVgaQ34L1m"; 

//   if (!fid) return NextResponse.json({ success: false, error: "FID missing" });

//   try {
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=10`,
//       {
//         headers: {
//           accept: "application/json",
//           api_key: process.env.NEYNAR_API_KEY || "",
//         },
//       }
//     );

//     const data = await response.json();

//     if (!data.casts || data.casts.length === 0) {
//       return NextResponse.json({ success: false, message: "No casts found" });
//     }

//     const hasShared = data.casts.some((cast: any) => {
//       // ১. মূল টেক্সটে আইডি আছে কি না চেক
//       const inText = cast.text.includes(APP_ID);

//       // ২. এম্বেডেড লিঙ্কের (Embeds) ভেতর আইডি আছে কি না চেক (এটিই আপনার সমস্যা সমাধান করবে)
//       const inEmbeds = cast.embeds?.some((embed: any) => 
//         embed.url && embed.url.includes(APP_ID)
//       );

//       // ৩. টাইম চেক (গত ২৪ ঘণ্টা)
//     //   const isRecent = new Date(cast.timestamp).getTime() > (Date.now() - 24 * 60 * 60 * 1000);

//     // ৩. টাইম চেক (৫ মিনিট = ৫ * ৬০ সেকেন্ড * ১০০০ মিলিসেকেন্ড)
//       const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
//       const isRecent = new Date(cast.timestamp).getTime() > fiveMinutesAgo;

//       return (inText || inEmbeds) && isRecent;
//     });

//     return NextResponse.json({ success: hasShared });
//   } catch {
//     return NextResponse.json({ success: false, error: "Server Error" });
//   }
// }













import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ShareLog from "@/models/ShareLog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const APP_ID = "WbTVgaQ34L1m"; 

  if (!fid) return NextResponse.json({ success: false, error: "FID missing" });

  try {
    // ১. ডাটাবেস কানেক্ট করা
    await connectDB();

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

    // আপনার দেওয়া অরিজিনাল লজিক (কিছু রিমুভ করা হয়নি)
    const validCast = data.casts.find((cast: any) => {
      // ১. মূল টেক্সটে আইডি আছে কি না চেক
      const inText = cast.text.includes(APP_ID);

      // ২. এম্বেডেড লিঙ্কের (Embeds) ভেতর আইডি আছে কি না চেক
      const inEmbeds = cast.embeds?.some((embed: any) => 
        embed.url && embed.url.includes(APP_ID)
      );

      // ৩. টাইম চেক (৫ মিনিট)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      const isRecent = new Date(cast.timestamp).getTime() > fiveMinutesAgo;

      return (inText || inEmbeds) && isRecent;
    });

    // ৪. যদি শেয়ার পাওয়া যায়, তবে ডাটাবেসে লগ সেভ হবে (Wallet Address সহ)
    if (validCast) {
      // Neynar ডাটা থেকে ইউজারনেম এবং ওয়ালেট বের করা
      const authorUsername = validCast.author?.username || "unknown";
      const verifiedWallet = validCast.author?.verified_addresses?.eth_addresses?.[0];
      const custodyWallet = validCast.author?.custody_address;
      
      await ShareLog.create({
          fid: fid,
          username: authorUsername,
          walletAddress: verifiedWallet || custodyWallet || "not found", // ওয়ালেট সেভ হচ্ছে
          castHash: validCast.hash,
          timestamp: new Date(validCast.timestamp)
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Log Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}