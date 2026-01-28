

// "use client";

// import React, { useState, useEffect } from "react";
// import styles from "./score.module.css";
// import { Moon, Sun, Share2, ShieldCheck, Zap } from "lucide-react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import miniApp from "@farcaster/miniapp-sdk";
// import Image from "next/image";

// export default function ScorePage() {
//   const { context } = useMiniKit();
//   const [setFrameContext] = useState<any>(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [displayScore, setDisplayScore] = useState(0.0);
  
//   // 🚩 ম্যানুয়াল স্কোর বাদ দিয়ে স্টেট ব্যবহার করা হয়েছে
//   const [actualScore, setActualScore] = useState(0.0);
//   const [userData, setUserData] = useState({
//     displayName: "User",
//     fid: "0",
//     pfpUrl: "https://placehold.co/100x100?text=User"
//   });

//   // 🚩 Neynar API থেকে আসল স্কোর নিয়ে আসার ফাংশন
// // 🚩 Neynar API থেকে আসল স্কোর নিয়ে আসার ফাংশন (FIXED)
//   const fetchNeynarScore = async (fid: string) => {
//     try {
//       console.log(`Fetching score for FID: ${fid}...`); // ১. চেক করুন কল হচ্ছে কিনা
      
//       const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//         headers: {
//           'accept': 'application/json',
//           'api_key': '088ADB7C-2B73-4676-95C6-6F775A495287' // ⚠️ আপনার API Key ঠিক আছে তো?
//         }
//       });

//       if (!response.ok) {
//         console.error("API Error:", response.status, response.statusText);
//         return;
//       }

//       const data = await response.json();
//       console.log("Neynar API Data:", data); // ২. কনসোলে পুরো ডাটা দেখুন

//       if (data.users && data.users.length > 0) {
//         const user = data.users[0];
        
//         // 🚩 ৩. স্কোর বের করার সঠিক লজিক (সব অপশন চেক করা হচ্ছে)
//         // অপশন ১: সরাসরি স্কোরে (OpenRank)
//         // অপশন ২: এক্সপেরিমেন্টাল নেইনার স্কোরে
//         // অপশন ৩: প্রোফাইল স্কোরে (যদি থাকে)
//         const score = user.score || user.experimental?.neynar_user_score || user.profile?.score || 0;
        
//         console.log("Found Score:", score); // ৪. কত স্কোর পেল সেটা প্রিন্ট হবে
//         setActualScore(score);
//       } else {
//         console.warn("No user found in API response");
//       }

//     } catch (error) {
//       console.error("Score fetch failed", error);
//     }
//   };

//   useEffect(() => {
//     miniApp.context.then((ctx) => {
//       setFrameContext(ctx);
//       if (ctx?.user) {
//         const userFid = ctx.user.fid?.toString() || "0";
//         setUserData({
//           displayName: ctx.user.displayName || ctx.user.username || "User",
//           fid: userFid,
//           pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User"
//         });
//         if (userFid !== "0") fetchNeynarScore(userFid); // আসল স্কোর কল করা
//       }
//     }).catch(() => {});

//     if (context?.user) {
//       const userFid = context.user.fid?.toString() || "0";
//       setUserData({
//         displayName: context.user.displayName || "User",
//         fid: userFid,
//         pfpUrl: context.user.pfpUrl || "https://placehold.co/100x100?text=User"
//       });
//       if (userFid !== "0") fetchNeynarScore(userFid);
//     }
//   }, [context]);

//   const getRankLabel = (score: number) => {
//     if (score >= 0.90) return "TOP 1% OF USERS";
//     if (score >= 0.75) return "TOP 5% OF USERS";
//     if (score >= 0.60) return "TOP 10% OF USERS";
//     if (score >= 0.40) return "TOP 20% OF USERS";
//     if (score >= 0.20) return "TOP 30% OF USERS";
//     if (score >= 0.10) return "TOP 50% OF USERS";
//     return "TOP 95% OF USERS";
//   };

//   const handleShare = () => {
//     if (userData.fid === "0") {
//       alert("Please wait for your score to load completely.");
//       return;
//     }

