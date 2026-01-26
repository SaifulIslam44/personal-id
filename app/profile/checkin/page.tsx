



// "use client";

// import { useState,useEffect } from "react";
// import { useAccount, useReadContract, useSendCalls } from "wagmi";
// import { parseEther, formatEther } from "viem";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./checkin.module.css";
// import { useConnect } from "wagmi";

// const DEGEN_TOKEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

// export default function CheckInPage() {
//   const { address, isConnected, isReconnecting, isConnecting } = useAccount();
//   const [message, setMessage] = useState("");
//   const [justCheckedIn, setJustCheckedIn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [claimLoading, setClaimLoading] = useState(false);

//   const { sendCalls, isPending } = useSendCalls();
// const { connect, connectors } = useConnect();

// useEffect(() => {
//   if (!isConnected && connectors.length > 0) {
//     connect({ connector: connectors[0] });
//   }
// }, [isConnected, connect, connectors]);


//   // ১. চেক-ইন ডাটা রিড
//   const { data: lastCheckInData, refetch: refetchTime } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "lastCheckIn",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   // ২. রিওয়ার্ড পুল সাপ্লাই রিড
//   const { data: contractTokenBalance, refetch: refetchSupply } = useReadContract({
//     address: DEGEN_TOKEN_ADDRESS as `0x${string}`,
//     abi: [
//       {
//         constant: true,
//         inputs: [{ name: "_owner", type: "address" }],
//         name: "balanceOf",
//         outputs: [{ name: "balance", type: "uint256" }],
//         type: "function",
//       },
//     ],
//     functionName: "balanceOf",
//     args: [CONTRACT_ADDRESS as `0x${string}`],
//   });

//   // ৩. ইউজারের পয়েন্ট রিড
//   const { data: userPoints, refetch: refetchPoints } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "getUserPoints",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   const lastCheckIn = lastCheckInData ? Number(lastCheckInData) : 0;
//   const currentSupply = contractTokenBalance ? Math.floor(Number(formatEther(contractTokenBalance as bigint))) : 0;
//   const availablePoints = userPoints ? Number(userPoints) : 0;

//   const MIN_POINTS_TO_CLAIM = 2;

//   const canCheckIn = () => {
//     if (justCheckedIn) return false;
//     if (lastCheckIn === 0) return true;
//     const dayInSeconds = 24 * 60 * 60;
//     const currentTime = Math.floor(Date.now() / 1000);
//     return currentTime >= lastCheckIn + dayInSeconds;
//   };

//   const handleCheckIn = async () => {
//     if (!canCheckIn() || !address) return;
//     setLoading(true);
//     setMessage("Processing daily check-in...");

//     sendCalls({
//       calls: [{
//         to: CONTRACT_ADDRESS as `0x${string}`,
//         abi: ABI,
//         functionName: "dailyCheckIn",
//         args: [],
//         value: parseEther("0"),
//       }],
//     }, {
//       onSuccess: () => {
//         setJustCheckedIn(true);
       
//         setMessage("Success! You've earned 2 Point. 10 Points = 10 DEGEN.");
//         refetchTime();
//         refetchPoints();
//         setLoading(false);
//       },
//       onError: (err) => {
//         console.error(err);
//         setMessage("Check-in Failed. Try again.");
//         setLoading(false);
//       },
//     });
//   };

//   const handleClaimReward = async () => {
    
//     if (availablePoints < MIN_POINTS_TO_CLAIM) {
//       setMessage(`You need at least ${MIN_POINTS_TO_CLAIM} points to claim.`);
//       return;
//     }

//     setClaimLoading(true);
//     setMessage("Sending DEGEN to your wallet...");

