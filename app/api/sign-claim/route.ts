//neynar API main code:

// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";
// import connectDB from "@/lib/db";
// import ShareLog from "@/models/ShareLog";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// // --- হেল্পার ফাংশন: Retry Logic (Neynar API এর জন্য) ---
// async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
//   const cachedOptions = { 
//     ...options, 
//     next: { revalidate: 86400 } // ২৪ ঘণ্টা ক্যাশ
//   };

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, cachedOptions);
//       if (response.ok) return response;
      
//       // যদি লিমিট শেষ হয় বা অন্য সার্ভার এরর দেয়, তবেই রিট্রাই করবে
//       console.warn(`Retry attempt ${i + 1} for Neynar...`);
//     } catch (err) {
//       if (i === retries - 1) throw err;
//     }
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
















// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";
// import connectDB from "@/lib/db";
// import ShareLog from "@/models/ShareLog";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// // --- হেল্পার ফাংশন: Retry Logic (Neynar API এর জন্য) ---
// async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
//   const cachedOptions = { 
//     ...options, 
//     next: { revalidate: 86400 } // ২৪ ঘণ্টা ক্যাশ
//   };

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, cachedOptions);
//       if (response.ok) return response;
      
//       // যদি লিমিট শেষ হয় বা অন্য সার্ভার এরর দেয়, তবেই রিট্রাই করবে
//       console.warn(`Retry attempt ${i + 1} for Neynar...`);
//     } catch (err) {
//       if (i === retries - 1) throw err;
//     }
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















//last used farcaster code


// import { NextRequest, NextResponse } from "next/server";
// import { ethers } from "ethers";
// import connectDB from "@/lib/db";
// import ShareLog from "@/models/ShareLog";
// import SignatureLog from "@/models/SignatureLog"; 
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// // --- হেল্পার ফাংশন: Retry Logic ---
// async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
//   const cachedOptions = { 
//     ...options, 
//     next: { revalidate: 86400 } 
//   };

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await fetch(url, cachedOptions);
//       if (response.ok) return response;
//       console.warn(`Retry attempt ${i + 1} for Neynar...`);
//     } catch (err) {
//       if (i === retries - 1) throw err;
//     }
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

//     // ১. ডাটাবেস কানেকশন (সবার আগে)
//     await connectDB();

//     // 🔥🔥🔥 STEP 1: ATOMIC LOCK (BOT & BYPASS PROTECTION) 🔥🔥🔥
//     // এটা চেক করবে ইউজার গত ৫ মিনিটের মধ্যে এই এপিআইতে হিট করেছে কিনা।
    
//     let isStrictCheckNeeded = false;

//     // আমরা ডাটাবেসে এন্ট্রি আপডেট করার চেষ্টা করব
//     const existingSignatureLog = await SignatureLog.findOneAndUpdate(
//       { fid: fid.toString(), giveawayId: giveawayId.toString() }, // খোঁজো
//       { $set: { lastAttempt: new Date() } }, // টাইম আপডেট করো
//       { upsert: true, returnDocument: 'before', setDefaultsOnInsert: true } 
//     );

//     // ব্যাখ্যা: 
//     // যদি 'existingSignatureLog' ডাটা থাকে, তার মানে ইউজার গত ৫ মিনিটের মধ্যে একবার এসেছিল।
//     // তখন আমরা তাকে সন্দেহ করব (Strict Mode)।
//     // আর যদি 'null' আসে, তার মানে সে ৫ মিনিটের মধ্যে প্রথমবার এসেছে।

//     if (existingSignatureLog) {
//         console.log(`⚠️ Rapid/Repeat Request Detected for FID ${fid}. Strict Mode ON.`);
//         isStrictCheckNeeded = true;
//     }

//     // ২. Neynar API চেক
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

//     // ৩. Ownership Check
//     const allowedWallets = [
//       user.custody_address?.toLowerCase(),
//       ...(user.verified_addresses?.eth_addresses?.map((a: string) => a.toLowerCase()) || [])
//     ].filter(Boolean);

//     if (!allowedWallets.includes(targetWallet)) {
//       return NextResponse.json({ message: "Wallet not linked to Farcaster ID" }, { status: 403 });
//     }
//     console.log(`✅ Ownership Verified.`);

//     // 🔥🔥🔥 ৪. Blockchain Check 🔥🔥🔥
//     const ALCHEMY_URL = "https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH";
//     let claimCount = 0;

//     try {
//         const provider = new ethers.providers.StaticJsonRpcProvider(
//             { url: ALCHEMY_URL, skipFetchSetup: true }, 
//             { chainId: 8453, name: "base" }
//         );
//         const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
//         const userStats = await contract.getUserStats(BigInt(giveawayId), targetWallet);
//         claimCount = Number(userStats[1]);
//         console.log(`📊 Contract Claim Count: ${claimCount}`);

//     } catch {
//         return NextResponse.json({ message: "System busy checking claim history." }, { status: 500 });
//     }

//     // 🔥🔥🔥 লজিক: (Blockchain >= 1) অথবা (Strict Mode ON - মানে SignatureLog পাওয়া গেছে) 🔥🔥🔥
//     if (claimCount >= 1 || isStrictCheckNeeded) {
//             console.log("🔍 Bonus/Strict Claim: Checking ShareLog...");
            
//             // ShareLog চেক - যদি শেয়ার না থাকে তবে ফেইল হবে
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

//     // ৫. সিগনেচার জেনারেট
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
import SignatureLog from "@/models/SignatureLog"; 
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

