



// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";

// // --- হেল্পার ফাংশন: Retry Logic (Neynar API এর জন্য) ---
// async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, options);
//       if (response.ok) {
//         return response;
//       }
//       console.warn(`⚠️ Neynar API attempt ${i + 1} failed with status: ${response.status}`);
//     } catch {
//       console.warn(`⚠️ Neynar API network error on attempt ${i + 1}`);
//     }
//     if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
//   }
//   throw new Error("Neynar API is Unreachable after multiple attempts");
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
    
//     // ১. ইনপুট স্যানিটাইজেশন
//     const { userWallet, fid, giveawayId } = body;
//     const targetWallet = userWallet ? userWallet.toLowerCase() : "";

//     console.log(`\n🛡️ --- SECURE CLAIM REQUEST WITH NONCE STARTED ---`);
//     console.log(`👤 Target FID: ${fid}`);
//     console.log(`💼 Claiming Wallet: ${targetWallet}`);
//     console.log(`🆔 Giveaway ID: ${giveawayId}`);

//     // ২. প্যারামিটার ভ্যালিডেশন
//     if (!targetWallet || !fid || !giveawayId) {
//       return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
//     }

//     // ৩. Neynar API Key চেক
//     const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
//     if (!NEYNAR_API_KEY) {
//       console.error("❌ Error: Server Config Missing (Neynar Key)");
//       return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
//     }

//     // ৪. Neynar থেকে রিয়েল-টাইম ডাটা আনা (Fail-Safe Mode)
//     let neynarData;
//     try {
//       const neynarResponse = await fetchWithRetry(
//         `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, 
//         {
//           method: 'GET',
//           headers: { accept: 'application/json', api_key: NEYNAR_API_KEY }
//         }
//       );
//       neynarData = await neynarResponse.json();
//     } catch {
//       console.error("🔥 CRITICAL FAILURE: Neynar API is down or unreachable.");
//       return NextResponse.json(
//         { message: "Verification Service Unavailable. Please try again later." }, 
//         { status: 503 }
//       );
//     }

//     // FID ভ্যালিড কিনা চেক করা
//     if (!neynarData.users || neynarData.users.length === 0) {
//       console.error(`❌ Error: Invalid FID ${fid}`);
//       return NextResponse.json({ message: "Invalid FID provided" }, { status: 400 });
//     }

//     const user = neynarData.users[0];

//     // ৬. সিকিউরিটি চেকলিস্ট (Ownership Verification)
//     const allowedWallets: string[] = [];

//     // Custody Address
//     if (user.custody_address) {
//       allowedWallets.push(user.custody_address.toLowerCase());
//     }

//     // Verified Addresses
//     if (user.verified_addresses?.eth_addresses) {
//       const verifiedEth = user.verified_addresses.eth_addresses.map((addr: string) => addr.toLowerCase());
//       allowedWallets.push(...verifiedEth);
//     }

//     console.log(`📋 Allowed Wallets for FID ${fid}:`, allowedWallets);

//     // ৭. মালিকানা যাচাই
//     const isOwner = allowedWallets.includes(targetWallet);

//     if (!isOwner) {
//       console.error(`🚨 SECURITY BLOCK: Wallet ${targetWallet} does NOT belong to FID ${fid}`);
//       return NextResponse.json(
//         { message: "Security Alert: This wallet is not linked to the provided Farcaster ID." },
//         { status: 403 }
//       );
//     }

//     console.log(`✅ Ownership Verified! User is legit.`);

//     // ৮. প্রাইভেট কি কনফিগারেশন
//     let privateKey = process.env.SIGNER_PRIVATE_KEY;
//     if (!privateKey) {
//       console.error("❌ Error: Signer Key Missing");
//       return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
//     if (!privateKey.startsWith("0x")) {
//       privateKey = `0x${privateKey}`;
//     }

