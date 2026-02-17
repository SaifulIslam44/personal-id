



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





















import { NextResponse } from "next/server";

export const runtime = 'edge'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fids = searchParams.get("fid"); 

  if (!fids) {
    return NextResponse.json({ error: "FIDs required" }, { status: 400 });
  }

  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
  
  // ১৫ দিনের সেকেন্ডের হিসাব (15 * 24 * 60 * 60)
  const FIFTEEN_DAYS = 2160000; 

  const headers = {
    // ব্রাউজার এবং CDN-কে বলা হচ্ছে ১৫ দিন ক্যাশ ধরে রাখতে
    'Cache-Control': `public, max-age=${FIFTEEN_DAYS}, s-maxage=${FIFTEEN_DAYS}, stale-while-revalidate=86400`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          api_key: NEYNAR_API_KEY || "",
        },
        // 🔥 এই অপশনটা Next.js-কে বলবে ১৫ দিন পর্যন্ত পুরনো ডেটাই ব্যবহার করতে
        next: { revalidate: FIFTEEN_DAYS } 
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Neynar" }, 
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    
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