// --- হেল্পার ফাংশন: Retry Logic ---
async function fetchWithRetry(url: string, options: any, retries = 3, delay = 1000) {
  const cachedOptions = { 
    ...options, 
    next: { revalidate: 86400 } 
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, cachedOptions);
      if (response.ok) return response;
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
    
    // 🔥 isMiniPay রিসিভ করছি
    const { userWallet, fid, giveawayId, isMiniPay } = body;
    const targetWallet = userWallet ? userWallet.toLowerCase() : "";
    
    // MiniPay থেকে আসলে FID 0 ধরে নিব, যাতে কন্টাক্ট সিগনেচারে সমস্যা না হয়
    const safeFid = fid || 0; 

    console.log(`\n🛡️ --- SECURE CLAIM REQUEST STARTED (FID: ${safeFid}, MiniPay: ${!!isMiniPay}) ---`);

    // 🔥 ভ্যালিডেশন আপডেট (MiniPay এর জন্য FID চেক স্কিপ করা হলো)
    if (!targetWallet || !giveawayId) {
      return NextResponse.json({ message: "Missing wallet or giveawayId" }, { status: 400 });
    }
    if (!isMiniPay && !safeFid) {
      return NextResponse.json({ message: "Missing Farcaster ID" }, { status: 400 });
    }

    // ১. ডাটাবেস কানেকশন
    await connectDB();

    let isStrictCheckNeeded = false;

    // 🔥🔥🔥 Farcaster Users এর জন্য Strict Check & DB Update 🔥🔥🔥
    if (!isMiniPay) {
        // STEP 1: ATOMIC LOCK (BOT & BYPASS PROTECTION)
        const existingSignatureLog = await SignatureLog.findOneAndUpdate(
          { fid: safeFid.toString(), giveawayId: giveawayId.toString() }, 
          { $set: { lastAttempt: new Date() } }, 
          { upsert: true, returnDocument: 'before', setDefaultsOnInsert: true } 
        );

        if (existingSignatureLog) {
            console.log(`⚠️ Rapid/Repeat Request Detected for FID ${safeFid}. Strict Mode ON.`);
            isStrictCheckNeeded = true;
        }

        // ২. Neynar API চেক
        const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
        if (!NEYNAR_API_KEY) return NextResponse.json({ message: "Config Error" }, { status: 500 });

        let user;
        try {
          const response = await fetchWithRetry(
            `https://api.neynar.com/v2/farcaster/user/bulk?fids=${safeFid}`, 
            { method: 'GET', headers: { accept: 'application/json', api_key: NEYNAR_API_KEY } }
          );
          const data = await response.json();
          if (!data.users || data.users.length === 0) throw new Error("Invalid FID");
          user = data.users[0];
        } catch (err) {
          console.error("🔥 Neynar Error:", err);
          return NextResponse.json({ message: "Verification Failed" }, { status: 503 });
        }

        // ৩. Ownership Check
        const allowedWallets = [
          user.custody_address?.toLowerCase(),
          ...(user.verified_addresses?.eth_addresses?.map((a: string) => a.toLowerCase()) || [])
        ].filter(Boolean);

        if (!allowedWallets.includes(targetWallet)) {
          return NextResponse.json({ message: "Wallet not linked to Farcaster ID" }, { status: 403 });
        }
        console.log(`✅ Ownership Verified for Farcaster.`);
        
    } else {
        console.log(`✅ MiniPay User: DB Log, Neynar & Ownership Check Bypassed.`);
    }

    // ৪. Blockchain Check
    const ALCHEMY_URL = "https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH";
    let claimCount = 0;

    try {
        // নোট: যদি Celo চেইনে হয়, ALCHEMY_URL এবং chainId (42220) মিলিয়ে নিবেন
        const provider = new ethers.providers.StaticJsonRpcProvider(
            { url: ALCHEMY_URL, skipFetchSetup: true }, 
            { chainId: 8453, name: "base" }
        );
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const userStats = await contract.getUserStats(BigInt(giveawayId), targetWallet);
        claimCount = Number(userStats[1]);
        console.log(`📊 Contract Claim Count: ${claimCount}`);

    } catch {
        return NextResponse.json({ message: "System busy checking claim history." }, { status: 500 });
    }

    // 🔥🔥🔥 লজিক: Farcaster Users এর জন্য ShareLog Check 🔥🔥🔥
    if (!isMiniPay && (claimCount >= 1 || isStrictCheckNeeded)) {
        console.log("🔍 Bonus/Strict Claim: Checking ShareLog...");
        
        const hasShared = await ShareLog.findOne({ fid: safeFid.toString() });

        if (!hasShared) {
            console.error(`⛔ Bonus Blocked: FID ${safeFid} hasn't shared.`);
            return NextResponse.json(
                { message: "Bonus Locked: Verify share first!" }, 
                { status: 403 }
            );
        }
        console.log(`✅ Bonus Authorized: Share Log Found.`);
    } else if (isMiniPay) {
        console.log(`✅ MiniPay User: ShareLog DB Check Bypassed.`);
    } else {
        console.log(`✅ First Claim: Allowed (No Share Needed).`);
    }

    // ৫. সিগনেচার জেনারেট
    const privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) return NextResponse.json({ message: "Server Error" }, { status: 500 });

    const wallet = new ethers.Wallet(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
    const nonce = Math.floor(Math.random() * 1000000000000000); 

    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256", "uint256"], 
      [targetWallet, safeFid.toString(), giveawayId.toString(), nonce.toString()] 
    );

    const signature = await wallet.signMessage(ethers.utils.arrayify(messageHash));

    console.log(`✍️ Signature Sent Successfully.`);
    return NextResponse.json({ signature, nonce });

  } catch (error) {
    console.error("💥 Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}