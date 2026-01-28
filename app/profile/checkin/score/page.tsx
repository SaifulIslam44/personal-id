







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

// const handleShare = () => {
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

//     // 🚩 সিরিয়াল এবং প্যারামিটার নামগুলো api/frame এর সাথে মিলিয়ে ফিক্স করা হয়েছে
//     const frameUrl = `${baseUrl}/api/frame?username=${safeUsername}&fid=${safeFid}&score=${safeScore}&rank=${safeRank}&pfp=${safePfp}&t=${timestamp}`;

//     const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Score\n💰 Win 0.01 $USDC + Lucky Bonuses`;
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
  const [setFrameContext] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [displayScore, setDisplayScore] = useState(0.0);
  
  // 🚩 Single source of truth lock - ChatGPT fix
  const [scoreLoaded, setScoreLoaded] = useState(false);
  const [actualScore, setActualScore] = useState(0.0);
  const [userData, setUserData] = useState({
    displayName: "User",
    fid: "0",
    pfpUrl: "https://placehold.co/100x100?text=User"
  });

  // 🚩 Neynar API থেকে আসল স্কোর নিয়ে আসার ফাংশন (FIXED)
  const fetchNeynarScore = async (fid: string) => {
    try {
      console.log(`Fetching score for FID: ${fid}...`); 
      
      const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
          'accept': 'application/json',
          'api_key': '088ADB7C-2B73-4676-95C6-6F775A495287' 
        }
      });

      if (!response.ok) {
        console.error("API Error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      if (data.users && data.users.length > 0) {
        const user = data.users[0];
        const score = user.score || user.experimental?.neynar_user_score || user.profile?.score || 0;
        setActualScore(score);
        setScoreLoaded(true); // ✅ atomic sync lock
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
        // ✅ Guard added to prevent multiple calls
        if (userFid !== "0" && !scoreLoaded) fetchNeynarScore(userFid); 
      }
    }).catch(() => {});

    if (context?.user) {
      const userFid = context.user.fid?.toString() || "0";
      setUserData({
        displayName: context.user.displayName || "User",
        fid: userFid,
        pfpUrl: context.user.pfpUrl || "https://placehold.co/100x100?text=User"
      });
      // ✅ Guard added to prevent multiple calls
      if (userFid !== "0" && !scoreLoaded) fetchNeynarScore(userFid);
    }
  }, [context, scoreLoaded, setFrameContext]); // added scoreLoaded dependency

  const getRankLabel = (score: number) => {
    if (score >= 0.90) return "TOP 1% OF USERS";
    if (score >= 0.75) return "TOP 5% OF USERS";
    if (score >= 0.60) return "TOP 10% OF USERS";
    if (score >= 0.40) return "TOP 20% OF USERS";
    if (score >= 0.20) return "TOP 30% OF USERS";
    if (score >= 0.10) return "TOP 50% OF USERS";
    return "TOP 95% OF USERS";
  };

// const handleShare = () => {
//     if (!scoreLoaded || userData.fid === "0") {
//       alert("Score still syncing, please wait...");
//       return;
//     }

//     const baseUrl = "https://mints.personalids.xyz";
//     const currentRank = getRankLabel(actualScore);
//     const frameUrl = `${baseUrl}/api/frame?username=${encodeURIComponent(userData.displayName)}&fid=${userData.fid}&score=${actualScore.toFixed(2)}&rank=${encodeURIComponent(currentRank)}&pfp=${encodeURIComponent(userData.pfpUrl)}&t=${Date.now()}`;
//     const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Score\n💰 Win 0.01 $USDC + Lucky Bonuses`;

//     try {
//       // ✅ এখানে ফিক্স করা হয়েছে: সরাসরি টাইপ কাস্টিং করে এক্সেস করা হচ্ছে
//       const castAction = {
//         text: shareText,
//         embeds: [frameUrl],
//       };