//     // 🔥🔥 ৯. নতুন: Nonce জেনারেট করা (Replay Attack ঠেকানোর জন্য) 🔥🔥
//     // এটি প্রতিবার একটি নতুন র্যান্ডম নাম্বার তৈরি করবে
//     const nonce = Math.floor(Math.random() * 1000000000000000); 
//     console.log(`🔢 Generated Secure Nonce: ${nonce}`);

//     // ১০. সিগনেচার জেনারেট (Nonce সহ)
//     const wallet = new ethers.Wallet(privateKey);

//     // হ্যাশ তৈরি: [address, fid, giveawayId, nonce]
//     // এটি অবশ্যই স্মার্ট কন্ট্রাক্টের অর্ডারের সাথে মিলতে হবে
//     const messageHash = ethers.utils.solidityKeccak256(
//       ["address", "uint256", "uint256", "uint256"], // Types
//       [targetWallet, fid.toString(), giveawayId.toString(), nonce.toString()] // Values
//     );

//     const messageHashBinary = ethers.utils.arrayify(messageHash);
//     const signature = await wallet.signMessage(messageHashBinary);

//     console.log(`✍️ Signature Generated Successfully for ${targetWallet} with Nonce ${nonce}`);
//     console.log(`🏁 --- REQUEST ENDED ---\n`);

//     // ১১. ফ্রন্টএন্ডে সিগনেচার এবং ননস দুটিই পাঠাতে হবে
//     return NextResponse.json({ signature, nonce });

//   } catch (error: any) {
//     console.error("💥 Critical Unhandled Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: "Security Check Failed" },
//       { status: 500 }
//     );
//   }
// }















// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";
// import connectDB from "@/lib/db";
// import ShareLog from "@/models/ShareLog";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// // --- হেল্পার ফাংশন: Retry Logic (Neynar API এর জন্য) ---
// async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, options);
//       if (response.ok) return response;
//     } catch { /* ignore */ }
//     if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
//   }
//   throw new Error("Neynar API Unreachable");
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { userWallet, fid, giveawayId } = body;
//     const targetWallet = userWallet ? userWallet.toLowerCase() : "";

//     console.log(`\n🛡️ --- SECURE CLAIM REQUEST STARTED (FID: ${fid}) ---`);

//     if (!targetWallet || !fid || !giveawayId) {
//       return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
//     }

//     // ১. Neynar API চেক (User Validation)
//     const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
//     if (!NEYNAR_API_KEY) return NextResponse.json({ message: "Config Error" }, { status: 500 });

//     let user;
//     try {
//       const response = await fetchWithRetry(
//         `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, 
//         { method: 'GET', headers: { accept: 'application/json', api_key: NEYNAR_API_KEY } }
//       );
//       const data = await response.json();
//       if (!data.users || data.users.length === 0) throw new Error("Invalid FID");
//       user = data.users[0];
//     } catch (err) {
//       console.error("🔥 Neynar Error:", err);
//       return NextResponse.json({ message: "Verification Failed" }, { status: 503 });
//     }

//     // ২. Ownership Check
//     const allowedWallets = [
//       user.custody_address?.toLowerCase(),
//       ...(user.verified_addresses?.eth_addresses?.map((a: string) => a.toLowerCase()) || [])
//     ].filter(Boolean);

//     if (!allowedWallets.includes(targetWallet)) {
//       console.error(`🚨 Wallet Mismatch: ${targetWallet} not owned by FID ${fid}`);
//       return NextResponse.json({ message: "Wallet not linked to Farcaster ID" }, { status: 403 });
//     }
//     console.log(`✅ Ownership Verified.`);

//     // 🔥🔥🔥 ৩. (FIXED) Blockchain Connection & Bonus Logic 🔥🔥🔥
    
//     // Alchemy RPC URL
//     const ALCHEMY_URL = "https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH";
    
//     let claimCount = 0;

