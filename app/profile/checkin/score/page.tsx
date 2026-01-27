"use client";

import React, { useState, useEffect } from "react";
import styles from "./score.module.css";
import { Moon, Sun, Share2, ShieldCheck, Zap } from "lucide-react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import miniApp from "@farcaster/miniapp-sdk";
import Image from "next/image";

export default function ScorePage() {
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [displayScore, setDisplayScore] = useState(0.0);
  
  // 🚩 1. হার্ডকোডেড স্কোর এবং ডাটা সবার উপরে ডিফাইন করুন
  const finalScore = 0.19; 

  // SDK context load
  useEffect(() => {
    miniApp.context.then(setFrameContext).catch(() => {});
  }, []);

  // 🚩 2. ইউজার ডাটা (User Data) সবার আগে ক্যালকুলেট করতে হবে
  const user = context?.user || frameContext?.user;
  const displayName = user?.displayName || user?.username || "Saiful Islam";
  const fid = user?.fid || "123456";
  // PFP তে কোনো টেক্সট বা স্পেস থাকলে এনকোডিং এ ঝামেলা হতে পারে, তাই ক্লিন রাখা ভালো
  const pfpUrl = user?.pfpUrl || "https://placehold.co/100x100.png";

  // 🚩 3. র‍্যাঙ্ক লজিক
  const getRankLabel = (score: number) => {
    if (score >= 0.90) return "TOP 1% OF USERS";
    if (score >= 0.75) return "TOP 5% OF USERS";
    if (score >= 0.60) return "TOP 10% OF USERS";
    if (score >= 0.40) return "TOP 20% OF USERS";
    if (score >= 0.20) return "TOP 30% OF USERS";
    if (score >= 0.10) return "TOP 50% OF USERS"; 
    return "TOP 75% OF USERS";
  };

  // 🚩 4. Handle Share (এখন এটি উপরের সব ডাটা পাবে)
  const handleShare = () => {
    // সেফটি চেক
    if (!displayName || !fid) {
      alert("Please wait for data to load.");
      return;
    }

    const baseUrl = "https://mints.personalids.xyz"; 
    const currentRank = getRankLabel(finalScore); 
    const timestamp = Date.now();

    // ডাটা এনকোড (খুব সাবধানে)
    const safeUsername = encodeURIComponent(displayName);
    const safeFid = String(fid);
    const safeScore = finalScore.toFixed(2);
    const safeRank = encodeURIComponent(currentRank);
    const safePfp = encodeURIComponent(pfpUrl);

    // URL তৈরি: PFP সবার শেষে দেবেন (কারণ এটি লম্বা হয়)
    const frameUrl = `${baseUrl}/api/frame?score=${safeScore}&fid=${safeFid}&username=${safeUsername}&rank=${safeRank}&t=${timestamp}&pfp=${safePfp}`;

    // শেয়ার টেক্সট
    const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵

Mint ID & Check Score to claim daily rewards! 🎁

✅ Mint ID
✅ Check Score
💰 Win 0.01 $USDC + Lucky Bonuses`;

    // Warpcast Intent
    const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
    
    // Debugging (Console এ চেক করুন লিংক ঠিক আছে কিনা)
    console.log("Generating Link:", frameUrl);
    
    window.open(castIntent, "_blank");
  };

  // Count-up animation
  useEffect(() => {
    let start = 0;
    const duration = 2000; 
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    const increment = finalScore / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= finalScore) {
        setDisplayScore(finalScore);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, frameRate);
    return () => clearInterval(timer);
  }, [finalScore]);

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      {/* Navbar */}
      <nav className={styles.topBar}>
        <div className={styles.profileSummary}>
          <div className={styles.miniPfpWrapper}>
            <Image src={pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
          </div>
          <span className={styles.profileName}>{displayName}</span>
        </div>
        <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={18} className={styles.iconBlue} /> : <Sun size={18} className={styles.iconOrange} />}
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.heroHeader}>
          <h1 className={styles.mainTitle}>NEYNAR SCORE</h1>
          <p className={styles.subTitle}>Reputation score based on your On-chain & Social Activity</p>
        </header>

        {/* Score Card */}
        <section className={styles.idCard}>
          <div className={styles.cardGlassOverlay}></div>
          
          <div className={styles.cardHeader}>
             <ShieldCheck size={14} />
             <span>VERIFIED IDENTITY</span>
          </div>
          
          <div className={styles.identitySection}>
            <div className={styles.avatarContainer}>
               <div className={styles.avatarRing}>
                  <Image src={pfpUrl} alt="User Profile" className={styles.pfpGol} width={90} height={90} unoptimized />
               </div>
            </div>
            <div className={styles.userDetails}>
               <h2 className={styles.nameLabel}>User: <span className={styles.whiteText}>{displayName}</span></h2>
               <p className={styles.fidLabel}>FID: <span className={styles.fidValue}>{fid}</span></p>
            </div>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.scoreTitle}>ACTIVITY NEYNAR SCORE</div>
            <div className={styles.scoreNumber}>
              {displayScore.toFixed(2)}
            </div>
            
            <div className={styles.rankBadge}>
              <Zap size={12} fill="currentColor" />
              <span>{getRankLabel(finalScore)}</span>
            </div>
          </div>
          
          <div className={styles.cardFooterAccent}></div>
        </section>

        {/* Share Button */}
        <button className={styles.shareBtn} onClick={handleShare}>
          <Share2 size={20} />
          <span>Share Your Score</span>
        </button>
      </main>
    </div>
  );
}