//     sendCalls({
//       calls: [{
//         to: CONTRACT_ADDRESS as `0x${string}`,
//         abi: ABI,
//         functionName: "claimRewards",
//         args: [],
//       }],
//     }, {
//       onSuccess: () => {
//         setMessage(`Claim Successful! ${availablePoints} DEGEN sent. 🔥`);
//         refetchPoints();
//         refetchSupply();
//         setClaimLoading(false);
//       },
//       onError: (err) => {
//         console.error(err);
//         setMessage("Claim failed. Please try again.");
//         setClaimLoading(false);
//       },
//     });
//   };

//   const handleShare = () => {
//     const baseDomain = "https://base.app/app/mints.personalids.xyz"; 
//     const farcasterMiniAppUrl = "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint";
//     const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
//   const text =
//   "🔥 I just checked in today! Mint your Personal Onchain ID and earn DEGEN rewards 🚀 Daily check-in = 2 Point, 1 Point = 1 DEGEN, Instant Claim 👇";


//     if (isFarcaster) {
//       const shareUrl = "https://warpcast.com/~/compose?" + "text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(farcasterMiniAppUrl);
//       window.open(shareUrl, "_blank");
//     } else {
//       const shareUrl = "https://warpcast.com/~/compose?text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(baseDomain);
//       window.open(shareUrl, "_blank");
//     }
//   };


//   const lastDate = lastCheckIn > 0 || justCheckedIn
//     ? justCheckedIn ? new Date().toLocaleString() : new Date(lastCheckIn * 1000).toLocaleString()
//     : "Never";



//   if (isReconnecting || isConnecting) {

//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>
//             {(!isConnected && !isConnecting) ? "Wallet Connection Required" : "Syncing Wallet State..."}
//           </h2>
//           <p className={styles.loadingSubText}>
//             {(!isConnected && !isConnecting) ? "We Are Checking Please Wait" : "Connecting to Base Network"}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.supplyHeader}>
//         <span className={styles.supplyDot}></span>
//         Reward Pool: <strong>{currentSupply} DEGEN</strong>
//       </div>

//       <h1 className={styles.title}>Daily Check-in & Earn Rewards</h1>


// <div className={styles.pointsDisplay}>
//   <div className={styles.pointsTitle}>MY PIM</div> 
//   <div className={styles.pointsValue}>{availablePoints}</div> 
//   <div className={styles.pointsLabel}>(1 PIM = 1 DEGEN)</div> 
//   <div className={styles.pointsLabel}>(Per day check-in you will receive 2 PIM)</div> 
// </div>

//       <div className={styles.streakCard}>
//         <div className={styles.streakLabel}>Last Check-in</div>
//         <div className={styles.dateDisplay}>{lastDate}</div>
//       </div>

      


// <div className={canCheckIn() ? styles.statusBoxEligible : styles.statusBoxNotEligible}>
//   <p>
//     {canCheckIn()
//       ? "You are eligible for check-in!"
//       : "Not eligible for today check-in. Come back tomorrow."}
//   </p>
// </div>


// <div className={styles.statusBox}>
//   <p>
//     {availablePoints >= MIN_POINTS_TO_CLAIM 
//       ? `Congrats! You can now claim ${availablePoints} DEGEN.` 
//       : `Next Goal: Reach ${MIN_POINTS_TO_CLAIM} points to unlock claim.`}
//   </p>
// </div>

//       <button
//         className={styles.checkInButton}
//         onClick={handleCheckIn}
//         disabled={loading || isPending || !canCheckIn()}
//       >
//         {loading || isPending ? "Checking..." : canCheckIn() ? "CHECK IN (+2 PIM)" : "ALREADY CHECKED IN"}
//       </button>

//       {message && <p className={styles.message}>{message}</p>}

//       <div className={styles.actionRow}>
//         <button className={styles.shareButton} onClick={handleShare}>
//           Share
//         </button>
        