//     try {
//         // ফিক্স: StaticJsonRpcProvider ব্যবহার করছি এবং সরাসরি Network ID (8453) বলে দিচ্ছি।
//         // এতে এটি 'detectNetwork' কল করবে না, তাই ফেইল হবে না।
//         const provider = new ethers.providers.StaticJsonRpcProvider(
//             {
//                 url: ALCHEMY_URL,
//                 skipFetchSetup: true, // Next.js এর জন্য অপটিমাইজেশন
//             }, 
//             {
//                 chainId: 8453,
//                 name: "base"
//             }
//         );

//         const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
//         // স্মার্ট কন্ট্রাক্ট রিড
//         const userStats = await contract.getUserStats(BigInt(giveawayId), targetWallet);
//         claimCount = Number(userStats[1]); // ২য় ভ্যালু হলো claimCount

//         console.log(`📊 Contract Read Success! Claim Count: ${claimCount}`);

//     } catch (err: any) {
//         console.error("⚠️ Blockchain Read Failed:", err.reason || err.message);
//         // যদি কন্ট্রাক্ট রিড ফেইল করে, তবে নিরাপত্তার স্বার্থে আমরা এটিকে ব্লক করব।
//         // আগেরবার এটি ছেড়ে দিচ্ছিল বলে সমস্যা হচ্ছিল।
//         return NextResponse.json(
//             { message: "System busy checking claim history. Please try again." }, 
//             { status: 500 }
//         );
//     }

//     // লজিক: ১ বার বা তার বেশি নিয়ে থাকলে শেয়ার চেক হবে
//     if (claimCount >= 1) {
//             console.log("🔍 Bonus Claim: Checking Database...");
//             await connectDB();
            
//             const hasShared = await ShareLog.findOne({ fid: fid.toString() });

//             if (!hasShared) {
//                 console.error(`⛔ Bonus Blocked: FID ${fid} hasn't shared.`);
//                 return NextResponse.json(
//                     { message: "Bonus Locked: Verify share first!" }, 
//                     { status: 403 }
//                 );
//             }
//             console.log(`✅ Bonus Authorized: Share Log Found.`);
//     } else {
//             console.log(`✅ First Claim: Allowed (No Share Needed).`);
//     }

//     // 🔥🔥🔥 চেকিং শেষ 🔥🔥🔥

//     // ৪. সিগনেচার জেনারেট
//     const privateKey = process.env.SIGNER_PRIVATE_KEY;
//     if (!privateKey) return NextResponse.json({ message: "Server Error" }, { status: 500 });

//     const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
//     const nonce = Math.floor(Math.random() * 1000000000000000); 

//     const messageHash = ethers.utils.solidityKeccak256(
//       ["address", "uint256", "uint256", "uint256"], 
//       [targetWallet, fid.toString(), giveawayId.toString(), nonce.toString()] 
//     );

//     const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

//     console.log(`✍️ Signature Sent.`);
//     return NextResponse.json({ signature, nonce });

//   } catch (error) {
//     console.error("💥 Server Error:", error);
//     return NextResponse.json({ error: "Internal Error" }, { status: 500 });
//   }
// }






















