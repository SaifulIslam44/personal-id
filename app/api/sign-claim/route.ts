// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";

// export async function POST(req: NextRequest) {
//   try {
//     // ডাটা রিড করা
//     const body = await req.json();
//     console.log("Incoming Request Body:", body);

//     const { userWallet, fid, giveawayId } = body;

//     // ১. ইনপুট ভ্যালিডেশন (আরও নিখুঁতভাবে)
//     // অনেক সময় ০ (zero) থাকলে সেটাকে ! দিয়ে চেক করলে এরর দেয়, তাই টাইপ চেক করা ভালো
//     if (!userWallet || fid === undefined || fid === null || !giveawayId) {
//       return NextResponse.json(
//         { message: `Missing parameters: wallet=${!!userWallet}, fid=${fid !== undefined}, id=${!!giveawayId}` },
//         { status: 400 }
//       );
//     }

//     // ২. প্রাইভেট কি চেক
//     let privateKey = process.env.SIGNER_PRIVATE_KEY;
//     if (!privateKey) {
//       console.error("SIGNER_PRIVATE_KEY is missing in .env");
//       return NextResponse.json(
//         { message: "Signer key not configured" },
//         { status: 500 }
//       );
//     }

//     if (!privateKey.startsWith("0x")) {
//       privateKey = `0x${privateKey}`;
//     }

//     const wallet = new ethers.Wallet(privateKey);

//     // ৩. সলিডিটি স্টাইল হ্যাশ তৈরি
//     // এখানে BigInt বা Number এ কনভার্ট করে নিশ্চিত করা হচ্ছে যে ডাটা টাইপ ঠিক আছে
//     const messageHash = ethers.utils.solidityKeccak256(
//       ["address", "uint256", "uint256"],
//       [userWallet, fid.toString(), giveawayId.toString()]
//     );

//     // ৪. ইথেরিয়াম সাইন্ড মেসেজ তৈরি
//     const messageHashBinary = ethers.utils.arrayify(messageHash);
//     const signature = await wallet.signMessage(messageHashBinary);

//     console.log("Signature generated successfully for FID:", fid);

//     return NextResponse.json({ signature });

//   } catch (error: any) {
//     console.error("Signing Error Details:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }


















// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     console.log("Incoming Request Body:", body);

//     const { userWallet, fid, giveawayId } = body;

//     // ১. ইনপুট ভ্যালিডেশন
//     if (!userWallet || fid === undefined || fid === null || !giveawayId) {
//       return NextResponse.json(
//         { message: "Missing parameters" },
//         { status: 400 }
//       );
//     }

//     // --- ২. নেনার (Neynar) ভেরিফিকেশন শুরু ---
//     // হ্যাকার অন্য কারও FID দিয়ে নিজের ওয়ালেটে টোকেন নিতে পারবে না
//     const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
//     if (!NEYNAR_API_KEY) {
//       return NextResponse.json({ message: "Neynar API key missing" }, { status: 500 });
//     }

//     const options = {
//       method: 'GET',
//       headers: { accept: 'application/json', api_key: NEYNAR_API_KEY }
//     };

//     // Neynar থেকে ইউজারের ভেরিফাইড ওয়ালেট লিস্ট নিয়ে আসা
//     const neynarResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, options);
//     const neynarData = await neynarResponse.json();

//     if (!neynarData.users || neynarData.users.length === 0) {
//       return NextResponse.json({ message: "Invalid FID" }, { status: 400 });
//     }

//     // ওই FID-এর সাথে কানেক্টেড সব ইথেরিয়াম অ্যাড্রেস বের করা
//     const verifiedAddresses = neynarData.users[0].verified_addresses.eth_addresses.map((addr: string) => addr.toLowerCase());
//     const custodianAddress = neynarData.users[0].custody_address?.toLowerCase(); // কুস্টডি অ্যাড্রেসও চেক করা ভালো

//     // রিকোয়েস্ট পাঠানো ওয়ালেটটি কি ভেরিফাইড লিস্টে আছে?
//     const isOwner = verifiedAddresses.includes(userWallet.toLowerCase()) || custodianAddress === userWallet.toLowerCase();

//     if (!isOwner) {
//       console.warn(`Hacker Alert! Wallet ${userWallet} tried to use FID ${fid}`);
//       return NextResponse.json(
//         { message: "এই ওয়ালেটটি আপনার ফারকাস্টার প্রোফাইলে ভেরিফাইড নয়!" },
//         { status: 403 }
//       );
//     }
    

//     // ৩. প্রাইভেট কি চেক
//     let privateKey = process.env.SIGNER_PRIVATE_KEY;
//     if (!privateKey) {
//       return NextResponse.json({ message: "Signer key not configured" }, { status: 500 });
//     }

//     if (!privateKey.startsWith("0x")) {
//       privateKey = `0x${privateKey}`;
//     }

//     const wallet = new ethers.Wallet(privateKey);

//     // ৪. সলিডিটি স্টাইল হ্যাশ তৈরি
//     const messageHash = ethers.utils.solidityKeccak256(
//       ["address", "uint256", "uint256"],
//       [userWallet, fid.toString(), giveawayId.toString()]
//     );

//     // ৫. ইথেরিয়াম সাইন্ড মেসেজ তৈরি
//     const messageHashBinary = ethers.utils.arrayify(messageHash);
//     const signature = await wallet.signMessage(messageHashBinary);