//     const baseUrl = "https://mints.personalids.xyz";
//     const currentRank = getRankLabel(actualScore);
    
//     const safeUsername = encodeURIComponent(userData.displayName);
//     const safeFid = userData.fid;
//     const safeScore = actualScore.toFixed(2);
//     const safeRank = encodeURIComponent(currentRank);
//     const safePfp = encodeURIComponent(userData.pfpUrl);
//     const timestamp = Date.now();

//     const frameUrl = `${baseUrl}/api/frame?score=${safeScore}&fid=${safeFid}&username=${safeUsername}&rank=${safeRank}&pfp=${safePfp}&t=${timestamp}`;

//       const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵

// Mint ID & Check Score to claim daily rewards! 🎁

// ✅ Mint ID
// ✅ Check Score
// 💰 Win 0.01 $USDC + Lucky Bonuses`;
//     const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
    
//     window.open(castIntent, "_blank");
//   };

//   useEffect(() => {
//     let start = 0;
//     const duration = 2000;
//     const frameRate = 1000 / 60;
//     const totalFrames = duration / frameRate;
//     const increment = actualScore / totalFrames;

//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= actualScore) {
//         setDisplayScore(actualScore);
//         clearInterval(timer);
//       } else {
//         setDisplayScore(start);
//       }
//     }, frameRate);
//     return () => clearInterval(timer);
//   }, [actualScore]);

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       <nav className={styles.topBar}>
//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={userData.pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
//           </div>
//           <span className={styles.profileName}>{userData.displayName}</span>
//         </div>
//         <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
//           {isDarkMode ? <Moon size={18} className={styles.iconBlue} /> : <Sun size={18} className={styles.iconOrange} />}
//         </button>
//       </nav>

//       <main className={styles.mainContent}>
//         <header className={styles.heroHeader}>
//           <h1 className={styles.mainTitle}>NEYNAR SCORE</h1>
//           <p className={styles.subTitle}>Reputation score based on your On-chain & Social Activity, powered by Neynar</p>
//         </header>

//         <section className={styles.idCard}>
//           <div className={styles.cardGlassOverlay}></div>
//           <div className={styles.cardHeader}>
//              <ShieldCheck size={14} />
//              <span>VERIFIED IDENTITY</span>
//           </div>
//           <div className={styles.identitySection}>
//             <div className={styles.avatarContainer}>
//                <div className={styles.avatarRing}>
//                   <Image src={userData.pfpUrl} alt="User Profile" className={styles.pfpGol} width={90} height={90} unoptimized />
//                </div>
//             </div>
//             <div className={styles.userDetails}>
//                <h2 className={styles.nameLabel}>User: <span className={styles.whiteText}>{userData.displayName}</span></h2>
//                <p className={styles.fidLabel}>FID: <span className={styles.fidValue}>{userData.fid}</span></p>
//             </div>
//           </div>
//           <div className={styles.scoreSection}>
//             <div className={styles.scoreTitle}>ACTIVITY NEYNAR SCORE</div>
//             <div className={styles.scoreNumber}>{displayScore.toFixed(2)}</div>
//             <div className={styles.rankBadge}>
//               <Zap size={12} fill="currentColor" />
//               <span>{getRankLabel(actualScore)}</span>
//             </div>
//           </div>
//           <div className={styles.cardFooterAccent}></div>
//         </section>

