

// "use client";

// import { useState, useEffect } from "react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useRouter } from "next/navigation";
// import { useAccount, useReadContract } from "wagmi";
// import { useSendCalls } from "wagmi";
// import { parseEther } from "viem";
// import sdk from "@farcaster/frame-sdk";
// import styles from "./profile.module.css";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

// /* eslint-disable @next/next/no-img-element */

// export default function ProfilePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const router = useRouter();
//   const { address, isConnected } = useAccount();

//   // ✅ States
//   const [isFollowed, setIsFollowed] = useState(false);
//   const [manualStatus, setManualStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasShared, setHasShared] = useState(false);
 
//   const { sendCalls, isPending } = useSendCalls();

//   useEffect(() => {
//     const loadFarcaster = async () => {
//       try {
//         const ctx = await sdk.context;
//         setFrameContext(ctx);
//       } catch (err) {
//         console.error("Farcaster error:", err);
//       }
//     };
//     loadFarcaster();
//   }, []);

//   const user = {
//     fid: context?.user?.fid || frameContext?.user?.fid,
//     displayName: context?.user?.displayName || frameContext?.user?.displayName,
//     pfpUrl: context?.user?.pfpUrl || frameContext?.user?.pfpUrl,
//   };

//   const profileImage = user?.pfpUrl || "";

//   const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [address as `0x${string}`],
//     query: { enabled: isConnected && !!address },
//   });

//   useEffect(() => {
//     if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//       router.replace("/profile/checkin");
//     }
//   }, [nftBalance, isConnected, router]);



//   const handleShare = () => {
//     const baseDomain = "https://mint.personalids.xyz"; 
//     const farcasterMiniAppUrl =
//       "https://farcaster.xyz/miniapps/offLcGmhl94_/personal-id-mint";
//     const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
//     const text =
//       "🔥 I just checked in today! Join me on Personal Onchain ID Minting and Check in Daily 👇";

//     if (isFarcaster) {
//       const shareUrl =
//         "https://warpcast.com/~/compose?" +
//         "text=" +
//         encodeURIComponent(text) +
//         "&embeds[]=" +
//         encodeURIComponent(farcasterMiniAppUrl);
//       window.open(shareUrl, "_blank");
//     } else {
//       const shareUrl =
//         "https://warpcast.com/~/compose?text=" +
//         encodeURIComponent(text) +
//         "&embeds[]=" +
//         encodeURIComponent(baseDomain);
//       window.open(shareUrl, "_blank");
//     }

//     // ✅ share হলে mint unlock-এর জন্য flag true
//     setHasShared(true);
//   };


//   // ✅ Handle Mint using SendCalls
//   const handleMint = async () => {
//     if (!address || !user.fid) return;

//     setManualStatus("Transaction in Progress...");
//     setLoading(true);

//     try {
//       const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
//       const metadataURL = `${baseUrl}/api/metadata/${user.fid}`;

//       sendCalls(
//         {
//           calls: [
//             {
//               to: CONTRACT_ADDRESS as `0x${string}`,
//               abi: ABI,
//               functionName: "mintID",
//               args: [metadataURL],
//               value: parseEther("0.0000067"),
//             },
//           ],
//           capabilities: {
//             // atomic: {
//             //   enabled: true,
//               auxiliaryData: {
//               data: "bc_v7v8guqa" 
//              }
//             // },
//           },

//         },


//         {
//           onSuccess: (data) => {
//             setManualStatus("Mint Successful! Redirecting...");
//             console.log("Bundle ID:", data);
//             setTimeout(() => router.push("/profile/checkin"), 2000);
//           },
//           onError: (err) => {
//             console.error(err);
//             setManualStatus(
//               err.message.includes("rejected")
//                 ? "Transaction Declined"
//                 : "Mint Failed"
//             );
//             setLoading(false);
//           },
//         }
//       );
//     } catch (err) {
//       console.error("Mint Error:", err);
//       setManualStatus("Error occurred");
//       setLoading(false);
//     }
//   };

