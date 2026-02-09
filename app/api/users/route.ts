// import { NextResponse } from "next/server";

// // export const dynamic = 'force-dynamic';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) {
//     return NextResponse.json({ error: "FID required" }, { status: 400 });
//   }

//   const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

//   try {
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
//       {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           api_key: NEYNAR_API_KEY || "",
//         },
//         // এই লাইনটি ডাটাকে ২৪ ঘণ্টার জন্য ক্যাশ করবে
//         next: { revalidate: 86400 } 
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json({ error: "Failed to fetch" }, { status: response.status });
//     }

//     const data = await response.json();
//     const user = data.users?.[0];

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       fid: user.fid,
//       username: user.username,
//       displayName: user.display_name,
//       pfpUrl: user.pfp_url,
//     });

//   } catch {
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }








import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fids = searchParams.get("fid"); // এখন এখানে কমা দেওয়া অনেকগুলো FID আসবে

  if (!fids) {
    return NextResponse.json({ error: "FIDs required" }, { status: 400 });
  }

  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

  // Cache Control: ব্রাউজার এবং Vercel CDN ডাটা ২৪ ঘণ্টা মনে রাখবে
  const headers = {
    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=59',
    'Content-Type': 'application/json',
  };

  try {
    // Neynar Bulk API Call
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          api_key: NEYNAR_API_KEY || "",
        },
        // Next.js সার্ভার সাইড ক্যাশিং
        next: { revalidate: 86400 } 
      }
    );

    if (!response.ok) {
      // ফেইল করলেও ক্যাশ হেডার সহ রিটার্ন করছি যাতে বারবার রিকোয়েস্ট না যায়
      return NextResponse.json(
        { error: "Failed to fetch from Neynar" }, 
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    
    // ডাটা ম্যাপ করে ক্লিন অবজেক্ট তৈরি করা
    const users = data.users?.map((user: any) => ({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
    })) || [];

    return NextResponse.json({ users }, { headers });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}