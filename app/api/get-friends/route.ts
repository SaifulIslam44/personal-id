// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) return NextResponse.json({ usernames: [] });

//   try {
//     // এই এন্ডপয়েন্টটি সবচেয়ে স্ট্যাবল এবং আপনার আগে কাজ করেছিল
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
//       {
//         method: "GET",
//         headers: {
//           "accept": "application/json",
//           "api_key": process.env.NEYNAR_API_KEY as string,
//         },
//       }
//     );

//     if (!response.ok) throw new Error("API Key or Network Error");

//     const data = await response.json();
    
//     // আপনার দেওয়া আগের JSON ফরম্যাট অনুযায়ী ম্যাপিং
//     const rawUsers = data.users || [];

//     let usernames = rawUsers
//       .map((u: any) => u.username)
//       .filter((name: any) => !!name)
//       .slice(0, 3);

//     // যদি এপিআই থেকে ডাটা না আসে
//     if (usernames.length === 0) {
//       usernames = ["saifulislamsany", "stlifestyle", "base"]; 
//     }

//     return NextResponse.json({ usernames });
//   } catch (error) {
//     return NextResponse.json({ usernames: ["saifulislamsany", "stlifestyle"] });
//   }
// }


















// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) return NextResponse.json({ usernames: [] });

//   try {
//     // Warpcast এর পাবলিক সার্চ এপিআই যা ইউজারের ফলোয়িং লিস্ট সরাসরি দেয়
//     const response = await fetch(
//       `https://client.warpcast.com/v2/following?fid=${fid}&limit=10`,
//       {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const data = await response.json();
    
//     // Warpcast রেসপন্স স্ট্রাকচার অনুযায়ী ইউজারনেম বের করা
//     const rawUsers = data.result?.users || [];
    
//     const usernames = rawUsers
//       .map((u: any) => u.username)
//       .filter((name: string) => !!name)
//       .slice(0, 3); // টপ ৩ জন

//     return NextResponse.json({ usernames });

//   } catch (error: any) {
//     console.error("Warpcast API Error:", error.message);
//     return NextResponse.json({ usernames: [] });
//   }
// }















// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) return NextResponse.json({ usernames: [] });

//   try {
//     const response = await fetch(
//       `https://client.warpcast.com/v2/following?fid=${fid}&limit=100`,
//       {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         cache: 'no-store'
//       }
//     );

//     const data = await response.json();
//     const rawUsers = data.result?.users || [];
    
//     if (rawUsers.length === 0) return NextResponse.json({ usernames: [] });

//     // ১. অ্যাক্টিভ ইউজার ফিল্টার করা (Bio আছে এবং যারা বট নয়)
//     const activeUsers = rawUsers.filter((u: any) => {
//       // যাদের প্রোফাইল কমপ্লিট এবং অন্তত কিছু ফলোয়ার আছে তাদের অ্যাক্টিভ ধরা হচ্ছে
//       return u.profile?.bio?.text && u.followerCount > 10;
//     });

//     // ২. যদি অ্যাক্টিভ ইউজার পাওয়া যায়, তাদের থেকে ইউজারনেম নেওয়া, নাহলে মেইন লিস্ট থেকে নেওয়া
//     const poolToShuffle = activeUsers.length >= 3 ? activeUsers : rawUsers;

//     let usernames = poolToShuffle
//       .map((u: any) => u.username)
//       .filter((name: string) => !!name);

//     // ৩. Fisher-Yates Shuffle
//     for (let i = usernames.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [usernames[i], usernames[j]] = [usernames[j], usernames[i]];
//     }

//     // ৪. টপ ৩ জন অ্যাক্টিভ ও র‍্যান্ডম ইউজার
//     const randomThree = usernames.slice(0, 3);

//     return NextResponse.json({ usernames: randomThree });

//   } catch (_error) {
//     return NextResponse.json({ usernames: [] });
//   }
// }











import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) return NextResponse.json({ usernames: [] });

  try {
    // ১. আপনার ফলোয়িং লিস্ট থেকে ১০০ জন ইউজার নিয়ে আসছি
    const response = await fetch(
      `https://client.warpcast.com/v2/following?fid=${fid}&limit=100`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    const rawUsers = data.result?.users || [];
    
    if (rawUsers.length === 0) return NextResponse.json({ usernames: [] });

    // ২. একটিভ ইউজারদের ফিল্টার করা (যাদের Power Badge আছে অথবা Bio আছে)
    // pfp (Profile Picture) এবং Bio থাকলে তাকে 'একটিভ' ধরা হচ্ছে
    const activeUsers = rawUsers.filter((u: any) => {
      const hasBio = u.profile?.bio?.text && u.profile.bio.text.length > 2;
      const isPowerUser = u.isPowerUser === true; // Warpcast Power Badge
      return isPowerUser || hasBio;
    });

    // ৩. যদি একটিভ ইউজার পাওয়া যায় তবে তাদের থেকে নেওয়া হবে, নাহলে মেইন লিস্ট থেকে
    const userPool = activeUsers.length >= 10 ? activeUsers : rawUsers;

    // ৪. Fisher-Yates Shuffle লজিক (৫০-১০০ জন থেকে ওলটপালট করা)
    for (let i = userPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [userPool[i], userPool[j]] = [userPool[j], userPool[i]];
    }

    // ৫. টপ ৩ জন ডাইনামিক ইউজারনেম বের করা
    const usernames = userPool
      .slice(0, 3)
      .map((u: any) => u.username)
      .filter((name: string) => !!name);

    return NextResponse.json({ usernames });

  } catch {
    // ESLint error এড়াতে _error ব্যবহার করা হয়েছে
    return NextResponse.json({ usernames: [] });
  }
}