//   const isProfileLoading = (isConnected && !address) || isBalanceLoading;

//   if (!isConnected || isProfileLoading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Your Onchain Profile Loading...</h2>
//           <p className={styles.loadingSubText}>Syncing with Base Network</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Personal Onchain ID</h1>

//       <div className={styles.card}>
//         <div className={styles.avatarWrapper}>
//           <img
//             src={profileImage || "/default-avatar.png"}
//             alt="User"
//             className={styles.avatar}
//           />
//         </div>
//         <div className={styles.info}>
//           <h3>{user?.displayName || "Base User"}</h3>
//           {user?.fid && <p className={styles.fid}>FID: {user.fid}</p>}
//           <p className={styles.wallet}>
//             Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
//           </p>
//           <span className={styles.badge}>Onchain Identity</span>
//         </div>
//       </div>

//          {(!isFollowed || !hasShared) && (
//         <div className={styles.taskBox}>
//           <h4>Task Required</h4>
//           <p>Follow The Developer Profile and Share To Unlock Mint</p>
//           <a
//             href="https://base.app/profile/stlifestyle"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Follow on Base
//           </a>
//           <div className={styles.orText}>OR</div>
//           <a
//             href="https://farcaster.xyz/stlifestyle.base.eth"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//           >
//             Follow on Farcaster
//           </a>
//           <div className={styles.orText}>AND</div>
//            <button
//             className={styles.followBtn}
//             onClick={handleShare}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Share on Base or Farcaster
//           </button>
//         </div>
//       )}

//       {isFollowed && hasShared && (
//         <div className={styles.mintWrapper}>
//           <button
//             className={styles.mintButton}
//             onClick={handleMint}
//             disabled={
//               loading ||
//               isPending ||
//               (nftBalance ? (nftBalance as bigint) > 0n : false)
//             }
//           >
//             {loading || isPending ? "Minting..." : "MINT ID NOW"}
//           </button>

//           {manualStatus && (
//             <p className={styles.manualStatusText}>{manualStatus}</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









// "use client";

// import { useState, useEffect } from "react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useRouter } from "next/navigation";
// import { useAccount, useReadContract } from "wagmi";
// import { useSendCalls } from "wagmi";
// import { getAddress, isAddress } from "viem";
// import miniApp from "@farcaster/miniapp-sdk";
// import Image from "next/image";

// import styles from "./profile.module.css";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";






// export default function ProfilePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const router = useRouter();
//   const { address, isConnected } = useAccount();

         

//   // ✅ States
//   // const [isFollowed, setIsFollowed] = useState(false);
//   const [manualStatus, setManualStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   // const [hasShared, setHasShared] = useState(false);
 
//   const { sendCalls, isPending } = useSendCalls();

//   const { data: currentMintFee } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     functionName: "mintFee",
//   });

// useEffect(() => {
//   const loadContext = async () => {
//     try {
//       const ctx = await miniApp.context;
//       setFrameContext(ctx);
//     } catch (err) {
//       console.error("MiniApp context error:", err);
//     }
//   };

//   loadContext();
// }, []);

//   const user = {
//     fid: context?.user?.fid || frameContext?.user?.fid,
//     displayName: context?.user?.displayName || frameContext?.user?.displayName,
//     pfpUrl: context?.user?.pfpUrl || frameContext?.user?.pfpUrl,
//   };

//   const profileImage = user?.pfpUrl || "https://placehold.co/100x100?text=?";

//   const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [address as `0x${string}`],
//     query: { enabled: isConnected && !!address },
//   });

//   useEffect(() => {
//     if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//       router.replace("/profile/checkin/giveaway");
//     }
//   }, [nftBalance, isConnected, router]);