//         <button 
//           className={availablePoints >= MIN_POINTS_TO_CLAIM ? styles.claimActive : styles.rewardButton} 
//           onClick={handleClaimReward}
//           disabled={claimLoading || availablePoints < MIN_POINTS_TO_CLAIM}
//         >
//           {claimLoading 
//             ? "Claiming..." 
//             : availablePoints >= MIN_POINTS_TO_CLAIM 
//               ? `CLAIM ${availablePoints} DEGEN` 
//               : `LOCKED (<${MIN_POINTS_TO_CLAIM} PTS)`}
//         </button>
//       </div>
//     </div>
//   );
// }








































// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract, useSendCalls } from "wagmi";
// import { parseEther, formatEther, formatUnits } from "viem";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./checkin.module.css";
// import { useConnect } from "wagmi";

// const DEGEN_TOKEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

// export default function CheckInPage() {
//   const { address, isConnected, isReconnecting, isConnecting } = useAccount();
//   const [message, setMessage] = useState("");
//   const [justCheckedIn, setJustCheckedIn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [claimLoading, setClaimLoading] = useState(false);
//   const [isSpinning, setIsSpinning] = useState(false);

//   const { sendCalls } = useSendCalls(); // isPending সরিয়ে দেওয়া হয়েছে কনফ্লিক্ট এড়াতে
//   const { connect, connectors } = useConnect();

//   const USDC_LOGO = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=032";

//   useEffect(() => {
//     if (!isConnected && connectors.length > 0) {
//       connect({ connector: connectors[0] });
//     }
//   }, [isConnected, connect, connectors]);

//   // ১. চেক-ইন ডাটা রিড
//   const { data: lastCheckInData, refetch: refetchTime } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "lastCheckIn",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   // ২. রিওয়ার্ড পুল সাপ্লাই রিড
//   const { data: contractTokenBalance, refetch: refetchSupply } = useReadContract({
//     address: DEGEN_TOKEN_ADDRESS as `0x${string}`,
//     abi: [{ constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" }],
//     functionName: "balanceOf",
//     args: [CONTRACT_ADDRESS as `0x${string}`],
//   });

//   // ৩. ইউজারের পয়েন্ট রিড
//   const { data: userPoints, refetch: refetchPoints } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "getUserPoints",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   // ৪. স্পিন রিওয়ার্ড রিড (USDC Rewards)
//   const { data: pendingSpinRewards, refetch: refetchSpinRewards } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "getPendingRewards",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   const lastCheckIn = lastCheckInData ? Number(lastCheckInData) : 0;
//   const currentSupply = contractTokenBalance ? Math.floor(Number(formatEther(contractTokenBalance as bigint))) : 0;
//   const availablePoints = userPoints ? Number(userPoints) : 0;
//   const spinRewards = pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 18) : "0";

//   const canCheckIn = () => {
//     if (justCheckedIn) return false;
//     if (lastCheckIn === 0) return true;
//     const dayInSeconds = 24 * 60 * 60;
//     const currentTime = Math.floor(Date.now() / 1000);
//     return currentTime >= lastCheckIn + dayInSeconds;
//   };

//   const handleCheckIn = async () => {
//     if (!canCheckIn() || !address) return;
//     setLoading(true);
//     sendCalls({
//       calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "dailyCheckIn", args: [] }],
//     }, {
//       onSuccess: () => {
//         setJustCheckedIn(true);
//         setMessage("Success! +2 PIM earned.");
//         refetchTime(); refetchPoints(); setLoading(false);
//       },
//       onError: (err) => { setMessage("Check-in Failed."); setLoading(false); },
//     });
//   };

//   const handleSpin = async () => {
//     if (availablePoints < 100) return; // বাটন লক লজিক
//     setIsSpinning(true);
//     setMessage("Spinning...");
    
//     sendCalls({
//       calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "spinWheel", args: [] }],
//     }, {
//       onSuccess: () => {
//         setTimeout(async () => {
//           setIsSpinning(false);
//           // ডাটা রিফ্রেশ করা যাতে উইন হওয়া রিওয়ার্ড আপডেট হয়
//           const newRewards = await refetchSpinRewards();
//           const winAmount = newRewards.data ? formatUnits(newRewards.data as bigint, 18) : "0";
//           setMessage(`Congratulations! You won USDC rewards. Total claimable: ${winAmount}`);
//           refetchPoints();
//         }, 3000);
//       },
//       onError: () => { 
//         setIsSpinning(false); 
//         setMessage("Spin failed. Try again.");
//       }
//     });
//   };

