// "use client";

// import React, { useState, useEffect } from "react";
// import styles from "./score.module.css";
// import { Moon, Sun, Share2, ShieldCheck, Zap } from "lucide-react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import miniApp from "@farcaster/miniapp-sdk";
// import Image from "next/image";

// export default function ScorePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [displayScore, setDisplayScore] = useState(0.0);
//   const finalScore = 0.19; 

//   // 🚩 Neynar Score ভিত্তিক অটো পারসেন্টেজ র‍্যাঙ্ক লজিক
//   const getRankLabel = (score: number) => {
//     if (score >= 0.90) return "TOP 1% OF USERS";
//     if (score >= 0.75) return "TOP 5% OF USERS";
//     if (score >= 0.60) return "TOP 10% OF USERS";
//     if (score >= 0.40) return "TOP 20% OF USERS";
//     if (score >= 0.20) return "TOP 30% OF USERS";
//     if (score >= 0.10) return "TOP 50% OF USERS"; 
//     return "TOP 75% OF USERS";
//   };

//   // 🚩 শেয়ার লজিক: এটি আপনার অ্যাপ লিঙ্কের সাথে ডায়নামিক কার্ড ইমেজ এমবেড করবে
// // const handleShare = () => {
// //   const currentRank = getRankLabel(finalScore);
// //   const shareText = `Check out my Farcaster Reputation Score! ⚡`;
  
// //   // ১. আপনার ডিজাইন করা Neynar কার্ডের ইমেজ লিঙ্ক (যা আপনার api/og থেকে আসবে)
// //   const baseUrl = "https://prevent-toolbox-stevens-thats.trycloudflare.com"; 
// //   const ogImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(displayName)}&fid=${fid}&score=${finalScore.toFixed(2)}&pfp=${encodeURIComponent(pfpUrl)}&rank=${encodeURIComponent(currentRank)}&v=${Date.now()}`;

// //   // ২. আপনার মেইন অ্যাপের জয়েন লিঙ্ক (যা নিচে ছোট এমবেড হিসেবে থাকবে)
// //   const appJoinUrl = `https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint`;

// //   // 🚩 এখানে আমরা embeds[] এ ইমেজ এবং অ্যাপ লিঙ্ক দুটোই পাঠিয়ে দিচ্ছি
// //   const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(ogImageUrl)}&embeds[]=${encodeURIComponent(appJoinUrl)}`;
  
// //   window.open(castIntent, "_blank");
// // };



// // const handleShare = () => {
// //   // ১. Safety Check: ডাটা লোড না হলে শেয়ার হবে না
// //   if (!displayName || !fid || !finalScore) {
// //     console.warn("Data not ready yet!");
// //     alert("Please wait for your score to load completely.");
// //     return;
// //   }

// //   const baseUrl = "https://mints.personalids.xyz"; 
// //   const currentRank = getRankLabel(finalScore); 
  
// //   // ২. ডাটা এনকোড করা
// //   const safeUsername = encodeURIComponent(displayName);
// //   const safeFid = fid.toString();
// //   // স্কোর স্ট্রিং নিশ্চিত করা
// //   const safeScore = finalScore.toFixed(2); 
// //   const safeRank = encodeURIComponent(currentRank);
// //   // PFP লিংক এনকোড করা (খুব জরুরি)
// //   const safePfp = encodeURIComponent(pfpUrl || '');
// //   // টাইমস্ট্যাম্প
// //   const timestamp = Date.now();

// //   // ৩. Frame URL তৈরি
// //   // আমরা এখানে 't' পাঠাচ্ছি, যা backend রিসিভ করে ইমেজে বসাবে
// //   const frameUrl = `${baseUrl}/api/frame?username=${safeUsername}&fid=${safeFid}&score=${safeScore}&rank=${safeRank}&pfp=${safePfp}&t=${timestamp}`;

// //   // ৪. শেয়ার টেক্সট
// //   const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵

// // Join Personal ID Mint to verify your identity and claim rewards daily! 🎁

// // ✅ Mint ID
// // ✅ Check Score
// // 💰 Win 0.01 $USDC + Lucky Bonuses

// // Get started here 👇`;

// //   // ৫. Warpcast Intent
// //   const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
  
// //   // ৬. Debugging (Console Check)
// //   console.log("---- READY TO SHARE ----");
// //   console.log("Link:", frameUrl);
  
// //   // ৭. ওপেন
// //   window.open(castIntent, "_blank");
// // };






// const handleShare = () => {
//   // ১. সেফটি চেক
//   if (!displayName || !fid || !finalScore) {
//     alert("Please wait for your score to load completely.");
//     return;
//   }

//   // ২. কনফিগারেশন
//   const baseUrl = "https://mints.personalids.xyz"; 
  
//   const currentRank = getRankLabel(finalScore); 
  
//   // ৩. ডাটা এনকোড
//   const safeUsername = encodeURIComponent(displayName);
//   const safeFid = fid.toString();
//   const safeScore = finalScore.toFixed(2);
//   const safeRank = encodeURIComponent(currentRank);
//   const safePfp = encodeURIComponent(pfpUrl || '');
//   const timestamp = Date.now();