//   // const handleShare = () => {
//   //   // const baseDomain = "https://base.app/app/mints.personalids.xyz"; 
//   //   const baseDomain = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 
//   //   const farcasterMiniAppUrl =
//   //     "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//   //   const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
//   //   const text =
//   // "🔥 Mint your Personal Onchain ID & claim +50 PIM rewards instantly! 🚀 Use your PIM to spin for USDC rewards (100 PIM per spin, tokens burn after use). Don't miss out! 👇";


//   //   if (isFarcaster) {
//   //     const shareUrl =
//   //       "https://warpcast.com/~/compose?" +
//   //       "text=" +
//   //       encodeURIComponent(text) +
//   //       "&embeds[]=" +
//   //       encodeURIComponent(farcasterMiniAppUrl);
//   //     window.open(shareUrl, "_blank");
//   //   } else {
//   //     const shareUrl =
//   //       "https://warpcast.com/~/compose?text=" +
//   //       encodeURIComponent(text) +
//   //       "&embeds[]=" +
//   //       encodeURIComponent(baseDomain);
//   //     window.open(shareUrl, "_blank");
//   //   }


//   //   setHasShared(true);
//   // };


// // ✅ Handle Mint using SendCalls
//   const handleMint = async () => {
//     if (!address || !user.fid) return;

//     setManualStatus("Transaction in Progress...");
//     setLoading(true);

// const savedRef = localStorage.getItem("referrer_address");
//   let finalReferrer: `0x${string}` = "0x0000000000000000000000000000000000000000";

//   if (savedRef && isAddress(savedRef)) {
//     const formattedRef = getAddress(savedRef);
//     if (formattedRef.toLowerCase() !== address.toLowerCase()) {
//       finalReferrer = formattedRef;
//     }
//   }

//   // --- নতুন স্ট্যাটাস মেসেজ লজিক ---
//   if (finalReferrer !== "0x0000000000000000000000000000000000000000") {
//     // setManualStatus(`✅ Referral Active: ${finalReferrer.slice(0, 6)}... (Ref count will be added)`);
//   } else {
//     // setManualStatus("ℹ️ Minting Profile (Direct)");
//   }

//   // console.log("🚀 Minting with Referrer:", finalReferrer);

//   try {
//     const metadataURL = `${window.location.origin}/api/metadata/${user.fid}`;



// // setManualStatus(`Checking Ref: ${referrerAddress.slice(0, 6)}...`);


  //     sendCalls(
  //       {
  //         calls: [
  //           {
  //             to: CONTRACT_ADDRESS as `0x${string}`,
  //             abi: ABI,
  //             functionName: "mintID",
  //             // args: [metadataURL],
  //             args: [metadataURL, finalReferrer, BigInt(user.fid)],
  //             // value: parseEther("0"),
  //             value: currentMintFee as bigint,
  //           },
  //         ],
       
  //         capabilities: {
  //           auxiliaryData: {
  //             data: "bc_bmhx0p43" 
  //           }
  //         },
  //       },

  //       {
  //         onSuccess: (data) => {
  //           setManualStatus("Mint Successful! Redirecting...");
  //           console.log("Bundle ID:", data);
  //           setTimeout(() => router.push("/profile/checkin/giveaway"), 2000);
  //         },
  //         onError: (err) => {
  //           // console.error(err);
  //           setManualStatus(
  //             err.message.includes("rejected")
  //               ? "Transaction Declined"
  //               : "Mint Failed"
  //           );
  //           setLoading(false);
  //         },
  //       }
  //     );
  //   } catch {
      
  //     setManualStatus("Mint Error");
  //     setLoading(false);
  //   }
  // };




//   const isProfileLoading = (isConnected && !address) || isBalanceLoading;

//   if (!isConnected || isProfileLoading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Your Onchain Profile Loading...</h2>
//           <p className={styles.loadingSubText}>Syncing with Base Network</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Personal Onchain ID</h1>

