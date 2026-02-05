"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import miniApp from "@farcaster/miniapp-sdk";
import styles from "./info.module.css";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useSendTransaction } from "wagmi"; 
// import { parseEther } from "viem"; 
import { Heart } from "lucide-react"; // হার্ট আইকনটির জন্য
import { useReconnect } from 'wagmi';


export default function InfoPage() {
  const { address, isConnected } = useAccount();
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  const [hasNft, setHasNft] = useState(false);
  const [loading, setLoading] = useState(true);
  const { sendTransactionAsync } = useSendTransaction();
  // ২. নতুন স্টেট (ইউজার ইনফো এবং ডার্ক মোডের জন্য)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const user = context?.user || frameContext?.user;
  const displayName = user?.displayName || user?.username || "User";
  const pfpUrl = user?.pfpUrl || "https://placehold.co/100x100?text=User";
  const fid = context?.user?.fid || frameContext?.user?.fid;
  const { reconnect } = useReconnect();
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  
useEffect(() => {
  reconnect(); 
}, [reconnect]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await miniApp.context;
        setFrameContext(ctx);
      } catch (err) {
        console.error(err);
      }
    };
    loadContext();
  }, []);

  // পেজের ভেতর useEffect এ এটি যোগ করুন
useEffect(() => {
  if (!isDarkMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
}, [isDarkMode]);

  

  // অন-চেইন ব্যালেন্স চেক
  const { data: balance, isFetched } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address && isConnected },
  });

  useEffect(() => {
    if (isFetched) {
      if (balance && (balance as bigint) > 0n) {
        setHasNft(true);
      }
      setLoading(false);
    }
  }, [balance, isFetched]);

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );


const handleUsdcDonate = async (amount: string) => {
  try {
    // USDC এর ডেসিমেল ৬, তাই অ্যামাউন্টকে ১০ লক্ষ দিয়ে গুণ করা হচ্ছে
    const usdcAmount = BigInt(Math.round(parseFloat(amount) * 1e6)); 

    // আপনার নতুন ডনেট অ্যাড্রেস (0x8C8...8012) থেকে 0x বাদ দিয়ে ছোট হাতের অক্ষরে নেওয়া হয়েছে
    const receiver = "8C8d41c66a059a62577Ab14F313f6ad13a6D8012".toLowerCase();

    await sendTransactionAsync({
      to: USDC_ADDRESS as `0x${string}`,
      // ERC-20 transfer(address to, uint256 value) মেথড আইডি: 0xa9059cbb
      data: `0xa9059cbb000000000000000000000000${receiver}00000000000000000000000000000000000000000000000000000000${usdcAmount.toString(16).padStart(64, '0')}` as `0x${string}`,
    });

    alert("Thank you for your USDC donation!");
  } catch (err) {
    console.error("USDC Donation failed:", err);
  }
};

  return (
    
    <div className={`${styles.wrapper} ${!isDarkMode ? styles.lightMode : ""}`}>
      
     
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

    
      <h2 className={styles.headerTitle}>YOUR ONCHAIN ID</h2>

      {hasNft && fid ? (
        <>
        <div className={styles.onlyCardWrapper}>
          {/* এখানে শুধুমাত্র ইমেজটি লোড হবে */}
          <Image
            src={`/api/metadata/${fid}?refresh=true`} 
            alt="Verified ID Card" 
            className={styles.justTheImage}
            width={600} 
            height={300} 
            unoptimized 
          />
        </div>

        {/* 🎬 Movie Credits Scrolling Section */}
          <div className={styles.creditsContainer}>
            <div className={styles.creditsScroll}>
              <p className={styles.creditTitle}>DEVELOPER</p>
              <p className={styles.creditName}>ST Lifestyle</p>
              
              <p className={styles.creditTitle}>STATUS</p>
              <p className={styles.creditName}>Apps Under Development</p>
              
              <p className={styles.creditTitle}>COMMUNITY</p>
              <p className={styles.creditName}>Search on Telegam "GPPOFFICIALBD"</p>
              
              <p className={styles.creditTitle}>REFERALL</p>
              <p className={styles.creditName}>Refer and earn 5% (5 PIM) per referral. Refer 5 friends to get a 50 PIM bonus plus 25 PIM from your 5% commission!</p>

              <p className={styles.creditTitle}>MINT</p>
              <p className={styles.creditName}>Mint your Onchain ID to earn +50 PIM and unlock access to the Rewards section.</p>
              
              <p className={styles.creditTitle}>REWARDS</p>
              <p className={styles.creditName}>Spin and earn USDC rewards. Claim directly if the reward pool is available. Update Rewads Pool Per Weeks</p>

              <p className={styles.creditTitle}>DAILY CHECK-IN</p>
              <p className={styles.creditName}>Complete your Daily Check-in to receive +50 PIM.</p>

              <p className={styles.creditTitle}>SPIN</p>
              <p className={styles.creditName}>Each spin costs 100 PIM, which will be burned after a successful spin.</p>

              <p className={styles.creditFooter}>© 2026 ST Lifestyle. All Rights Reserved.</p>
            </div>
          </div>

          {/* 🎁 Donation Section (আপনার creditsContainer এর পরেই এটি যোগ করুন) */}
          <div className={styles.donationSection}>
  <h3 className={styles.donateTitle}>
    <Heart size={16} fill="#ff4d4f" color="#ff4d4f" /> Support Developer (USDC)
  </h3>
  <div className={styles.donateGrid}>
    {/* এখানে সরাসরি ডলার অ্যামাউন্ট পাঠাচ্ছেন */}
    <button onClick={() => handleUsdcDonate("5")}>$5</button>
    <button onClick={() => handleUsdcDonate("10")}>$10</button>
    <button onClick={() => handleUsdcDonate("50")}>$50</button>
    <button onClick={() => handleUsdcDonate("100")}>$100</button>
  </div>
</div>
        </>

        
        
      ) : (
        <div className={styles.noNftBox}>
          <p>No Minted ID Found</p>
          <button onClick={() => window.location.href = '/profile'}>Go Mint</button>
        </div>
      )}
    </div>
  );
}