//   const handleClaimReward = async () => {
//     if (Number(spinRewards) <= 0) return;
//     setClaimLoading(true);
//     sendCalls({
//       calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "claimSpinRewards", args: [] }],
//     }, {
//       onSuccess: () => {
//         setMessage(`Claim Successful! Rewards sent to wallet.`);
//         refetchSpinRewards(); refetchSupply(); setClaimLoading(false);
//       },
//       onError: (err) => { setMessage("Claim failed."); setClaimLoading(false); },
//     });
//   };

//   const lastDate = lastCheckIn > 0 || justCheckedIn 
//     ? (justCheckedIn ? "Just Now" : new Date(lastCheckIn * 1000).toLocaleString()) 
//     : "Never";

//   if (isReconnecting || isConnecting) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Syncing Wallet State...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.supplyHeader}>
//         <span className={styles.supplyDot}></span>
//         Reward Pool: <strong>{currentSupply} DEGEN</strong>
//       </div>

//       <h1 className={styles.title}>Check-in & Spin to Earn</h1>

//       <div className={styles.spinSection}>
//         <div className={styles.wheelContainer}>
//           <div className={`${styles.wheel} ${isSpinning ? styles.spinning : ""}`}>
//             {[
//               {val: "0.002", s: styles.s1}, 
//               {val: "0.005", s: styles.s2},
//               {val: "0.01", s: styles.s3}, 
//               {val: "0.05", s: styles.s4},
//               {val: "0.1", s: styles.s5}, 
//               {val: "0.004", s: styles.s6},
//               {val: "0.008", s: styles.s7} 
//             ].map((item, idx) => (
//               <div key={idx} className={`${styles.segment} ${item.s}`}>
//                 <div className={styles.rewardBox}>
//                   <span className={styles.rewardValue}>{item.val}</span>
//                   <img src={USDC_LOGO} alt="usdc" className={styles.tokenLogoLarge} />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className={styles.wheelInner}>{isSpinning ? "🌀" : "🎡"}</div>
//         </div>
//         {/* ১০০ PIM না থাকলে বাটন লক এবং ডিজাইন পরিবর্তন */}
//         <button 
//           className={availablePoints >= 100 ? styles.spinButton : styles.spinButtonLocked} 
//           onClick={handleSpin} 
//           disabled={isSpinning || availablePoints < 100}
//         >
//           {isSpinning ? "SPINNING..." : availablePoints >= 100 ? "SPIN (100 PIM)" : "Earn 100PIM to Unlocked"}
//         </button>
//       </div>

//       <div className={styles.pointsDisplayCompact}>
//         <div className={styles.pointsTitle}>MY PIM: <span className={styles.pointsValueSmall}>{availablePoints}</span></div>
//         <div className={styles.pointsLabelSmall}>(Check-in = 2 PIM | Spin = 100 PIM)</div>
//       </div>

//       <div className={styles.streakCard}>
//         <div className={styles.streakLabel}>Last Check-in: <span className={styles.dateText}>{lastDate}</span></div>
//       </div>

//       <div className={canCheckIn() ? styles.statusBoxEligible : styles.statusBoxNotEligible}>
//         <p>{canCheckIn() ? "You are eligible for check-in!" : "Come back tomorrow for next check-in."}</p>
//       </div>

//       {message && <p className={styles.messageBox}>{message}</p>}

//       <div className={styles.actionRow}>
//         <button
//           className={canCheckIn() ? styles.checkInButtonActive : styles.checkInButtonDisabled}
//           onClick={handleCheckIn}
//           disabled={loading || !canCheckIn()}
//         >
//           {loading ? "Checking..." : canCheckIn() ? "CHECK IN" : "CHECKIN DONE"}
//         </button>
        