//       <div className={styles.card}>
//         <div className={styles.avatarWrapper}>
//           <Image
//   src={profileImage || "/default-avatar.png"}
//   alt="User"
//   className={styles.avatar}
//   width={80} 
//   height={80}
//   unoptimized 
// />
//         </div>
//         <div className={styles.info}>
//           <h3>{user?.displayName || "Base User"}</h3>
//           {user?.fid && <p className={styles.fid}>FID: {user.fid}</p>}
//           <p className={styles.wallet}>
//             Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
//           </p>
//           <span className={styles.badge}>Onchain Identity</span>
//         </div>
//       </div>

//           {/* {(!isFollowed || !hasShared) && ( 
//           // {(!isFollowed) && (
//         <div className={styles.taskBox}>
//           <h4>Task Required</h4>
//           <p>Follow The Developer Profile and Share To Unlock Mint</p>
//           <a
//             href="https://base.app/profile/stlifestyle"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Follow on Base
//           </a>
//           <div className={styles.orText}>OR</div>
//           <a
//             href="https://farcaster.xyz/stlifestyle.base.eth"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//           >
//             Follow on Farcaster
//           </a>
//            <div className={styles.orText}>AND</div>
//            <button
//             className={styles.followBtn}
//             onClick={handleShare}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Share on Base or Farcaster
//           </button> 
//         </div>
//       )} */}

//        {/* {isFollowed && hasShared && ( 
//         {isFollowed && ( */}
//         <div className={styles.mintWrapper}>
//           <button
//             className={styles.mintButton}
//             onClick={handleMint}
//             disabled={
//               loading ||
//               isPending ||
//               (nftBalance ? (nftBalance as bigint) > 0n : false)
//             }
//           >
//             {loading || isPending ? "Minting..." : "MINT ID NOW"}
//           </button>

//           {manualStatus && (
//             <p className={styles.manualStatusText}>{manualStatus}</p>
//           )}
//         </div>
//       {/* )} */}
//     </div>
//   );
// }

















































// "use client";

// import { useState, useEffect } from "react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useRouter } from "next/navigation";
// import { useAccount, useReadContract, useSendCalls } from "wagmi";
// import { getAddress, isAddress } from "viem";
// import miniApp from "@farcaster/miniapp-sdk";
// import Image from "next/image";
// import { Moon, Sun, ChevronLeft } from "lucide-react"; 

// import styles from "./profile.module.css";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

// export default function ProfilePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const router = useRouter();
//   const { address, isConnected } = useAccount();

//   const [manualStatus, setManualStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { sendCalls, isPending } = useSendCalls();

//   useEffect(() => {
//     if (!isDarkMode) {
//       document.body.classList.add('light-mode');
//     } else {
//       document.body.classList.remove('light-mode');
//     }
//   }, [isDarkMode]);

//   useEffect(() => {
//     const loadContext = async () => {
//       try {
//         const ctx = await miniApp.context;
//         setFrameContext(ctx);
//       } catch (err) {
//         console.error("MiniApp context error:", err);
//       }
//     };
//     loadContext();
//   }, []);

//   // ডিফল্ট PFP যদি ইমেজ না থাকে
//   const DEFAULT_PFP = "https://placehold.co/400x400/0052FF/ffffff?text=?";

//   const user = {
//     fid: context?.user?.fid || frameContext?.user?.fid,
//     displayName: context?.user?.displayName || frameContext?.user?.displayName || "Base User",
//     username: context?.user?.username || frameContext?.user?.username || "base.eth",
//     pfpUrl: (context?.user?.pfpUrl && context.user.pfpUrl !== "") 
//             ? context.user.pfpUrl 
//             : (frameContext?.user?.pfpUrl && frameContext.user.pfpUrl !== "") 
//             ? frameContext.user.pfpUrl 
//             : DEFAULT_PFP,
//   };

//   const { data: currentMintFee } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     functionName: "mintFee",
//   });

//   const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [address as `0x${string}`],
//     query: { enabled: isConnected && !!address },
//   });






