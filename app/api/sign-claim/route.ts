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


















import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Incoming Request Body:", body);

    const { userWallet, fid, giveawayId } = body;

    // ১. ইনপুট ভ্যালিডেশন
    if (!userWallet || fid === undefined || fid === null || !giveawayId) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    // --- ২. নেনার (Neynar) ভেরিফিকেশন শুরু ---
    // হ্যাকার অন্য কারও FID দিয়ে নিজের ওয়ালেটে টোকেন নিতে পারবে না
    const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
    if (!NEYNAR_API_KEY) {
      return NextResponse.json({ message: "Neynar API key missing" }, { status: 500 });
    }

    const options = {
      method: 'GET',
      headers: { accept: 'application/json', api_key: NEYNAR_API_KEY }
    };

    // Neynar থেকে ইউজারের ভেরিফাইড ওয়ালেট লিস্ট নিয়ে আসা
    const neynarResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, options);
    const neynarData = await neynarResponse.json();

    if (!neynarData.users || neynarData.users.length === 0) {
      return NextResponse.json({ message: "Invalid FID" }, { status: 400 });
    }

    // ওই FID-এর সাথে কানেক্টেড সব ইথেরিয়াম অ্যাড্রেস বের করা
    const verifiedAddresses = neynarData.users[0].verified_addresses.eth_addresses.map((addr: string) => addr.toLowerCase());
    const custodianAddress = neynarData.users[0].custody_address?.toLowerCase(); // কুস্টডি অ্যাড্রেসও চেক করা ভালো

    // রিকোয়েস্ট পাঠানো ওয়ালেটটি কি ভেরিফাইড লিস্টে আছে?
    const isOwner = verifiedAddresses.includes(userWallet.toLowerCase()) || custodianAddress === userWallet.toLowerCase();

    if (!isOwner) {
      console.warn(`Hacker Alert! Wallet ${userWallet} tried to use FID ${fid}`);
      return NextResponse.json(
        { message: "এই ওয়ালেটটি আপনার ফারকাস্টার প্রোফাইলে ভেরিফাইড নয়!" },
        { status: 403 }
      );
    }
    

    // ৩. প্রাইভেট কি চেক
    let privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ message: "Signer key not configured" }, { status: 500 });
    }

    if (!privateKey.startsWith("0x")) {
      privateKey = `0x${privateKey}`;
    }

    const wallet = new ethers.Wallet(privateKey);

    // ৪. সলিডিটি স্টাইল হ্যাশ তৈরি
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      [userWallet, fid.toString(), giveawayId.toString()]
    );

    // ৫. ইথেরিয়াম সাইন্ড মেসেজ তৈরি
    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await wallet.signMessage(messageHashBinary);

    console.log("Verified Signature generated for FID:", fid);

    return NextResponse.json({ signature });

  } catch (error: any) {
    console.error("Signing Error Details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}