//   // ৪. Frame URL (ইমেজ দেখানোর জন্য এটাই Embed হবে)
//   // এটিই ব্যাকগ্রাউন্ডে আপনার farcaster.xyz লিংককে টার্গেট করছে (route.ts এর মাধ্যমে)
//   const frameUrl = `${baseUrl}/api/frame?score=${safeScore}&fid=${safeFid}&username=${safeUsername}&rank=${safeRank}&pfp=${safePfp}&t=${timestamp}`;

//   // ৫. শেয়ার টেক্সট (লিংক ছাড়া)
//   // লিংক সরিয়ে ফেলা হলো, এখন শুধু সুন্দর ক্যাপশন থাকবে
//   const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵

// Mint ID & Check Score to claim daily rewards! 🎁

// ✅ Mint ID
// ✅ Check Score
// 💰 Win 0.01 $USDC + Lucky Bonuses`;

//   // ৬. Warpcast Intent
//   // embeds[] এ frameUrl যাচ্ছে -> ফলে ছবি দেখাবে ডাইনামিক
//   // frameUrl এর বাটনে ক্লিক করলে -> farcaster.xyz ওপেন হবে (যা route.ts এ সেট করা আছে)
//   const castIntent = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(frameUrl)}`;
  
//   window.open(castIntent, "_blank");
// };



//   // SDK context load
//   useEffect(() => {
//     miniApp.context.then(setFrameContext).catch(() => {});
//   }, []);

//   // Count-up animation logic (Smooth 60fps)
//   useEffect(() => {
//     let start = 0;
//     const duration = 2000; 
//     const frameRate = 1000 / 60;
//     const totalFrames = duration / frameRate;
//     const increment = finalScore / totalFrames;

//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= finalScore) {
//         setDisplayScore(finalScore);
//         clearInterval(timer);
//       } else {
//         setDisplayScore(start);
//       }
//     }, frameRate);
//     return () => clearInterval(timer);
//   }, [finalScore]);

//   // User details fallback
//   const user = context?.user || frameContext?.user;
//   const displayName = user?.displayName || user?.username || "Saiful Islam";
//   const fid = user?.fid || "123456";
//   const pfpUrl = user?.pfpUrl || "https://placehold.co/100x100?text=User";

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       {/* Premium Top Navigation */}
//       <nav className={styles.topBar}>
//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
//           </div>
//           <span className={styles.profileName}>{displayName}</span>
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

//         {/* The Professional Score Card */}
//         <section className={styles.idCard}>
//           <div className={styles.cardGlassOverlay}></div>
          
//           <div className={styles.cardHeader}>
//              <ShieldCheck size={14} />
//              <span>VERIFIED IDENTITY</span>
//           </div>
          
//           <div className={styles.identitySection}>
//             <div className={styles.avatarContainer}>
//                <div className={styles.avatarRing}>
//                   <Image src={pfpUrl} alt="User Profile" className={styles.pfpGol} width={90} height={90} unoptimized />
//                </div>
//             </div>
//             <div className={styles.userDetails}>
//                <h2 className={styles.nameLabel}>User: <span className={styles.whiteText}>{displayName}</span></h2>
//                <p className={styles.fidLabel}>FID: <span className={styles.fidValue}>{fid}</span></p>
//             </div>
//           </div>

//           <div className={styles.scoreSection}>
//             <div className={styles.scoreTitle}>ACTIVITY NEYNAR SCORE</div>
//             <div className={styles.scoreNumber}>
//               {displayScore.toFixed(2)}
//             </div>
            
//             <div className={styles.rankBadge}>
//               <Zap size={12} fill="currentColor" />
//               <span>{getRankLabel(finalScore)}</span>
//             </div>
//           </div>
          
//           <div className={styles.cardFooterAccent}></div>
//         </section>

//         {/* 🚩 এখানে আপনার শেয়ার বাটনটি কাজ করবে */}
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
  
  // 🚩 ম্যানুয়াল স্কোর বাদ দিয়ে স্টেট ব্যবহার করা হয়েছে
  const [actualScore, setActualScore] = useState(0.0);
  const [userData, setUserData] = useState({
    displayName: "User",
    fid: "0",
    pfpUrl: "https://placehold.co/100x100?text=User"
  });

  // 🚩 Neynar API থেকে আসল স্কোর নিয়ে আসার ফাংশন
  const fetchNeynarScore = async (fid: string) => {
    try {
      const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
          'api_key': 'YOUR_NEYNAR_API_KEY' // আপনার Neynar API Key এখানে দিন
        }
      });
      const data = await response.json();
      const score = data.users[0]?.profile?.score || 0;
      setActualScore(score);
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
        if (userFid !== "0") fetchNeynarScore(userFid); // আসল স্কোর কল করা
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
    return "TOP 75% OF USERS";
  };

  const handleShare = () => {
    if (userData.fid === "0") {
      alert("Please wait for your score to load completely.");
      return;
    }

    const baseUrl = "https://mints.personalids.xyz";
    const currentRank = getRankLabel(actualScore);
    
    const safeUsername = encodeURIComponent(userData.displayName);
    const safeFid = userData.fid;
    const safeScore = actualScore.toFixed(2);
    const safeRank = encodeURIComponent(currentRank);
    const safePfp = encodeURIComponent(userData.pfpUrl);
    const timestamp = Date.now();

    const frameUrl = `${baseUrl}/api/frame?score=${safeScore}&fid=${safeFid}&username=${safeUsername}&rank=${safeRank}&pfp=${safePfp}&t=${timestamp}`;

      const shareText = `My Neynar Reputation Score is ${safeScore} ⚡🔵

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