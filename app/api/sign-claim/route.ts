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

































































//changed upper code is neynar api. 


import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import connectDB from "@/lib/db";
import ShareLog from "@/models/ShareLog";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract"; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userWallet, fid, giveawayId } = body;
    const targetWallet = userWallet ? userWallet.toLowerCase() : "";

    console.log(`\n🛡️ --- CLAIM REQUEST STARTED (FID: ${fid}) ---`);

    if (!targetWallet || !fid || !giveawayId) {
      return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    // 🔥 ১. OWNERSHIP CHECK স্কিপ করা হয়েছে 🔥
    // এখন Base App এর Smart Wallet (যা Farcaster এ লিঙ্ক করা নেই) দিয়েও ক্লেইম করা যাবে।
    console.log(`✅ ID Verification bypassed for Smart Wallet compatibility.`);

    // ২. Blockchain Connection (Alchemy RPC)
    const ALCHEMY_URL = "https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH";
    
    let claimCount = 0;

    try {
        const provider = new ethers.providers.StaticJsonRpcProvider(
            {
                url: ALCHEMY_URL,
                skipFetchSetup: true,
            }, 
            {
                chainId: 8453,
                name: "base"
            }
        );

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        
        // স্মার্ট কন্ট্রাক্ট থেকে চেক করা হচ্ছে এই ওয়ালেট আগে ক্লেইম করেছে কি না
        const userStats = await contract.getUserStats(BigInt(giveawayId), targetWallet);
        claimCount = Number(userStats[1]); 

        console.log(`📊 Contract Read Success! Claim Count: ${claimCount}`);

    } catch (err: any) {
        console.error("⚠️ Blockchain Read Failed:", err.reason || err.message);
        return NextResponse.json(
            { message: "System busy checking claim history. Please try again." }, 
            { status: 500 }
        );
    }

    // ৩. বোনাস চেক লজিক: ১ বার বা তার বেশি নিয়ে থাকলে ডাটাবেসে শেয়ার চেক হবে
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

    console.log(`✍️ Signature Sent to Wallet: ${targetWallet}`);
    return NextResponse.json({ signature, nonce });

  } catch (error) {
    console.error("💥 Server Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}