//         <button className={styles.shareBtn} onClick={handleShare}>
//           <Share2 size={20} />
//           <span>Share Your Score</span>
//         </button>
//       </main>
//     </div>
//   );
// }


























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
  const [actualScore, setActualScore] = useState(0.0);
  const [userData, setUserData] = useState({
    displayName: "User",
    fid: "0",
    pfpUrl: "https://placehold.co/100x100?text=User"
  });

  const fetchNeynarScore = async (fid: string) => {
    try {
      const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
          'accept': 'application/json',
          'api_key': '088ADB7C-2B73-4676-95C6-6F775A495287' 
        }
      });
      const data = await response.json();
      if (data.users && data.users.length > 0) {
        const user = data.users[0];
        const score = user.score || user.experimental?.neynar_user_score || user.profile?.score || 0;
        setActualScore(score);
      }
    } catch (error) {
      console.error("Score fetch failed", error);
    }
  };

  useEffect(() => {
    miniApp.context.then((ctx) => {
      setFrameContext(ctx);
      if (ctx?.user) {
        const userFid = ctx.user.fid?.toString() || "0";
        setUserData({
          displayName: ctx.user.displayName || ctx.user.username || "User",
          fid: userFid,
          pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User"
        });
        if (userFid !== "0") fetchNeynarScore(userFid);
      }
    }).catch(() => {});

    if (context?.user) {
      const userFid = context.user.fid?.toString() || "0";
      setUserData({
        displayName: context.user.displayName || "User",
        fid: userFid,
        pfpUrl: context.user.pfpUrl || "https://placehold.co/100x100?text=User"
      });
      if (userFid !== "0") fetchNeynarScore(userFid);
    }
  }, [context]);

  const getRankLabel = (score: number) => {
    if (score >= 0.90) return "TOP 1% OF USERS";
    if (score >= 0.75) return "TOP 5% OF USERS";
    if (score >= 0.60) return "TOP 10% OF USERS";
    if (score >= 0.40) return "TOP 20% OF USERS";
    if (score >= 0.20) return "TOP 30% OF USERS";
    if (score >= 0.10) return "TOP 50% OF USERS";
    return "TOP 95% OF USERS";
  };

  const handleShare = () => {
    if (userData.fid === "0") {
      alert("Please wait for your score to load completely.");
      return;
    }

    const baseUrl = "https://mints.personalids.xyz";
    const currentRank = getRankLabel(actualScore);
    
    // 🚩 ডাটা এনকোডিং ফিক্সড
    const query = new URLSearchParams({
      score: actualScore.toFixed(2),
      fid: userData.fid,
      username: userData.displayName,
      rank: currentRank,
      pfp: userData.pfpUrl,
      t: Date.now().toString()
    }).toString();

    const frameUrl = `${baseUrl}/api/frame?${query}`;
      const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵

Mint ID & Check Score to claim daily rewards! 🎁

✅ Mint ID
✅ Check Score
💰 Win 0.01 $USDC + Lucky Bonuses`;
    
    const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
    
    window.open(castIntent, "_blank");
  };

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = actualScore / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= actualScore) {
        setDisplayScore(actualScore);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [actualScore]);

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      <nav className={styles.topBar}>
        <div className={styles.profileSummary}>
          <div className={styles.miniPfpWrapper}>
            <Image src={userData.pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
          </div>
          <span className={styles.profileName}>{userData.displayName}</span>
        </div>
        <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>
      <main className={styles.mainContent}>
        <header className={styles.heroHeader}>
          <h1 className={styles.mainTitle}>NEYNAR SCORE</h1>
          <p className={styles.subTitle}>Reputation score based on your Activity, powered by Neynar</p>
        </header>
        <section className={styles.idCard}>
          <div className={styles.cardHeader}><ShieldCheck size={14} /> <span>VERIFIED IDENTITY</span></div>
          <div className={styles.identitySection}>
            <Image src={userData.pfpUrl} alt="User" width={90} height={90} className={styles.pfpGol} unoptimized />
            <div className={styles.userDetails}>
               <h2 className={styles.nameLabel}>User: <span className={styles.whiteText}>{userData.displayName}</span></h2>
               <p className={styles.fidLabel}>FID: <span className={styles.fidValue}>{userData.fid}</span></p>
            </div>
          </div>
          <div className={styles.scoreSection}>
            <div className={styles.scoreTitle}>ACTIVITY NEYNAR SCORE</div>
            <div className={styles.scoreNumber}>{displayScore.toFixed(2)}</div>
            <div className={styles.rankBadge}><Zap size={12} fill="currentColor" /> <span>{getRankLabel(actualScore)}</span></div>
          </div>
        </section>
        <button className={styles.shareBtn} onClick={handleShare}><Share2 size={20} /> <span>Share Your Score</span></button>
      </main>
    </div>
  );
}