//   useEffect(() => {
//     if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//       router.replace("/profile/checkin");
//     }
//   }, [nftBalance, isConnected, router]);






  
//   const handleMint = async () => {
//     if (!address || !user.fid) return;
//     setManualStatus("Transaction in Progress...");
//     setLoading(true);

//     const savedRef = localStorage.getItem("referrer_address");
//     let finalReferrer: `0x${string}` = "0x0000000000000000000000000000000000000000";

//     if (savedRef && isAddress(savedRef)) {
//       const formattedRef = getAddress(savedRef);
//       if (formattedRef.toLowerCase() !== address.toLowerCase()) {
//         finalReferrer = formattedRef;
//       }
//     }
// // setManualStatus(`✅ Ref Found: ${finalReferrer.slice(0, 6)}...${finalReferrer.slice(-4)}`);
//     try {
//       const metadataURL = `${window.location.origin}/api/metadata/${user.fid}`;

          
//       sendCalls(
//         {
//           calls: [
//             {
//               to: CONTRACT_ADDRESS as `0x${string}`,
//               abi: ABI,
//               functionName: "mintID",
//               // args: [metadataURL],
//               args: [metadataURL, finalReferrer, BigInt(user.fid)],
//               // value: parseEther("0"),
//               value: currentMintFee as bigint,
//             },
//           ],
       
//           capabilities: {
//             auxiliaryData: {
//               data: "bc_bmhx0p43" 
//             }
//           },
//         },

//         {
//           onSuccess: (data) => {
//             setManualStatus("Mint Successful! Redirecting...");
//             console.log("Bundle ID:", data);
//             setTimeout(() => router.push("/profile/checkin"), 2000);
//           },
//           onError: (err) => {
//             // console.error(err);
//             setManualStatus(
//               err.message.includes("rejected")
//                 ? "Transaction Declined"
//                 : "Mint Failed"
//             );
//             setLoading(false);
//           },
//         }
//       );
//     } catch {
      
//       setManualStatus("Mint Error");
//       setLoading(false);
//     }
//   };

//   const isProfileLoading = (isConnected && !address) || isBalanceLoading;

//   if (!isConnected || isProfileLoading) {
//     return (
//       <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Loading Profile...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
//       {/* Top Bar */}
//       <nav className={styles.topBar}>

//       <button 
//           className={styles.backButton} 
//           onClick={() => router.push("/profile/checkin")}
//         >
//           <ChevronLeft size={20} />
//         </button>


//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={user.pfpUrl} alt="PFP" className={styles.miniPfp} width={24} height={24} unoptimized />
//           </div>
//           <span className={styles.profileName}>{user.displayName}</span>
//         </div>
//         <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
//           {isDarkMode ? <Moon size={16} className={styles.iconBlue} /> : <Sun size={16} className={styles.iconOrange} />}
//         </button>
//       </nav>

//       {/* Header Section */}
// <div className={styles.headerSection}>
//         <h1 className={styles.title}>Personal Onchain ID</h1>
//         <p className={styles.subtitle}>
//           Mint ID to unlock Daily Check-in & Tasks, This is the key of mini app to access all features.
//           <br />
//           <span className={styles.referralNote}>
//             (Referrals count only after the invited user mints their ID)
//           </span>
//         </p>
//       </div>
// {/* Personal Onchain ID */}
//       {/* Premium Compact Card */}
//       <div className={styles.premiumCard}>
//         <div className={styles.cardContent}>
          
//           {/* Left: Profile Image */}
//           <div className={styles.pfpContainer}>
//             <Image 
//               src={user.pfpUrl} 
//               alt="Profile" 
//               className={styles.cardPfp} 
//               width={80} 
//               height={80} 
//               unoptimized
//             />
//           </div>

//           {/* Right: User Details */}
//           <div className={styles.cardDetails}>
//             <h2 className={styles.cardName}>{user.displayName}</h2>
//             <p className={styles.cardHandle}>@{user.username}</p>
//             <p className={styles.cardFid}>FID: {user.fid}</p>
            
