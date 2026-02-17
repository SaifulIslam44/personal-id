//Neynar Api main code:

// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) return NextResponse.json({ error: "FID missing" }, { status: 400 });

//   try {
//     const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//       headers: {
//         'accept': 'application/json',
//         'api_key': process.env.NEYNAR_API_KEY as string
//       },
//       next: { revalidate: 86400 }
//     });

//     const data = await response.json();
    
//     // Neynar JSON-এর 'users' অ্যারে থেকে প্রথম ইউজারের স্কোর নেওয়া
//     if (data.users && data.users.length > 0) {
//       const user = data.users[0];
//       return NextResponse.json({ 
//         score: user.score || 0,
//         username: user.username,
//         fid: user.fid 
//       });
//     }

//     return NextResponse.json({ score: 0 });
//   } catch (_error) {
//     console.error("Score Error:", _error);
//     return NextResponse.json({ score: 0 });
//   }
// }

























//changed upper code is neynar api. 


import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  // ১. FID না থাকলে সরাসরি এরর
  if (!fid) return NextResponse.json({ error: "FID missing" }, { status: 400 });

  // ২. অফলাইন বা ফেইল করলে যে ডাটা দেখাবে (Fallback Data)
  const fallbackData = {
    score: 0,
    username: "farcaster_user",
    fid: Number(fid),
    displayName: `User ${fid}`,
    pfpUrl: `https://avatar.vercel.sh/${fid}`, // ডিফল্ট অভাতার
    offline: true
  };

  try {
    // ৩. Warpcast API কল উইথ টাইমআউট (৩ সেকেন্ড)
    const response = await fetch(`https://api.warpcast.com/v2/user?fid=${fid}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000) // ৩ সেকেন্ড পর নিজে থেকেই রিকোয়েস্ট বন্ধ হবে
    });

    // ৪. যদি এপিআই ঠিকঠাক ডাটা দেয়
    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result.user) {
        const user = data.result.user;
        return NextResponse.json({ 
          score: 0, 
          username: user.username,
          fid: user.fid,
          displayName: user.displayName,
          pfpUrl: user.pfp?.url || fallbackData.pfpUrl
        });
      }
    }

    // ৫. যদি ইউজার না পাওয়া যায় বা এপিআই এরর দেয়
    return NextResponse.json(fallbackData);

  } catch (_error) {
    // ৬. নেটওয়ার্ক ফেইল বা টাইমআউট হলে এখানে আসবে
    console.error("Fetch Error or Timeout:", _error);
    
    // লুপ বা বারবার কল হওয়া আটকাতে সরাসরি অফলাইন ডাটা রিটার্ন
    return NextResponse.json(fallbackData);
  }
}