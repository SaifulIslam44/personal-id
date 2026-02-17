
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





























//changed upper code is neynar api. 


import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addressesParam = searchParams.get("addresses");

  // যদি অ্যাড্রেস না থাকে, খালি অবজেক্ট দিন
  if (!addressesParam) return NextResponse.json({});

  // ১. ডুপ্লিকেট অ্যাড্রেস রিমুভ এবং লিমিট ১৫
  const addressList = Array.from(new Set(
    addressesParam.split(",").map(a => a.trim().toLowerCase())
  )).slice(0, 15);

  const profileMap: Record<string, { profileName: string; pfp: string }> = {};

  try {
    // ২. প্যারালাল ফেচিং
    await Promise.all(
      addressList.map(async (addr) => {
        try {
          // API কল
          const response = await fetch(
            `https://searchcaster.xyz/api/profiles?connected_address=${addr}`,
            { 
              next: { revalidate: 432000 },
              signal: AbortSignal.timeout(3000) // ৩ সেকেন্ডের বেশি সময় নিলে টাইমআউট করবে (ক্রেডিট/লুপ সেভ করতে)
            }
          );

          // ৩. যদি API সাকসেস হয়
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const user = data[0];
              profileMap[addr] = {
                profileName: user.body.displayName || user.body.username,
                pfp: user.body.avatar || `https://avatar.vercel.sh/${addr}`
              };
              return; // সাকসেস হলে এখানেই শেষ
            }
          }
          
          // ৪. যদি API ফেইল করে বা ডাটা না পায় (Offline Fallback)
          // বারবার কল না করে আমরা একটা ডিফল্ট প্রোফাইল ডাটা সেট করে দিচ্ছি
          profileMap[addr] = {
            profileName: `${addr.substring(0, 6)}...`, // ওয়ালেটের প্রথম ৬ অক্ষর নাম হিসেবে
            pfp: `https://avatar.vercel.sh/${addr}` // ডিফল্ট অভাতার
          };

        } catch {
          // ৫. নেটওয়ার্ক এরর বা টাইমআউট হলেও যেন অফলাইন ডাটা দেখায়
          profileMap[addr] = {
            profileName: "User",
            pfp: `https://avatar.vercel.sh/${addr}`
          };
        }
      })
    );

    return NextResponse.json(profileMap);
  } catch {
    // যেকোনো গ্লোবাল এররে খালি ডাটা যেন ক্র্যাশ না করে
    return NextResponse.json(profileMap);
  }
}