//         <button 
//           className={Number(spinRewards) > 0 ? styles.claimActive : styles.rewardButton} 
//           onClick={handleClaimReward}
//           disabled={claimLoading || Number(spinRewards) <= 0}
//         >
//           {claimLoading ? "Claiming..." : Number(spinRewards) > 0 ? `CLAIM ${spinRewards}` : `LOCKED`}
//         </button>
//       </div>
//     </div>
//   );
// }




















































































































"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useSendCalls } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
import styles from "./checkin.module.css";
import { useConnect } from "wagmi";
import { useWriteContract } from 'wagmi'; // wagmi থেকে এটি ইমপোর্ট করতে হবে


const USDC_TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export default function CheckInPage() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();
  const [message, setMessage] = useState("");
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinLoading, setSpinLoading] = useState(false); // চেক-ইন বাটনের মতো কাজ করার জন্য নতুন স্টেট
  const [claimLoading, setClaimLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); 
  const [isMounted, setIsMounted] = useState(false);
  const [tempRewards, setTempRewards] = useState<string | null>(null);
  const [oldRewardsRaw, setOldRewardsRaw] = useState<bigint>(BigInt(0));
  const [cooldown, setCooldown] = useState(0); 
  const { sendCalls } = useSendCalls(); 
  const { connect, connectors } = useConnect();
  const { writeContract } = useWriteContract();

  const USDC_LOGO = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=032";

  // ইমেজ এবং ডিফল্ট পজিশন অনুযায়ী ডিগ্রি (0.008 = 0deg)
  const wheelSlices = [
    { val: "0.02", centerDeg: 0 }, 
    { val: "0.006", centerDeg: 51.43 }, 
    { val: "0.01", centerDeg: 102.86 }, 
    { val: "0.03",   centerDeg: 154.29 }, 
    { val: "0.05",   centerDeg: 205.71 }, 
    { val: "0.1",    centerDeg: 257.14 }, 
    { val: "0.008", centerDeg: 308.57 }
  ];

  useEffect(() => {
    setIsMounted(true);
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connect, connectors]);

  useEffect(() => {
  if (cooldown > 0) {
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [cooldown]); // যখনই cooldown পরিবর্তন হবে এটি কাজ করবে

  // স্মার্ট কন্ট্রাক্ট রিড লজিক
  const { data: lastCheckInData, refetch: refetchTime } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "lastCheckIn",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const { data: contractTokenBalance, refetch: refetchSupply } = useReadContract({
    address: USDC_TOKEN_ADDRESS as `0x${string}`,
    abi: [{ constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" }],
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESS as `0x${string}`],
  });

  const { data: userPoints, refetch: refetchPoints } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getUserPoints",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const { data: pendingSpinRewards, refetch: refetchSpinRewards } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPendingRewards",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const lastCheckIn = lastCheckInData ? Number(lastCheckInData) : 0;
  // const currentSupply = contractTokenBalance ? Math.floor(Number(formatEther(contractTokenBalance as bigint))) : 0;
  // const currentSupply = contractTokenBalance ? Math.floor(Number(formatUnits(contractTokenBalance as bigint, 6))) : 0;
const currentSupply = contractTokenBalance ? parseFloat(formatUnits(contractTokenBalance as bigint, 6)).toFixed(2) : "0.00";

  const availablePoints = userPoints ? Number(userPoints) : 0;
  // const spinRewards = pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 18) : "0";
  // const spinRewards = pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 6) : "0";
//  const spinRewards = pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 18) : "0";
// const spinRewards = pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 6) : "0";
const spinRewards = (isSpinning && tempRewards) 
    ? formatUnits(oldRewardsRaw, 6) // স্পিন শেষ না হওয়া পর্যন্ত পুরাতন ব্যালেন্স দেখাবে
    : (pendingSpinRewards ? formatUnits(pendingSpinRewards as bigint, 6) : "0");
  

  const canCheckIn = () => {
    if (!isMounted) return false;
    if (justCheckedIn) return false;
    if (lastCheckIn === 0) return true;
    const dayInSeconds = 24 * 60 * 60;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= lastCheckIn + dayInSeconds;
  };

const handleCheckIn = async () => {
    if (!canCheckIn() || !address) return;
    setLoading(true);
    sendCalls({
      calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "dailyCheckIn", args: [] }],
    }, {
      onSuccess: () => {
        setMessage("Success! Syncing points...");
        
        
        setTimeout(async () => {
          await refetchTime(); 
          await refetchPoints(); 
          setJustCheckedIn(true);
          setMessage("Success! +50 PIM earned.");
          setLoading(false);
        }, 5000); 
      },
      onError: () => { 
        setMessage("Check-in Failed."); 
        setLoading(false); 
      },
    });
  };

//   const handleSpin = async () => {
//     if (availablePoints < 100 || isSpinning || spinLoading || cooldown > 0) return;
//     const currentRewards = pendingSpinRewards ? (pendingSpinRewards as bigint) : BigInt(0);
//     setOldRewardsRaw(currentRewards);
    
//     setSpinLoading(true); // ওয়ালেট কনফার্মেশনের সময় বাটন টেক্সট বদলানোর জন্য
//     setMessage("Please confirm in your wallet...");

//     sendCalls({
//   calls: [
//     {
//       to: CONTRACT_ADDRESS as `0x${string}`,
//       abi: ABI,
//       functionName: "spinWheel",
//       args: [],
//       gas: BigInt(650000) as any, 
//     } as any, 
//   ],
// }, {
//       onSuccess: async () => {
//         setSpinLoading(false); // কনফার্মেশন সফল হলে লোডিং বন্ধ
//         // setMessage("Spinning... Good Luck!");
//         setMessage("Wait Checking Blockchain Confimation. Good Luck!");

//         let attempts = 0;
//         const checkInterval = setInterval(async () => {
//           const { data: newData } = await refetchSpinRewards();
//           const totalNewRewards = newData ? (newData as bigint) : BigInt(0);
//           const winAmountRaw = totalNewRewards - currentRewards;
//           attempts++;

//           if (winAmountRaw > BigInt(0) || attempts >= 15) {
//     clearInterval(checkInterval);
//     setIsSpinning(true);
    
//     const winAmountStr = formatUnits(winAmountRaw, 6);
//     // সরাসরি রিফেচ করা ডাটা দেখানোর বদলে সাময়িকভাবে সেভ করুন
//     setTempRewards(formatUnits(totalNewRewards, 6)); 

//     const slice = wheelSlices.find(s => Math.abs(parseFloat(s.val) - parseFloat(winAmountStr)) < 0.0001);

//     if (slice) {
//         const currentOffset = rotation % 360; 
//         const finalRotation = rotation + 3600 + (360 - currentOffset) + (360 - slice.centerDeg); 
//         setRotation(finalRotation);

//         setTimeout(() => {
//             setIsSpinning(false);
//             // অ্যানিমেশন শেষ হওয়ার পর ক্লেইমএবল ব্যালেন্স আপডেট করুন
//             refetchSpinRewards(); 
//             setTempRewards(null); // টেম্পোরারি ডাটা ক্লিয়ার করুন
            
//             setMessage(`Congratulations! You won ${winAmountStr} USDC`);
//             refetchPoints(); refetchSupply();
//             setCooldown(10);
//         }, 8000); // চাকা ঘোরার সময় (৮ সেকেন্ড)
//     } else {
//               // setIsSpinning(false);
//               // setMessage(`Win: ${winAmountStr} USDC`);
//             }
//           } 
//           // যদি ৩০ সেকেন্ড পার হয়ে যায় (attempts >= 30)
//           else if (attempts >= 10) {
//             clearInterval(checkInterval);
//             setIsSpinning(false);
//             setSpinLoading(false);
//             setMessage("Blockchain Confirmation Failed. Please try again.");
//           }
//         }, 3000);
//       },
//       onError: () => { setSpinLoading(false); setIsSpinning(false); setMessage("Spin failed."); }
//     });
//   };













  const handleSpin = async () => {
    if (availablePoints < 100 || isSpinning || spinLoading || cooldown > 0) return;
    const currentRewards = pendingSpinRewards ? (pendingSpinRewards as bigint) : BigInt(0);
    setOldRewardsRaw(currentRewards);
    
    setSpinLoading(true); // ওয়ালেট কনফার্মেশনের সময় বাটন টেক্সট বদলানোর জন্য
    setMessage("Please confirm in your wallet...");

   writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "spinWheel",
        args: [],
        gas: BigInt(650000), // এটি এখন Basescan-এ সরাসরি ৬৫০,০০০ লিমিট হিসেবে দেখাবে
    }, {
      onSuccess: async () => {
        setSpinLoading(false); // কনফার্মেশন সফল হলে লোডিং বন্ধ
        // setMessage("Spinning... Good Luck!");
        setMessage("Wait Checking Blockchain Confimation. Good Luck!");

        let attempts = 0;
        const checkInterval = setInterval(async () => {
          const { data: newData } = await refetchSpinRewards();
          const totalNewRewards = newData ? (newData as bigint) : BigInt(0);
          const winAmountRaw = totalNewRewards - currentRewards;
          attempts++;

          if (winAmountRaw > BigInt(0) || attempts >= 15) {
    clearInterval(checkInterval);
    setIsSpinning(true);
    
    const winAmountStr = formatUnits(winAmountRaw, 6);
    // সরাসরি রিফেচ করা ডাটা দেখানোর বদলে সাময়িকভাবে সেভ করুন
    setTempRewards(formatUnits(totalNewRewards, 6)); 

    const slice = wheelSlices.find(s => Math.abs(parseFloat(s.val) - parseFloat(winAmountStr)) < 0.0001);

    if (slice) {
        const currentOffset = rotation % 360; 
        const finalRotation = rotation + 3600 + (360 - currentOffset) + (360 - slice.centerDeg); 
        setRotation(finalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            // অ্যানিমেশন শেষ হওয়ার পর ক্লেইমএবল ব্যালেন্স আপডেট করুন
            refetchSpinRewards(); 
            setTempRewards(null); // টেম্পোরারি ডাটা ক্লিয়ার করুন
            
            setMessage(`Congratulations! You won ${winAmountStr} USDC`);
            refetchPoints(); refetchSupply();
            setCooldown(10);
        }, 8000); // চাকা ঘোরার সময় (৮ সেকেন্ড)
    } else {
              // setIsSpinning(false);
              // setMessage(`Win: ${winAmountStr} USDC`);
            }
          } 
          // যদি ৩০ সেকেন্ড পার হয়ে যায় (attempts >= 30)
          else if (attempts >= 10) {
            clearInterval(checkInterval);
            setIsSpinning(false);
            setSpinLoading(false);
            setMessage("Blockchain Confirmation Failed. Please try again.");
          }
        }, 3000);
      },
      onError: () => { setSpinLoading(false); setIsSpinning(false); setMessage("Spin failed."); }
    });
  };













  const handleClaimReward = async () => {
    if (Number(spinRewards) <= 0) return;
    setClaimLoading(true);
    
    sendCalls({
      calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, abi: ABI, functionName: "claimSpinRewards", args: [] }],
    }, {
      onSuccess: async () => {
        setMessage(`Claim Successful! Syncing balance...`);
        
        // ২ সেকেন্ড অপেক্ষা করা যাতে ব্লকচেইন ডাটা আপডেট করতে পারে
        setTimeout(async () => {
          await refetchSpinRewards();
          await refetchSupply();
          setMessage(`Claim Successful! Rewards sent to wallet.`);
          setClaimLoading(false);
        }, 5000); 
      },
      onError: () => { 
        setMessage("Claim failed."); 
        setClaimLoading(false); 
      },
    });
  };

  if (!isMounted) return null;

  const lastDateStr = (lastCheckIn > 0 || justCheckedIn)
    ? (justCheckedIn ? "Just Now" : new Date(lastCheckIn * 1000).toLocaleString()) 
    : "Never";

  if (isReconnecting || isConnecting) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Syncing Wallet State...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.supplyHeader}>
        <span className={styles.supplyDot}></span>
        {/* Reward Pool: <strong>{currentSupply} DEGEN</strong> */}
        Reward Pool: <strong>{currentSupply} USDC</strong>
      </div>

      <h1 className={styles.title}>Check-in & Spin to Earn</h1>

      <div className={styles.spinSection}>
        <div className={styles.wheelContainer}>
          <div 
            className={styles.wheel} 
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transition: isSpinning ? 'transform 8s cubic-bezier(0.15, 0, 0.1, 1)' : 'none' 
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`${styles.segment} ${styles[`s${i}`]}`}>
                <div className={styles.rewardBox}>
                  <span className={styles.rewardValue}>{wheelSlices[i-1].val}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