//       if ((window as any).farcaster?.sdk?.actions?.composeCast) {
//         (window as any).farcaster.sdk.actions.composeCast(castAction);
//       } else if ((miniApp as any).actions?.composeCast) {
//         (miniApp as any).actions.composeCast(castAction);
//       } else {
//         // Fallback: শুধুমাত্র যদি SDK না পাওয়া যায়
//         const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
//         window.open(castIntent, "_blank");
//       }
//     } catch (error) {
//       console.error("Share error:", error);
//     }
//   };



const handleShare = () => {
    if (!scoreLoaded || userData.fid === "0") {
      alert("Score still syncing, please wait...");
      return;
    }

    const baseUrl = "https://mints.personalids.xyz";
    const currentRank = getRankLabel(actualScore);
    
    // ক্যাশ এড়ানোর জন্য v=direct_launch এবং টাইমস্ট্যাম্প
    const frameUrl = `${baseUrl}/api/frame?username=${encodeURIComponent(userData.displayName)}&fid=${userData.fid}&score=${actualScore.toFixed(2)}&rank=${encodeURIComponent(currentRank)}&pfp=${encodeURIComponent(userData.pfpUrl)}&v=direct_launch&t=${Date.now()}`;
    
    const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Score\n💰 Win 0.01 $USDC + Lucky Bonuses`;

    const castAction = {
      text: shareText,
      embeds: [frameUrl],
    };

    try {
      // সরাসরি SDK অ্যাকশন কল করা হচ্ছে
      const farcasterSDK = (window as any).farcaster?.sdk || (window as any).farcaster;

      if (farcasterSDK?.actions?.composeCast) {
        farcasterSDK.actions.composeCast(castAction);
      } else if ((miniApp as any).actions?.composeCast) {
        (miniApp as any).actions.composeCast(castAction);
      } else {
        // ব্রাউজারে না পাঠিয়ে ইউজারকে অ্যালার্ট দিন
        alert("Please use this inside Farcaster/Warpcast to share.");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };



  // ✅ Animated score overwrite fix - ChatGPT Fix
  useEffect(() => {
    if (actualScore === 0 && !scoreLoaded) return;
    
    let start = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = duration / frameRate;
    const increment = actualScore / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= actualScore) {
        setDisplayScore(actualScore);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, frameRate);
    return () => clearInterval(timer);
  }, [actualScore, scoreLoaded]);

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
          {isDarkMode ? <Moon size={18} className={styles.iconBlue} /> : <Sun size={18} className={styles.iconOrange} />}
        </button>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.heroHeader}>
          <h1 className={styles.mainTitle}>NEYNAR SCORE</h1>
          <p className={styles.subTitle}>Reputation score based on your On-chain & Social Activity, powered by Neynar</p>
        </header>

        <section className={styles.idCard}>
          <div className={styles.cardGlassOverlay}></div>
          <div className={styles.cardHeader}>
             <ShieldCheck size={14} />
             <span>VERIFIED IDENTITY</span>
          </div>
          <div className={styles.identitySection}>
            <div className={styles.avatarContainer}>
               <div className={styles.avatarRing}>
                  <Image src={userData.pfpUrl} alt="User Profile" className={styles.pfpGol} width={90} height={90} unoptimized />
               </div>
            </div>
            <div className={styles.userDetails}>
               <h2 className={styles.nameLabel}>User: <span className={styles.whiteText}>{userData.displayName}</span></h2>
               <p className={styles.fidLabel}>FID: <span className={styles.fidValue}>{userData.fid}</span></p>
            </div>
          </div>
          <div className={styles.scoreSection}>
            <div className={styles.scoreTitle}>ACTIVITY NEYNAR SCORE</div>
            <div className={styles.scoreNumber}>{displayScore.toFixed(2)}</div>
            <div className={styles.rankBadge}>
              <Zap size={12} fill="currentColor" />
              <span>{getRankLabel(actualScore)}</span>
            </div>
          </div>
          <div className={styles.cardFooterAccent}></div>
        </section>

        <button className={styles.shareBtn} onClick={handleShare}>
          <Share2 size={20} />
          <span>Share Your Score</span>
        </button>
      </main>
    </div>
  );
}