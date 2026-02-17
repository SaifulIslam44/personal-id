




//neynar API main code: 

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import ShareLog from "@/models/ShareLog";
// import ShareBackup from "@/models/ShareBackup"; // ১. নতুন ব্যাকআপ মডেল ইমপোর্ট

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");
//   const APP_ID = "WbTVgaQ34L1m"; 

//   if (!fid) return NextResponse.json({ success: false, error: "FID missing" });

//   try {
//     // ১. ডাটাবেস কানেক্ট করা
//     await connectDB();

//     // ২. Neynar API থেকে কাস্ট ফেচ করা
//     const response = await fetch(
//       `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=10`,
//       {
//         headers: {
//           accept: "application/json",
//           api_key: process.env.NEYNAR_API_KEY || "",
//         },
//         // ১৫ সেকেন্ডের জন্য ইন্টারনাল ক্যাশ (ক্রেডিট সেভ হবে)
//         next: { revalidate: 15 } 
//       }
//     );

//     const data = await response.json();

//     if (!data.casts || data.casts.length === 0) {
//       return NextResponse.json({ success: false, message: "No casts found" });
//     }

//     // ৩. শেয়ার ভেরিফিকেশন লজিক
//     const validCast = data.casts.find((cast: any) => {
//       const inText = cast.text.includes(APP_ID);
//       const inEmbeds = cast.embeds?.some((embed: any) => 
//         embed.url && embed.url.includes(APP_ID)
//       );

//       // ৫ মিনিটের টাইম চেক
//       const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
//       const isRecent = new Date(cast.timestamp).getTime() > fiveMinutesAgo;

//       return (inText || inEmbeds) && isRecent;
//     });

//     // ৪. যদি শেয়ার পাওয়া যায়
//     if (validCast) {
//       const authorUsername = validCast.author?.username || "unknown";
//       const verifiedWallet = validCast.author?.verified_addresses?.eth_addresses?.[0];
//       const custodyWallet = validCast.author?.custody_address;
      
//       const shareData = {
//           fid: fid,
//           username: authorUsername,
//           walletAddress: verifiedWallet || custodyWallet || "not found",
//           castHash: validCast.hash,
//           timestamp: new Date(validCast.timestamp)
//       };

//       // ৫. ডাটাবেসে সেভ (Parallel saving for speed)
//       await Promise.all([
//         ShareLog.create(shareData),    // ৫ মিনিট পর ডিলিট হবে (ক্লেইম লজিকের জন্য)
//         ShareBackup.create(shareData)  // আজীবন থাকবে (রেকর্ড বা অডিটের জন্য)
//       ]);

//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ success: false });
//   } catch (error) {
//     console.error("Log Error:", error);
//     return NextResponse.json({ success: false, error: "Server Error" });
//   }
// }





















//changed upper code is neynar api. 


import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ShareLog from "@/models/ShareLog";
import ShareBackup from "@/models/ShareBackup";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  
  // এই প্যারামিটারগুলো আপনার ফ্রন্টএন্ড থেকে পাঠাতে হবে (ঐচ্ছিক)
  const username = searchParams.get("username") || "unknown";
  const wallet = searchParams.get("wallet") || "not_provided";

  if (!fid) return NextResponse.json({ success: false, error: "FID missing" });

  try {
    // ১. ডাটাবেস কানেক্ট করা
    await connectDB();

    // ২. চেক করা যে ইউজার অলরেডি ডাটাবেসে আছে কি না
    const existingLog = await ShareLog.findOne({ fid: fid.toString() });

    if (existingLog) {
      // যদি ডাটাবেসে পাওয়া যায় (মানে এটা তার দ্বিতীয় ক্লিক)
      console.log(`✅ FID ${fid} Verified from database.`);
      return NextResponse.json({ success: true, message: "Verified!" });
    } else {
      // ৩. যদি ডাটাবেসে না থাকে (মানে প্রথম ক্লিক), তবে এখন সেভ করো
      console.log(`📝 FID ${fid} not found. Saving to database for verification...`);
      
      const shareData = {
          fid: fid.toString(),
          username: username,
          walletAddress: wallet.toLowerCase(),
          castHash: `manual_${Date.now()}`,
          timestamp: new Date()
      };

      // ডাটাবেসে এন্ট্রি তৈরি করা
      await Promise.all([
        ShareLog.create(shareData),
        ShareBackup.create(shareData)
      ]);

      // ইউজারকে একটা মেসেজ দিন যেন সে আবার ক্লিক করে
      return NextResponse.json({ 
        success: false, 
        message: "Step 1 complete! Please press Verify again to confirm." 
      });
    }

  } catch (error) {
    console.error("Log Error:", error);
    return NextResponse.json({ success: false, error: "Server Error" });
  }
}

