<img 
  src={USDC_LOGO} 
  alt="usdc" 
  width="24" 
  height="24" 
  className={styles.tokenLogoLarge} 
/>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.wheelInner}>{isSpinning ? "🌀" : "🎡"}</div>
        </div>
        <button 
    className={(availablePoints >= 100 && cooldown === 0 && !isSpinning && !spinLoading) 
        ? styles.spinButton 
        : styles.spinButtonLocked
    } 
    
    onClick={handleSpin} 
    
    disabled={isSpinning || spinLoading || availablePoints < 100 || cooldown > 0}
>
    {spinLoading ? "Confirming..." : 
     isSpinning ? "SPINNING..." : 
     cooldown > 0 ? `Wait ${cooldown}s` : 
     availablePoints >= 100 ? "SPIN (100 PIM)" : "Earn 100PIM to Unlocked"}
</button>
      </div>

      <div className={styles.pointsDisplayCompact}>
        <div className={styles.pointsTitle}>AVAILABLE: <span className={styles.pointsValueSmall}>{availablePoints} PIM</span></div>
        
        <div className={styles.pointsTitle}>ClAIMABLE: <span className={styles.pointsValueSmall}>{spinRewards} $USDC</span></div>
        <div className={styles.pointsLabelSmall}>(Daily Check-in = +50 PIM | Spin = Burn 100 PIM)</div>
      </div>

      <div className={styles.streakCard}>
        <div className={styles.streakLabel}>Last Check-in: <span className={styles.dateText}>{lastDateStr}</span></div>
      </div>

      <div className={canCheckIn() ? styles.statusBoxEligible : styles.statusBoxNotEligible}>
        <p>{canCheckIn() ? "You are eligible for check-in!" : "Come back tomorrow for next check-in."}</p>
      </div>

      {message && <p className={styles.messageBox}>{message}</p>}

      <div className={styles.actionRow}>
        <button
          className={canCheckIn() ? styles.checkInButtonActive : styles.checkInButtonDisabled}
          onClick={handleCheckIn}
          disabled={loading || !canCheckIn()}
        >
          {loading ? "Checking..." : canCheckIn() ? "CHECK IN +50PIM" : "CHECKIN DONE"}
        </button>
        
        <button 
          className={Number(spinRewards) > 0 ? styles.claimActive : styles.rewardButton} 
          onClick={handleClaimReward}
          disabled={claimLoading || Number(spinRewards) <= 0}
        >
          {claimLoading ? "Claiming..." : Number(spinRewards) > 0 ? "CLAIM" : "CLAIM LOCKED"}
        </button>
      </div>
    </div>
  );
}































































































