import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {
  try {
    // ডাটা রিড করা
    const body = await req.json();
    console.log("Incoming Request Body:", body);

    const { userWallet, fid, giveawayId } = body;

    // ১. ইনপুট ভ্যালিডেশন (আরও নিখুঁতভাবে)
    // অনেক সময় ০ (zero) থাকলে সেটাকে ! দিয়ে চেক করলে এরর দেয়, তাই টাইপ চেক করা ভালো
    if (!userWallet || fid === undefined || fid === null || !giveawayId) {
      return NextResponse.json(
        { message: `Missing parameters: wallet=${!!userWallet}, fid=${fid !== undefined}, id=${!!giveawayId}` },
        { status: 400 }
      );
    }

    // ২. প্রাইভেট কি চেক
    let privateKey = process.env.SIGNER_PRIVATE_KEY;
    if (!privateKey) {
      console.error("SIGNER_PRIVATE_KEY is missing in .env");
      return NextResponse.json(
        { message: "Signer key not configured" },
        { status: 500 }
      );
    }

    if (!privateKey.startsWith("0x")) {
      privateKey = `0x${privateKey}`;
    }

    const wallet = new ethers.Wallet(privateKey);

    // ৩. সলিডিটি স্টাইল হ্যাশ তৈরি
    // এখানে BigInt বা Number এ কনভার্ট করে নিশ্চিত করা হচ্ছে যে ডাটা টাইপ ঠিক আছে
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      [userWallet, fid.toString(), giveawayId.toString()]
    );

    // ৪. ইথেরিয়াম সাইন্ড মেসেজ তৈরি
    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const signature = await wallet.signMessage(messageHashBinary);

    console.log("Signature generated successfully for FID:", fid);

    return NextResponse.json({ signature });

  } catch (error: any) {
    console.error("Signing Error Details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}