



//Neynar API main code: 

// import { NextResponse } from "next/server";

// // 🔥 এই লাইনটি অবশ্যই যোগ করবেন, এটিই ইনভোকেশন কস্ট কমাবে
// export const runtime = 'edge'; 

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fids = searchParams.get("fid"); 

//   if (!fids) {
//     return NextResponse.json({ error: "FIDs required" }, { status: 400 });
//   }

//   const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// const headers = {
//   'Cache-Control': 'public, s-maxage=432000, stale-while-revalidate=86400',
//   'Content-Type': 'application/json',
// };

//   try {
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
//       {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           api_key: NEYNAR_API_KEY || "",
//         },
//         next: { revalidate: 432000 }
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch from Neynar" }, 
//         { status: response.status, headers }
//       );
//     }

//     const data = await response.json();
    
//     const users = data.users?.map((user: any) => ({
//       fid: user.fid,
//       username: user.username,
//       displayName: user.display_name,
//       pfpUrl: user.pfp_url,
//     })) || [];

//     return NextResponse.json({ users }, { headers });

//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


























//changed upper code is neynar api. 
import { NextResponse } from "next/server";

export const runtime = 'edge'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid"); 

  if (!fid) {
    return NextResponse.json({ error: "FID required" }, { status: 400 });
  }

  // ১. হেডার কনফিগারেশন (ক্যাশ এবং স্পিড)
  const headers = {
    'Cache-Control': 'public, s-maxage=432000, stale-while-revalidate=86400',
    'Content-Type': 'application/json',
  };

  // ২. ডিফল্ট বা অফলাইন ইউজার (যদি API ফেইল করে তবে এটি দেখাবে)
  const fallbackUser = {
    fid: Number(fid),
    username: "unknown",
    displayName: `User ${fid}`,
    pfpUrl: `https://avatar.vercel.sh/${fid}`, // ডিফল্ট অভাতার
    isOffline: true
  };

  try {
    // ৩. সেফ এপিআই কল (উইথ টাইমআউট)
    const response = await fetch(
      `https://api.warpcast.com/v2/user?fid=${fid}`,
      {
        method: "GET",
        headers: { 'accept': 'application/json' },
        next: { revalidate: 86400 }, // ২৪ ঘণ্টা ক্যাশ
        signal: AbortSignal.timeout(2500) // ⏳ ২.৫ সেকেন্ডের বেশি সময় নিলে অটো ক্যান্সেল
      }
    );

    // ৪. যদি রেসপন্স ঠিক না থাকে, জোর করে এরর থ্রো করে ক্যাচ ব্লকে পাঠাবো
    if (!response.ok) {
      throw new Error(`Warpcast Error: ${response.status}`);
    }

    const data = await response.json();
    
    // ডাটা ভ্যালিডেশন
    if (!data.result || !data.result.user) {
       // ডাটা না পেলেও ফলব্যাক ইউজার রিটার্ন করবো
       return NextResponse.json({ users: [fallbackUser] }, { headers });
    }

    const user = data.result.user;

    // ৫. সাকসেসফুল ডাটা ম্যাপিং
    const users = [{
      fid: user.fid,
      username: user.username,
      displayName: user.displayName,
      pfpUrl: user.pfp?.url || fallbackUser.pfpUrl,
    }];

    return NextResponse.json({ users }, { headers });

  } catch (error) {
    // ৬. লুপ বা ক্র্যাশ আটকানো (Safety Net)
    // সার্ভার ফেইল করলে বা টাইমআউট হলে আমরা অফলাইন ডাটা পাঠিয়ে দিব।
    // ফ্রন্টএন্ড বুঝতেই পারবে না যে API ফেইল করেছে।
    console.error("API Fetch Failed (Serving Fallback):", error);
    
    return NextResponse.json({ users: [fallbackUser] }, { headers });
  }
}