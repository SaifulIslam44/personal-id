

// "use client";

// import { useState } from "react";
// import { useAccount, useReadContract } from "wagmi";
// // ✅ useSendCalls ইমপোর্ট করা হয়েছে
// import { useSendCalls } from "wagmi";
// import { parseEther } from "viem"; 
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./checkin.module.css";

// export default function CheckInPage() {
//   const { address, isConnected, isReconnecting, isConnecting } = useAccount();
//   const [message, setMessage] = useState("");
//   const [justCheckedIn, setJustCheckedIn] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ✅ useSendCalls Hook
//   const { sendCalls, isPending } = useSendCalls();

//   const { data: lastCheckInData, refetch: refetchTime } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "lastCheckIn",
//     args: [address as `0x${string}`],
//     query: { enabled: !!address },
//   });

//   const lastCheckIn = lastCheckInData ? Number(lastCheckInData) : 0;

//   const canCheckIn = () => {
//     if (justCheckedIn) return false;
//     if (lastCheckIn === 0) return true;
//     const dayInSeconds = 24 * 60 * 60;
//     const currentTime = Math.floor(Date.now() / 1000);
//     return currentTime >= lastCheckIn + dayInSeconds;
//   };

// // ✅ Handle Check-in using SendCalls
// const handleCheckIn = async () => {
//   if (!canCheckIn() || !address) return;

//   setLoading(true);
//   setMessage("Confirming Check-in...");

  
//   sendCalls(
//     {
//       calls: [
//         {
//           to: CONTRACT_ADDRESS as `0x${string}`,
//           abi: ABI,
//           functionName: "dailyCheckIn",
//           args: [],
//           value: parseEther("0"),
//         },
//       ],
     
//       capabilities: {
//         auxiliaryData: {
//           data: "bc_bmhx0p43",
//         },
//       },
//     },
   
//     {
//       onSuccess: (data) => {
//         console.log("Check-in success, Bundle ID:", data);
//         setJustCheckedIn(true);
//         setMessage("Check-in Successful! 🔥");
//         refetchTime();
//         setLoading(false);
//       },
//       onError: (err) => {
//         console.error("Check-in error:", err);
//         setMessage(
//           err.message?.includes("User rejected")
//             ? "Declined"
//             : "Failed. Try again."
//         );
//         setLoading(false);
//       },
//     }
//   );
// };

  // const handleShare = () => {
  //   const baseDomain = "https://mint.personalids.xyz"; 
  //   const farcasterMiniAppUrl = "https://farcaster.xyz/miniapps/offLcGmhl94_/personal-id-mint";
  //   const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
  //   const text = "🔥 I just checked in today! Join me on Personal Onchain ID Minting and Check in Daily 👇";

  //   if (isFarcaster) {
  //     const shareUrl = "https://warpcast.com/~/compose?" + "text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(farcasterMiniAppUrl);
  //     window.open(shareUrl, "_blank");
  //   } else {
  //     const shareUrl = "https://warpcast.com/~/compose?text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(baseDomain);
  //     window.open(shareUrl, "_blank");
  //   }
  // };

//   const lastDate = lastCheckIn > 0 || justCheckedIn
//       ? justCheckedIn
//         ? new Date().toLocaleString()
//         : new Date(lastCheckIn * 1000).toLocaleString()
//       : "Never";

  // if (isReconnecting || isConnecting || !isConnected) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.loadingWrapper}>
  //         <div className={styles.loadingSpinner}></div>
  //         <h2 className={styles.loadingText}>
  //           {(!isConnected && !isConnecting) ? "Wallet Connection Required" : "Syncing Wallet State..."}
  //         </h2>
  //         <p className={styles.loadingSubText}>
  //           {(!isConnected && !isConnecting) ? "We Are Checking Please Wait" : "Connecting to Base Network"}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Daily Check-in</h1>

//       <div className={styles.streakCard}>
//         <div className={styles.streakLabel}>Last Check-in</div>
//         <div className={styles.dateDisplay}>{lastDate}</div>
//       </div>

//       <div className={styles.statusBox}>
//         <p>
//           {canCheckIn()
//             ? "You are eligible for today's check-in!"
//             : "Not eligible for today. Come back tomorrow."}
//         </p>
//       </div>

//       <button
//         className={styles.checkInButton}
//         onClick={handleCheckIn}
//         disabled={loading || isPending || !canCheckIn()}

//       >
//         {loading || isPending
//           ? "Confirming..."
//           : canCheckIn()
//           ? "CHECK IN NOW"
//           : "ALREADY CHECKED IN"}
//       </button>

//       {message && <p className={styles.message} >{message}</p>}
//       <div className={styles.actionRow}>
//         <button className={styles.shareButton} onClick={handleShare}>
//           Share
//         </button>
//         <button className={styles.rewardButton} disabled>
//           Rewards (Coming Soon)
//         </button>
//       </div>
//     </div>
//   );
// }













































"use client";

import { useState } from "react";
import { useAccount, useReadContract, useSendCalls } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
import styles from "./checkin.module.css";

const DEGEN_TOKEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

