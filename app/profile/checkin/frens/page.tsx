"use client";

import React, { useState, useEffect } from "react";
import styles from "./frens.module.css";
import { useAccount, useReadContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { Share2, Copy, Moon, Sun, Check, Users } from "lucide-react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import miniApp, { sdk } from "@farcaster/miniapp-sdk";
import Image from "next/image"; // এটি নতুন যোগ করবেন

export default function FrensPage() {
  const { address } = useAccount();
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fid, setFid] = useState<string>(""); // ✅ এই স্টেটটিই আমরা ব্যবহার করবো


  useEffect(() => {
    miniApp.context.then(setFrameContext).catch(() => {});
  }, []);


  useEffect(() => {
  // পেজ লোড হলে লোকাল স্টোরেজ থেকে ইউজারের FID নিয়ে আসবে
  const storedFid = localStorage.getItem("user_fid");
  if (storedFid) {
    setFid(storedFid);
  }
}, []);

  // পেজের ভেতর useEffect এ এটি যোগ করুন
useEffect(() => {
  if (!isDarkMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
}, [isDarkMode]);

  const user = context?.user || frameContext?.user;
  
  // ✅ [FIXED] এখানে 'const fid' এর বদলে 'const currentFid' ব্যবহার করা হয়েছে যাতে উপরের স্টেটের সাথে সংঘর্ষ না হয়
  const currentFid = user?.fid; 
  
  const displayName = user?.displayName || user?.username || "Anonymous User";
  const pfpUrl = user?.pfpUrl || "https://placehold.co/100x100?text=User";

  // ✅ [FIXED] যদি স্টেটে FID না থাকে কিন্তু SDK থেকে পাওয়া যায়, তবে সেটি সেট করা
  useEffect(() => {
    if (!fid && currentFid) {
      setFid(currentFid.toString());
    }
  }, [currentFid, fid]);

  const { data: count } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "refCount",
    args: address ? [address] : undefined,
  });

  const refCountNum = Number(count || 0); 

// const inviteLink = `https://dicke-ddr-housewares-domestic.trycloudflare.com?referrer=${address}`;

// const handleShare = () => {
//   if (!address) return; // fid-এর বদলে address চেক করা নিরাপদ
//   const text = "🔥 Join me on Personal ID Mint! Daily check-in and earn rewards 🚀";
//   const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(inviteLink)}`;
//   window.open(shareUrl, "_blank");
// };



// FrensPage এর ভেতর লিঙ্কটি এইভাবে আপডেট করুন
// const inviteLink = `https://lottery-kick-ideas-womens.trycloudflare.com?fid=${fid}`;

// const handleShare = () => {
//   if (!address) return;
//   const text = "🔥 Join me on Personal ID Mint! Daily check-in and earn rewards 🚀";
//   const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(inviteLink)}`;
//   window.open(shareUrl, "_blank");
// };

// ✅ এখন শুধু FID দিয়ে ক্লিন ইনভাইট লিঙ্ক জেনারেট হবে
const getInviteLink = () => {
  if (!fid) return "";

  const userAgent = navigator.userAgent.toLowerCase();
  
  // ১. সরাসরি window.ethereum চেক করা (Base App ডিটেক্ট করার জন্য সবথেকে নির্ভরযোগ্য)
  // ২. ইউজার এজেন্ট চেক
  // ৩. টাইপস্ক্রিপ্ট সেফ কনটেক্সট চেক
  const isBaseApp = 
    (typeof window !== "undefined" && (window.ethereum as any)?.isCoinbaseWallet) ||
    userAgent.includes("base") || 
    userAgent.includes("coinbase") || 
    (context as any)?.client === "base";

  if (isBaseApp) {
    // return `https://base.app/app/mints.personalids.xyz?fid=${fid}`;
    return `https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint?fid=${fid}`;
  }
  
  return `https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint?fid=${fid}`;
};

const handleShare = async () => {
  const inviteLink = getInviteLink();
  if (!inviteLink) return;

  const text = "🔥 Join me on Personal ID Mint! Spin and earn $USDC rewards 🟦";
  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(inviteLink)}`;
  
  
  const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);

  try {
    if (isFarcaster) {
      
      await sdk.actions.openUrl(castIntentUrl);
    } else {
      
      window.open(castIntentUrl, "_blank");
    }
  } catch (error) {
    console.error("SDK Share error:", error);
    
    window.open(castIntentUrl, "_blank");
  }
};


  // handleCopy ফাংশন আগের মতোই থাকবে (শুধুমাত্র এটাই কপি করবে)
  const handleCopy = () => {
    const inviteLink = getInviteLink();
    if (!inviteLink) return;

    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 3000);
  };


  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <Image 
  src={pfpUrl} 
  alt="PFP" 
  className={styles.pfp} 
  width={40} 
  height={40} 
  unoptimized 
/>
          <span className={styles.userName}>{displayName}</span>
        </div>
        <button className={styles.themeBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} color="#000" />}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title} data-text="INVITE YOUR FRIENDS">INVITE YOUR FRIENDS</h1>
         <p className={styles.subtitle}>
  Share &quot;Personal ID Mint&quot; app and <strong>get 5%</strong> of friends PIM
</p>
        </div>

        <div className={styles.actionSection}>
          <button className={styles.shareButton} onClick={handleShare}>
            <Share2 size={18} />
            Share Personal ID Mint App
          </button>

          <button 
            className={`${styles.copyButton} ${copied ? styles.copiedActive : ""}`} 
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check size={18} color="#4ade80" />
                <span style={{ color: "#4ade80" }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>

{/* 📋 Double Block Referral Section */}
        <div className={styles.statusSection}>
          <div className={styles.labelBlock}>
             <Users size={20} className={styles.iconBlue} />
             <span>YOUR REFERRED FRIENDS</span>
          </div>
          
          <div className={styles.countBlock}>
            <span className={styles.countValue}>{refCountNum}</span>
          </div>
          
          {refCountNum === 0 && (
  <p className={styles.statusText}>You haven&apos;t referred any friends yet.</p>
)}
        </div>
      </div>
    </div>
  );
}






































