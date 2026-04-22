


"use client";

import React, { useState, useEffect } from "react";
import styles from "./score.module.css";
import { Moon, Sun, Share2, ShieldCheck, Zap } from "lucide-react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import miniApp, { sdk } from "@farcaster/miniapp-sdk"; 
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
  // const fetchNeynarScore = async (fid: string) => {
  //   try {
  //     console.log(`Fetching score for FID: ${fid}...`); 
      
  //     const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
  //       headers: {
  //         'accept': 'application/json',
  //         'api_key': '088ADB7C-2B73-4676-95C6-6F775A495287' 
  //       }
  //     });

  //     if (!response.ok) {
  //       console.error("API Error:", response.status, response.statusText);
  //       return;
  //     }

  //     const data = await response.json();
  //     if (data.users && data.users.length > 0) {
  //       const user = data.users[0];
  //       const score = user.score || user.experimental?.neynar_user_score || user.profile?.score || 0;
  //       setActualScore(score);
  //       setScoreLoaded(true); // ✅ atomic sync lock
  //     }
  //   } catch (error) {
  //     console.error("Score fetch failed", error);
  //   }
  // };

  useEffect(() => {
  if (!isDarkMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
}, [isDarkMode]);


const fetchNeynarScore = async (fid: string) => {
    try {
      console.log(`Fetching score for FID: ${fid}...`); 
      
      // ✅ এখন আমরা সরাসরি আমাদের লোকাল API-কে কল করছি
      const response = await fetch(`/api/get-score?fid=${fid}`);

      if (!response.ok) {
        console.error("API Error:", response.status);
        return;
      }

      const data = await response.json();
      
      // ✅ Neynar API এখন সরাসরি score অবজেক্ট পাঠাচ্ছে তাই users চেক করার দরকার নেই
      if (data && typeof data.score !== 'undefined') {
        const score = data.score;
        setActualScore(score);
        setScoreLoaded(true);
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
//       // ✅ এখানে ফিক্স করা হয়েছে: সরাসরি টাইপ কাস্টিং করে এক্সেস করা হচ্ছে
//       const castAction = {
//         text: shareText,
//         embeds: [frameUrl],
//       };

//       if ((window as any).farcaster?.sdk?.actions?.composeCast) {
//         (window as any).farcaster.sdk.actions.composeCast(castAction);
//       } else if ((miniApp as any).actions?.composeCast) {
//         (miniApp as any).actions.composeCast(castAction);
//       } else {
//         // Fallback: শুধুমাত্র যদি SDK না পাওয়া যায়
//         const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
//         window.open(castIntent, "_blank");
//       }
//     } catch (error) {
//       console.error("Share error:", error);
//     }
//   };






const handleShare = () => {
  if (!scoreLoaded || userData.fid === "0") {
    return;
  }

  const baseUrl = "https://mints.personalids.xyz";
  const currentRank = getRankLabel(actualScore);
  
  // URL configurations
  const squareImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(userData.displayName)}&fid=${userData.fid}&score=${actualScore.toFixed(2)}&rank=${encodeURIComponent(currentRank)}&t=${Date.now()}`;
  const miniAppUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  
  const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Your Neynar Score\n💰 Win 0.01 $USDC + Lucky Bonuses upto 0.15 $USDC`;

  // Detect if running inside Farcaster/Warpcast
  const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
  
  // Construct the cast intent URL
  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(squareImageUrl)}&embeds[]=${encodeURIComponent(miniAppUrl)}`;

  try {
    if (isFarcaster) {
      // Farcaster environment-এর জন্য SDK ব্যবহার করা ভালো
      sdk.actions.openUrl(castIntentUrl);
    } else {
      // Base App বা অন্য ব্রাউজারের জন্য সরাসরি উইন্ডো ওপেন
      window.open(castIntentUrl, "_blank");
    }
  } catch (error) {
    console.error("Share error:", error);
    window.open(castIntentUrl, "_blank");
  }
};










// const handleShare = () => {
//     if (!scoreLoaded || userData.fid === "0") {
//       alert("Score still syncing, please wait...");
//       return;
//     }

//     const baseUrl = "https://mints.personalids.xyz";
//     const currentRank = getRankLabel(actualScore);
    
//     // 👇 CHANGE: PFP parameter remove kore dewa hoyeche URL choto rakhte
//     const frameUrl = `${baseUrl}/api/frame?username=${encodeURIComponent(userData.displayName)}&fid=${userData.fid}&score=${actualScore.toFixed(2)}&rank=${encodeURIComponent(currentRank)}&t=${Date.now()}`;
    
//     const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Neynar Score\n💰 Win 0.01 $USDC + Lucky Bonuses`;

//     try {
//       // ✅ SDK অ্যাকশন ব্যবহার করে সরাসরি শেয়ার উইন্ডো ওপেন করা হচ্ছে
//       sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`);
//     } catch (error) {
//       console.error("Share error:", error);
//       const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
//       window.open(castIntent, "_blank");
//     }
//   };






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
          <h1 className={styles.title}>NEYNAR SCORE</h1>
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





















// "use client";

// import React, { useState, useEffect } from "react";
// import styles from "./score.module.css";
// import { Moon, Sun, Share2, ShieldCheck, Zap } from "lucide-react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import miniApp, { sdk } from "@farcaster/miniapp-sdk";
// import Leaderboard from "./leaderboard/page";
// import Image from "next/image";

// export default function ScorePage() {
//   const { context } = useMiniKit();
//   const [setFrameContext] = useState<any>(null);
  
//   // 👇 STATE CLEANUP: Shudhu eita use hobe
//   const [isDarkMode, setIsDarkMode] = useState(true);
  
//   const [displayScore, setDisplayScore] = useState(0.0);
  
//   const [scoreLoaded, setScoreLoaded] = useState(false);
//   const [actualScore, setActualScore] = useState(0.0);
//   const [userData, setUserData] = useState({
//     displayName: "User",
//     fid: "0",
//     pfpUrl: "https://placehold.co/100x100?text=User"
//   });

//   const fetchNeynarScore = async (fid: string) => {
//     try {
//       console.log(`Fetching score for FID: ${fid}...`); 
      
//       const response = await fetch(`/api/get-score?fid=${fid}`);

//       if (!response.ok) {
//         console.error("API Error:", response.status);
//         return;
//       }

//       const data = await response.json();
      
//       if (data && typeof data.score !== 'undefined') {
//         const score = data.score;
//         setActualScore(score);
//         setScoreLoaded(true);
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
//         if (userFid !== "0" && !scoreLoaded) fetchNeynarScore(userFid); 
//       }
      
//     }).catch(() => {});

//     if (context?.user) {
//       const userFid = context.user.fid?.toString() || "0";
//       setUserData({
//         displayName: context.user.displayName || "User",
//         fid: userFid,
//         pfpUrl: context.user.pfpUrl || "https://placehold.co/100x100?text=User"
//       });
//       if (userFid !== "0" && !scoreLoaded) fetchNeynarScore(userFid);
//     }
//   }, [context, scoreLoaded, setFrameContext]);

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
//     if (!scoreLoaded || userData.fid === "0") {
//       return;
//     }

//     const baseUrl = "https://mints.personalids.xyz";
//     const currentRank = getRankLabel(actualScore);
    
//     const squareImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(userData.displayName)}&fid=${userData.fid}&score=${actualScore.toFixed(2)}&rank=${encodeURIComponent(currentRank)}&t=${Date.now()}`;
//     const miniAppUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
    
//     const shareText = `My Neynar Reputation Score is ${actualScore.toFixed(2)} ⚡🔵\n\nMint ID & Check Score to claim daily rewards! 🎁\n\n✅ Mint ID\n✅ Check Your Neynar Score\n💰 Win 0.01 $USDC + Lucky Bonuses upto 0.15 $USDC`;

//     const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
    
//     const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(squareImageUrl)}&embeds[]=${encodeURIComponent(miniAppUrl)}`;

//     try {
//       if (isFarcaster) {
//         sdk.actions.openUrl(castIntentUrl);
//       } else {
//         window.open(castIntentUrl, "_blank");
//       }
//     } catch (error) {
//       console.error("Share error:", error);
//       window.open(castIntentUrl, "_blank");
//     }
//   };

//   useEffect(() => {
//     if (actualScore === 0 && !scoreLoaded) return;
    
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
//   }, [actualScore, scoreLoaded]);

//   return (
//     // Button click korle `isDarkMode` change hoy, tai puro container style change hobe
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       <nav className={styles.topBar}>
//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={userData.pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
//           </div>
//           <span className={styles.profileName}>{userData.displayName}</span>
//         </div>
        
//         {/* Toggle Button: Eita `isDarkMode` ke TRUE/FALSE kore */}
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

//         {/* --- LEADERBOARD FIX --- */}
//         <div className={styles.leaderboardSection}>
//            <Leaderboard isLightMode={!isDarkMode} />
//         </div>
//       </main>
//     </div>
//   );
// }