import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import connectDB from "@/lib/db";
import ShareLog from "@/models/ShareLog";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// --- হেল্পার ফাংশন: Retry Logic (Neynar API এর জন্য) ---
async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
  const cachedOptions = { 
    ...options, 
    next: { revalidate: 86400 } // ২৪ ঘণ্টা ক্যাশ
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, cachedOptions);
      if (response.ok) return response;
      
      // যদি লিমিট শেষ হয় বা অন্য সার্ভার এরর দেয়, তবেই রিট্রাই করবে
      console.warn(`Retry attempt ${i + 1} for Neynar...`);
    } catch (err) {
      if (i === retries - 1) throw err;
    }
    if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
  }
  throw new Error("Neynar API Unreachable");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userWallet, fid, giveawayId } = body;
    const targetWallet = userWallet ? userWallet.toLowerCase() : "";

    console.log(`\n🛡️ --- SECURE CLAIM REQUEST STARTED (FID: ${fid}) ---`);

    if (!targetWallet || !fid || !giveawayId) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // ১. Neynar API চেক (User Validation)
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
    if (!NEYNAR_API_KEY) return NextResponse.json({ message: "Config Error" }, { status: 500 });

    let user;
    try {
      const response = await fetchWithRetry(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, 
        { method: 'GET', headers: { accept: 'application/json', api_key: NEYNAR_API_KEY } }
      );
      const data = await response.json();
      if (!data.users || data.users.length === 0) throw new Error("Invalid FID");
      user = data.users[0];
    } catch (err) {
      console.error("🔥 Neynar Error:", err);
      return NextResponse.json({ message: "Verification Failed" }, { status: 503 });
    }

    // ২. Ownership Check
    const allowedWallets = [
      user.custody_address?.toLowerCase(),
      ...(user.verified_addresses?.eth_addresses?.map((a: string) => a.toLowerCase()) || [])
    ].filter(Boolean);

    if (!allowedWallets.includes(targetWallet)) {
      console.error(`🚨 Wallet Mismatch: ${targetWallet} not owned by FID ${fid}`);
      return NextResponse.json({ message: "Wallet not linked to Farcaster ID" }, { status: 403 });
    }
    console.log(`✅ Ownership Verified.`);

    // 🔥🔥🔥 ৩. (FIXED) Blockchain Connection & Bonus Logic 🔥🔥🔥
    
    // Alchemy RPC URL
    const ALCHEMY_URL = "https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH";
    
    let claimCount = 0;

    try {
        // ফিক্স: StaticJsonRpcProvider ব্যবহার করছি এবং সরাসরি Network ID (8453) বলে দিচ্ছি।
        // এতে এটি 'detectNetwork' কল করবে না, তাই ফেইল হবে না।
        const provider = new ethers.providers.StaticJsonRpcProvider(
            {
                url: ALCHEMY_URL,
                skipFetchSetup: true, // Next.js এর জন্য অপটিমাইজেশন
            }, 
            {
                chainId: 8453,
                name: "base"
            }
        );

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
        // স্মার্ট কন্ট্রাক্ট রিড
        const userStats = await contract.getUserStats(BigInt(giveawayId), targetWallet);
        claimCount = Number(userStats[1]); // ২য় ভ্যালু হলো claimCount

        console.log(`📊 Contract Read Success! Claim Count: ${claimCount}`);

    } catch (err: any) {
        console.error("⚠️ Blockchain Read Failed:", err.reason || err.message);
        // যদি কন্ট্রাক্ট রিড ফেইল করে, তবে নিরাপত্তার স্বার্থে আমরা এটিকে ব্লক করব।
        // আগেরবার এটি ছেড়ে দিচ্ছিল বলে সমস্যা হচ্ছিল।
        return NextResponse.json(
            { message: "System busy checking claim history. Please try again." }, 
            { status: 500 }
        );
    }

    // লজিক: ১ বার বা তার বেশি নিয়ে থাকলে শেয়ার চেক হবে
    if (claimCount >= 1) {
            console.log("🔍 Bonus Claim: Checking Database...");
            await connectDB();
            
            const hasShared = await ShareLog.findOne({ fid: fid.toString() });

            if (!hasShared) {
                console.error(`⛔ Bonus Blocked: FID ${fid} hasn't shared.`);
                return NextResponse.json(
                    { message: "Bonus Locked: Verify share first!" }, 
                    { status: 403 }
                );
            }
            console.log(`✅ Bonus Authorized: Share Log Found.`);
    } else {
            console.log(`✅ First Claim: Allowed (No Share Needed).`);
    }

    // 🔥🔥🔥 চেকিং শেষ 🔥🔥🔥

    // ৪. সিগনেচার জেনারেট
    const privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) return NextResponse.json({ message: "Server Error" }, { status: 500 });

    const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
    const nonce = Math.floor(Math.random() * 1000000000000000); 

    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256"], 
      [targetWallet, fid.toString(), giveawayId.toString(), nonce.toString()] 
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

    console.log(`✍️ Signature Sent.`);
    return NextResponse.json({ signature, nonce });

  } catch (error) {
    console.error("💥 Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}