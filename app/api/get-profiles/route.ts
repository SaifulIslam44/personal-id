
//Neynar Api main code:


// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const addresses = searchParams.get("addresses");

//   if (!addresses) return NextResponse.json({});

//   try {
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses}`, 
//       {
//         headers: {
//           'accept': 'application/json',
//           'api_key': process.env.NEYNAR_API_KEY as string
//         },
//         next: { revalidate: 432000 }
//       }
//     );

//     const data = await response.json();
//     const profileMap: Record<string, { profileName: string; pfp: string }> = {};

//     if (data) {
//       Object.keys(data).forEach((addr) => {
//         const user = data[addr][0];
//         if (user) {
//           profileMap[addr.toLowerCase()] = {
//             profileName: user.display_name || user.username, // Display Name না থাকলে ইউজারনেম দেখাবে
//             pfp: user.pfp_url
//           };
//         }
//       });
//     }

//     return NextResponse.json(profileMap);
//   } catch {
//     return NextResponse.json({});
//   }
// }



















import { NextResponse } from "next/server";

export const runtime = 'edge'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addresses = searchParams.get("addresses");

  if (!addresses) return NextResponse.json({});

  // ১৫ দিনের সেকেন্ডের হিসাব (15 * 24 * 60 * 60)
  const FIFTEEN_DAYS = 2160000; 

  // ব্রাউজার ক্যাশ হেডার (যাতে ক্লায়েন্ট সাইডেও ১৫ দিন সেভ থাকে)
  const headers = {
    'Cache-Control': `public, max-age=${FIFTEEN_DAYS}, s-maxage=${FIFTEEN_DAYS}, stale-while-revalidate=86400`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses}`, 
      {
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY as string
        },
        // 🔥 ১৫ দিনের সার্ভার ক্যাশ
        next: { revalidate: FIFTEEN_DAYS }
      }
    );

    const data = await response.json();
    const profileMap: Record<string, { profileName: string; pfp: string }> = {};

    if (data) {
      Object.keys(data).forEach((addr) => {
        const user = data[addr][0];
        if (user) {
          profileMap[addr.toLowerCase()] = {
            profileName: user.display_name || user.username, 
            pfp: user.pfp_url
          };
        }
      });
    }

    return NextResponse.json(profileMap, { headers });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
