//             <div className={styles.onchainBadgeWrapper}>
//               <span className={styles.onchainBadge}>Onchain Identity</span>
//             </div>
//           </div>

//         </div>

//         {/* Bottom Verified Badge */}
//         <div className={styles.verifiedBadge}>
//           VERIFIED PIM USER
//         </div>
//       </div>

//       {/* Mint Button Section */}
//       <div className={styles.mintWrapper}>
//         <button
//           className={styles.mintButton}
//           onClick={handleMint}
//           disabled={loading || isPending || (nftBalance ? (nftBalance as bigint) > 0n : false)}
//         >
//           {loading || isPending ? "Minting..." : "MINT ID NOW"}
//         </button>

//         {manualStatus && (
//           <p className={styles.manualStatusText}>{manualStatus}</p>
//         )}
//       </div>
//     </div>
//   );
// }

























"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";


import miniApp from "@farcaster/miniapp-sdk";
import Image from "next/image";
import { Moon, Sun, ChevronLeft } from "lucide-react"; 
import { useAccount, useReadContract, useSendTransaction } from "wagmi"; 
import { getAddress, isAddress, encodeFunctionData, concat } from "viem"; 
import { Attribution } from "ox/erc8021"; // Attribution নিন

import styles from "./profile.module.css";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

export default function ProfilePage() {
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [manualStatus, setManualStatus] = useState("");
  const [loading, setLoading] = useState(false);
const { sendTransactionAsync, isPending } = useSendTransaction();

  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await miniApp.context;
        setFrameContext(ctx);
      } catch (err) {
        console.error("MiniApp context error:", err);
      }
    };
    loadContext();
  }, []);

  // ডিফল্ট PFP যদি ইমেজ না থাকে
  const DEFAULT_PFP = "https://placehold.co/400x400/0052FF/ffffff?text=?";

  const user = {
    fid: context?.user?.fid || frameContext?.user?.fid,
    displayName: context?.user?.displayName || frameContext?.user?.displayName || "Base User",
    username: context?.user?.username || frameContext?.user?.username || "base.eth",
    pfpUrl: (context?.user?.pfpUrl && context.user.pfpUrl !== "") 
            ? context.user.pfpUrl 
            : (frameContext?.user?.pfpUrl && frameContext.user.pfpUrl !== "") 
            ? frameContext.user.pfpUrl 
            : DEFAULT_PFP,
  };

  const { data: currentMintFee } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "mintFee",
  });

  const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: isConnected && !!address },
  });






  // useEffect(() => {
  //   if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
  //     router.replace("/profile/checkin");
  //   }
  // }, [nftBalance, isConnected, router]);


