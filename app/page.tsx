"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import miniapp from "@farcaster/miniapp-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        // ১. SDK রেডি করা
        await miniapp.actions.ready();

        // ২. Suspense এরর এড়াতে সরাসরি window.location ব্যবহার করে FID নেওয়া
        const params = new URLSearchParams(window.location.search);
        const fid = params.get("fid");

        // ৩. নতুন ভিজিটে পুরানো রেফারার ক্লিয়ার করা
        localStorage.removeItem("referrer_address");

        if (fid) {
          console.log("🔍 Finding referrer for FID:", fid);
          try {
            const referrerAddress = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: ABI,
              functionName: "getAddressByFID",
              args: [BigInt(fid)],
            });

            if (referrerAddress && referrerAddress !== "0x0000000000000000000000000000000000000000") {
              const cleanedRef = (referrerAddress as string).toLowerCase();
              localStorage.setItem("referrer_address", cleanedRef);
              console.log("✅ Referrer Saved:", cleanedRef);
            }
          } catch {
            console.error("❌ On-chain lookup failed.");
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        // ৪. কাজ শেষে রিডাইরেক্ট
        router.replace("/profile/checkin/giveaway");
      }
    };

    initialize();
  }, [router]);

  return null;
}