export default function CheckInPage() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();
  const [message, setMessage] = useState("");
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const { sendCalls, isPending } = useSendCalls();

  // ১. চেক-ইন ডাটা রিড
  const { data: lastCheckInData, refetch: refetchTime } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "lastCheckIn",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  // ২. রিওয়ার্ড পুল সাপ্লাই রিড
  const { data: contractTokenBalance, refetch: refetchSupply } = useReadContract({
    address: DEGEN_TOKEN_ADDRESS as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESS as `0x${string}`],
  });

  // ৩. ইউজারের পয়েন্ট রিড
  const { data: userPoints, refetch: refetchPoints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getUserPoints",
    args: [address as `0x${string}`],
    query: { enabled: !!address },
  });

  const lastCheckIn = lastCheckInData ? Number(lastCheckInData) : 0;
  const currentSupply = contractTokenBalance ? Math.floor(Number(formatEther(contractTokenBalance as bigint))) : 0;
  const availablePoints = userPoints ? Number(userPoints) : 0;

  const MIN_POINTS_TO_CLAIM = 2;

  const canCheckIn = () => {
    if (justCheckedIn) return false;
    if (lastCheckIn === 0) return true;
    const dayInSeconds = 24 * 60 * 60;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= lastCheckIn + dayInSeconds;
  };

  const handleCheckIn = async () => {
    if (!canCheckIn() || !address) return;
    setLoading(true);
    setMessage("Processing daily check-in...");

    sendCalls({
      calls: [{
        to: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "dailyCheckIn",
        args: [],
        value: parseEther("0"),
      }],
    }, {
      onSuccess: () => {
        setJustCheckedIn(true);
       
        setMessage("Success! You've earned 2 Point. 10 Points = 10 DEGEN.");
        refetchTime();
        refetchPoints();
        setLoading(false);
      },
      onError: (err) => {
        console.error(err);
        setMessage("Check-in Failed. Try again.");
        setLoading(false);
      },
    });
  };

  const handleClaimReward = async () => {
    
    if (availablePoints < MIN_POINTS_TO_CLAIM) {
      setMessage(`You need at least ${MIN_POINTS_TO_CLAIM} points to claim.`);
      return;
    }

    setClaimLoading(true);
    setMessage("Sending DEGEN to your wallet...");

    sendCalls({
      calls: [{
        to: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "claimRewards",
        args: [],
      }],
    }, {
      onSuccess: () => {
        setMessage(`Claim Successful! ${availablePoints} DEGEN sent. 🔥`);
        refetchPoints();
        refetchSupply();
        setClaimLoading(false);
      },
      onError: (err) => {
        console.error(err);
        setMessage("Claim failed. Please try again.");
        setClaimLoading(false);
      },
    });
  };

  const handleShare = () => {
    const baseDomain = "https://base.app/app/mints.personalids.xyz"; 
    const farcasterMiniAppUrl = "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint";
    const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
  const text =
  "🔥 I just checked in today! Mint your Personal Onchain ID and earn DEGEN rewards 🚀 Daily check-in = 2 Point, 1 Point = 1 DEGEN, Instant Claim 👇";


    if (isFarcaster) {
      const shareUrl = "https://warpcast.com/~/compose?" + "text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(farcasterMiniAppUrl);
      window.open(shareUrl, "_blank");
    } else {
      const shareUrl = "https://warpcast.com/~/compose?text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(baseDomain);
      window.open(shareUrl, "_blank");
    }
  };


  const lastDate = lastCheckIn > 0 || justCheckedIn
    ? justCheckedIn ? new Date().toLocaleString() : new Date(lastCheckIn * 1000).toLocaleString()
    : "Never";

  if (isReconnecting || isConnecting || !isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>
            {(!isConnected && !isConnecting) ? "Wallet Connection Required" : "Syncing Wallet State..."}
          </h2>
          <p className={styles.loadingSubText}>
            {(!isConnected && !isConnecting) ? "We Are Checking Please Wait" : "Connecting to Base Network"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.supplyHeader}>
        <span className={styles.supplyDot}></span>
        Reward Pool: <strong>{currentSupply} DEGEN</strong>
      </div>

      <h1 className={styles.title}>Daily Check-in & Earn Rewards</h1>


<div className={styles.pointsDisplay}>
  <div className={styles.pointsTitle}>MY POINTS</div> 
  <div className={styles.pointsValue}>{availablePoints}</div> 
  <div className={styles.pointsLabel}>(1 PT = 1 DEGEN)</div> 
  <div className={styles.pointsLabel}>(Per day check-in you will receive 2 points)</div> 
</div>

      <div className={styles.streakCard}>
        <div className={styles.streakLabel}>Last Check-in</div>
        <div className={styles.dateDisplay}>{lastDate}</div>
      </div>

      


<div className={canCheckIn() ? styles.statusBoxEligible : styles.statusBoxNotEligible}>
  <p>
    {canCheckIn()
      ? "You are eligible for check-in!"
      : "Not eligible for today check-in. Come back tomorrow."}
  </p>
</div>


<div className={styles.statusBox}>
  <p>
    {availablePoints >= MIN_POINTS_TO_CLAIM 
      ? `Congrats! You can now claim ${availablePoints} DEGEN.` 
      : `Next Goal: Reach ${MIN_POINTS_TO_CLAIM} points to unlock claim.`}
  </p>
</div>

      <button
        className={styles.checkInButton}
        onClick={handleCheckIn}
        disabled={loading || isPending || !canCheckIn()}
      >
        {loading || isPending ? "Checking..." : canCheckIn() ? "CHECK IN (+1 POINT)" : "ALREADY CHECKED IN"}
      </button>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.actionRow}>
        <button className={styles.shareButton} onClick={handleShare}>
          Share
        </button>
        
        <button 
          className={availablePoints >= MIN_POINTS_TO_CLAIM ? styles.claimActive : styles.rewardButton} 
          onClick={handleClaimReward}
          disabled={claimLoading || availablePoints < MIN_POINTS_TO_CLAIM}
        >
          {claimLoading 
            ? "Claiming..." 
            : availablePoints >= MIN_POINTS_TO_CLAIM 
              ? `CLAIM ${availablePoints} DEGEN` 
              : `LOCKED (<${MIN_POINTS_TO_CLAIM} PTS)`}
        </button>
      </div>
    </div>
  );
}