useEffect(() => {
    if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
      router.replace("/profile/checkin/info");
    }
  }, [nftBalance, isConnected, router]);



  const handleMint = async () => {
    if (!address || !user.fid) return;
    setManualStatus("Transaction in Progress...");
    setLoading(true);

    // ১. রেফারার লজিক (আপনার যা ছিল তাই)
    const savedRef = localStorage.getItem("referrer_address");
    let finalReferrer: `0x${string}` = "0x0000000000000000000000000000000000000000";

    if (savedRef && isAddress(savedRef)) {
      const formattedRef = getAddress(savedRef);
      if (formattedRef.toLowerCase() !== address.toLowerCase()) {
        finalReferrer = formattedRef;
      }
    }

    try {
      const metadataURL = `${window.location.origin}/api/metadata/${user.fid}`;

      // 🔥 ২. ফাংশন ডাটা এনকোড করা 🔥
      const functionData = encodeFunctionData({
        abi: ABI,
        functionName: "mintID",
        args: [metadataURL, finalReferrer, BigInt(user.fid)],
      });

      // 🔥 ৩. বিল্ডার কোড সাফিক্স তৈরি করা 🔥
      const builderSuffix = Attribution.toDataSuffix({
        codes: ["bc_bmhx0p43"], // আপনার সঠিক কোড
      });

      // 🔥 ৪. ডাটা জোড়া লাগানো (Function + Builder Code) 🔥
      const finalCalldata = concat([functionData, builderSuffix]);

      // 🔥 ৫. ট্রানজেকশন পাঠানো 🔥
      const hash = await sendTransactionAsync({
        to: CONTRACT_ADDRESS as `0x${string}`,
        value: currentMintFee as bigint, // ফি পাঠানো
        data: finalCalldata, // 👈 এটাই আসল কাজ করছে
      });

      if (hash) {
        setManualStatus("Mint Successful! Redirecting...");
        console.log("Tx Hash:", hash);
        setTimeout(() => router.push("/profile/checkin"), 2000);
      }

    } catch (error: any) {
      console.error("Mint Error:", error);
      setManualStatus(
        error.message?.includes("rejected") || error.code === 4001
          ? "Transaction Declined"
          : "Mint Failed"
      );
      setLoading(false);
    }
  };

  // const isProfileLoading = (isConnected && !address) || isBalanceLoading;
  const isProfileLoading = (isConnected && !address) || isBalanceLoading || (!loading && nftBalance !== undefined && (nftBalance as bigint) > 0n);

  if (!isConnected || isProfileLoading) {
    return (
      <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
      {/* Top Bar */}
      <nav className={styles.topBar}>

      <button 
          className={styles.backButton} 
          onClick={() => router.push("/profile/checkin")}
        >
          <ChevronLeft size={20} />
        </button>


        <div className={styles.profileSummary}>
          <div className={styles.miniPfpWrapper}>
            <Image src={user.pfpUrl} alt="PFP" className={styles.miniPfp} width={24} height={24} unoptimized />
          </div>
          <span className={styles.profileName}>{user.displayName}</span>
        </div>
        <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={16} className={styles.iconBlue} /> : <Sun size={16} className={styles.iconOrange} />}
        </button>
      </nav>

      {/* Header Section */}
<div className={styles.headerSection}>
        <h1 className={styles.title}>Personal Onchain ID</h1>
        <p className={styles.subtitle}>
          Mint ID to unlock Daily Check-in & Tasks, This is the key of mini app to access all features.
          <br />
          <span className={styles.referralNote}>
            (Referrals count only after the invited user mints their ID)
          </span>
        </p>
      </div>
{/* Personal Onchain ID */}
      {/* Premium Compact Card */}
      <div className={styles.premiumCard}>
        <div className={styles.cardContent}>
          
          {/* Left: Profile Image */}
          <div className={styles.pfpContainer}>
            <Image 
              src={user.pfpUrl} 
              alt="Profile" 
              className={styles.cardPfp} 
              width={80} 
              height={80} 
              unoptimized
            />
          </div>

          {/* Right: User Details */}
          <div className={styles.cardDetails}>
            <h2 className={styles.cardName}>{user.displayName}</h2>
            <p className={styles.cardHandle}>@{user.username}</p>
            <p className={styles.cardFid}>FID: {user.fid}</p>
            
            <div className={styles.onchainBadgeWrapper}>
              <span className={styles.onchainBadge}>Onchain Identity</span>
            </div>
          </div>

        </div>

        {/* Bottom Verified Badge */}
        <div className={styles.verifiedBadge}>
          VERIFIED PIM USER
        </div>
      </div>

      {/* Mint Button Section */}
      <div className={styles.mintWrapper}>
        <button
          className={styles.mintButton}
          onClick={handleMint}
          disabled={loading || isPending || (nftBalance ? (nftBalance as bigint) > 0n : false)}
        >
          {loading || isPending ? "Minting..." : "MINT ID NOW"}
        </button>

        {manualStatus && (
          <p className={styles.manualStatusText}>{manualStatus}</p>
        )}
      </div>
    </div>
  );
}