//     console.log("Verified Signature generated for FID:", fid);

//     return NextResponse.json({ signature });

//   } catch (error: any) {
//     console.error("Signing Error Details:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }












import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

// --- হেল্পার ফাংশন: Retry Logic ---
// এটি ৩ বার চেষ্টা করবে Neynar থেকে ডাটা আনার জন্য। যদি ৩ বারই ফেইল করে, তবে এরর থ্রো করবে।
async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      // যদি রেসপন্স OK (200) হয়, তবে রিটার্ন করবে
      if (response.ok) {
        return response;
      }
      console.warn(`⚠️ Neynar API attempt ${i + 1} failed with status: ${response.status}`);
    } catch {
      console.warn(`⚠️ Neynar API network error on attempt ${i + 1}`);
    }
    // ১ সেকেন্ড অপেক্ষা করে আবার চেষ্টা করবে
    if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
  }
  // ৩ বার চেষ্টার পর ফেইল করলে
  throw new Error("Neynar API is Unreachable after multiple attempts");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ১. ইনপুট স্যানিটাইজেশন
    const { userWallet, fid, giveawayId } = body;
    const targetWallet = userWallet ? userWallet.toLowerCase() : "";

    console.log(`\n🛡️ --- SECURE CLAIM REQUEST STARTED ---`);
    console.log(`👤 Target FID: ${fid}`);
    console.log(`💼 Claiming Wallet: ${targetWallet}`);
    console.log(`🆔 Giveaway ID: ${giveawayId}`);

    // ২. প্যারামিটার ভ্যালিডেশন
    if (!targetWallet || !fid || !giveawayId) {
      console.error("❌ Error: Missing parameters");
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // ৩. Neynar API Key চেক
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
    if (!NEYNAR_API_KEY) {
      console.error("❌ Error: Server Config Missing (Neynar Key)");
      // ক্রিটিকাল কনফিগ মিসিং, তাই প্রোসেস বন্ধ
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // ৪. Neynar থেকে রিয়েল-টাইম ডাটা আনা (Fail-Safe Mode)
    let neynarData;
    try {
      // এখানে আমরা Retry Function ব্যবহার করছি
      const neynarResponse = await fetchWithRetry(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, 
        {
          method: 'GET',
          headers: { accept: 'application/json', api_key: NEYNAR_API_KEY }
        }
      );
      neynarData = await neynarResponse.json();
    } catch {
      // ৫. Strict Fail-Safe Block
      // যদি Neynar কানেক্ট না করা যায়, আমরা কোনোভাবেই সামনে এগোব না।
      console.error("🔥 CRITICAL FAILURE: Neynar API is down or unreachable.");
      return NextResponse.json(
        { message: "Verification Service Unavailable. Please try again later." }, 
        { status: 503 } // 503 মানে সার্ভিস এখন ডাউন
      );
    }

    // FID ভ্যালিড কিনা চেক করা (Neynar রেসপন্স দিলেও ডাটা নাও থাকতে পারে)
    if (!neynarData.users || neynarData.users.length === 0) {
      console.error(`❌ Error: Invalid FID ${fid} (User not found in Neynar)`);
      return NextResponse.json({ message: "Invalid FID provided" }, { status: 400 });
    }

    const user = neynarData.users[0];

    // ৬. সিকিউরিটি চেকলিস্ট তৈরি (Whitelist)
    const allowedWallets: string[] = [];

    // Custody Address যোগ করা
    if (user.custody_address) {
      allowedWallets.push(user.custody_address.toLowerCase());
    }

    // Verified Addresses (ETH) যোগ করা
    if (user.verified_addresses?.eth_addresses) {
      const verifiedEth = user.verified_addresses.eth_addresses.map((addr: string) => addr.toLowerCase());
      allowedWallets.push(...verifiedEth);
    }

    console.log(`📋 Allowed Wallets for FID ${fid}:`, allowedWallets);

    // ৭. মালিকানা যাচাই (Strict Ownership Check)
    const isOwner = allowedWallets.includes(targetWallet);

    if (!isOwner) {
      console.error(`🚨 SECURITY BLOCK: Wallet ${targetWallet} does NOT belong to FID ${fid}`);
      return NextResponse.json(
        { message: "Security Alert: This wallet is not linked to the provided Farcaster ID." },
        { status: 403 }
      );
    }

    console.log(`✅ Ownership Verified! User is legit.`);

    // ৮. প্রাইভেট কি কনফিগারেশন
    let privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) {
      console.error("❌ Error: Signer Key Missing");
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

    if (!privateKey.startsWith("0x")) {
      privateKey = `0x${privateKey}`;
    }

    // ৯. সিগনেচার জেনারেট
    const wallet = new ethers.Wallet(privateKey);

    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      [targetWallet, fid.toString(), giveawayId.toString()]
    );

    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await wallet.signMessage(messageHashBinary);

    console.log(`✍️ Signature Generated Successfully for ${targetWallet}`);
    console.log(`🏁 --- REQUEST ENDED ---\n`);

    return NextResponse.json({ signature });

  } catch (error: any) {
    // ১০. গ্লোবাল ফেইল সেফ (Global Fail Safe)
    // কোডের অন্য কোথাও যদি ক্র্যাশ করে, তবুও সিগনেচার যেন না যায়
    console.error("💥 Critical Unhandled Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: "Security Check Failed" },
      { status: 500 }
    );
  }
}