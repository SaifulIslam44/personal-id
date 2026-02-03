// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import styles from "../task.module.css";

// export default function DailyShareTask({ fid }: { fid: any }) {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();

//   const [hasShared, setHasShared] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isClaiming, setIsClaiming] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");
//   const [isLocked, setIsLocked] = useState(false);

//   const TASK_ID = "dailyshare";

//   // ১. অন-চেইন লাস্ট ক্লেইম টাইম রিড
//   const { data: lastClaimData, refetch: refetchClaimTime } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "getDailyTaskLastClaim",
//     args: address ? [address as `0x${string}`, TASK_ID] : undefined,
//     query: { enabled: !!address },
//   });

//   // ২. ডায়নামিক রিসেট আওয়ার রিড
//   const { data: resetHourData } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "getResetHour",
//   });

//   // ৩. এডমিন লিমিট ডিসেবল করেছে কি না চেক
//   const { data: limitDisabled } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "isDailyLimitDisabled",
//   });

//   const lastClaimTime = lastClaimData ? Number(lastClaimData) : 0;
//   const resetHour = resetHourData !== undefined ? Number(resetHourData) : 6;

//   // ৪. টাইম রিসেট লজিক (UTC সময় অনুযায়ী)
//   useEffect(() => {
//     const updateStatus = () => {
//       if (limitDisabled) {
//         setIsLocked(false);
//         return;
//       }

//       // বর্তমান সময়কে UTC-তে কনভার্ট করে হিসাব করা
//       const now = new Date();
//       const nowUTC = new Date(now.toUTCString());
      
//       // পরবর্তী UTC রিসেট টাইম নির্ধারণ
//       const nextResetUTC = new Date(now.toUTCString());
//       if (nowUTC.getUTCHours() >= resetHour) {
//         nextResetUTC.setUTCDate(nowUTC.getUTCDate() + 1);
//       }
//       nextResetUTC.setUTCHours(resetHour, 0, 0, 0);

//       // বর্তমান ক্লেইম সাইকেলের শুরুর সময় (UTC)
//       const currentCycleStartUTC = new Date(now.toUTCString());
//       if (nowUTC.getUTCHours() < resetHour) {
//         currentCycleStartUTC.setUTCDate(currentCycleStartUTC.getUTCDate() - 1);
//       }
//       currentCycleStartUTC.setUTCHours(resetHour, 0, 0, 0);

//       // লাস্ট ক্লেইম টাইম (সেকেন্ড থেকে মিলিসেকেন্ডে)
//       const lastClaimMs = lastClaimTime * 1000;

//       // যদি লাস্ট ক্লেইম বর্তমান সাইকেলের পরে হয়ে থাকে (অর্থাৎ এই সাইকেলে ক্লেইম করা শেষ)
//       if (lastClaimTime !== 0 && lastClaimMs >= currentCycleStartUTC.getTime()) {
//         setIsLocked(true);
        
//         const diff = nextResetUTC.getTime() - nowUTC.getTime();
        
//         if (diff > 0) {
//           const h = Math.floor(diff / (1000 * 60 * 60));
//           const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//           const s = Math.floor((diff % (1000 * 60)) / 1000);
//           setTimeLeft(`${h}h ${m}m ${s}s`);
//         } else {
//           // যদি ডিফারেন্স ০ হয়ে যায়, তবে লক খুলে দাও
//           setIsLocked(false);
//         }
//       } else {
//         setIsLocked(false);
//       }
//     };

//     const timer = setInterval(updateStatus, 1000);
//     updateStatus();
//     return () => clearInterval(timer);
//   }, [lastClaimTime, resetHour, limitDisabled]);

//   const handleShare = () => {
//     if (!fid) return;
//     const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//     const text = encodeURIComponent("🔥 I just daily shared & earned 50 $PIM! Mint your ID now and earn you too!! 👇");
//     const shareUrl = `https://warpcast.com/~/compose?text=${text}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${fid}`)}`;
//     window.open(shareUrl, "_blank");
//     setHasShared(true);
//   };

//   // const handleVerify = () => {
//   //   setIsVerifying(true);
//   //   setTimeout(() => {
//   //     setIsVerifying(false);
//   //     setIsVerified(true);
//   //   }, 2000);
//   // };


// const handleVerify = async () => {
//     if (!fid) return;
//     setIsVerifying(true);

//     try {
//       // আপনার তৈরি করা API কল করা হচ্ছে
//       const response = await fetch(`/api/verify-share?fid=${fid}`);
//       const data = await response.json();

//       if (data.success) {
//         setIsVerified(true);
//         // আপনি চাইলে এখানে একটি সাকসেস মেসেজ দিতে পারেন
//       } else {
//         alert("শেয়ার করা হয়নি! অনুগ্রহ করে আগে শেয়ার করুন এবং ১-২ মিনিট অপেক্ষা করে আবার চেষ্টা করুন।");
//       }
//     } catch (err) {
//       console.error("Verification error:", err);
//       alert("ভেরিফিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
//     } finally {
//       setIsVerifying(false);
//     }
//   };





//   const handleClaim = async () => {
//     if (!address) return;
//     try {
//       setIsClaiming(true);
//       const tx = await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "claimDailyTaskReward",
//         args: [TASK_ID],
//       });

//       // ট্রানজেকশন সফল হওয়ার পর ডাটা রিফ্রেশ করা
//       if (tx) {
//         // রিফ্রেশ করার মাধ্যমে lastClaimTime আপডেট হবে এবং টাইমার চালু হবে
//         await refetchClaimTime();
        
//         // স্টেট ক্লিনআপ
//         setHasShared(false);
//         setIsVerified(false);
//       }
//       setIsClaiming(false);
//     } catch (err) {
//       console.error("Claim failed:", err);
//       setIsClaiming(false);
//     }
//   };

//   return (
//     <div className={styles.taskCard}>
//       <div className={styles.left}><div className={styles.icon}>📢</div></div>
      
//       <div className={styles.center}>
//         <h3>Daily App Share</h3>
//         <p className={styles.desc}>
//           Earn 50 PIM daily. Next reset at {resetHour}:00 AM UTC.
//         </p>

//         {isLocked ? (
//           <button className={styles.retryBtn1} disabled style={{ opacity: 0.8, cursor: "wait" }}>
//             Reset in: {timeLeft}
//           </button>
//         ) : isVerifying ? (
//           <button className={styles.verifyBtn} disabled>Verifying...</button>
//         ) : isVerified ? (
//           <button className={styles.claimBtn} onClick={handleClaim} disabled={isClaiming}>
//             {isClaiming ? "Claiming..." : "Claim +50 PIM"}
//           </button>
//         ) : hasShared ? (
//           <button className={styles.verifyBtn} onClick={handleVerify}>Verify Share</button>
//         ) : (
//           <button className={styles.verifyBtn} onClick={handleShare}>Share App</button>
//         )}
//       </div>

//       <div className={styles.right}>
//         <span className={styles.reward}>+50 PIM</span>
//       </div>
//     </div>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "../task.module.css";

export default function DailyShareTask({ fid }: { fid: any }) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [hasShared, setHasShared] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [errorTimer, setErrorTimer] = useState(0); // কাউন্টডাউনের জন্য নতুন স্টেট

  const TASK_ID = "dailyshare";

  // ১. অন-চেইন লাস্ট ক্লেইম টাইম রিড
  const { data: lastClaimData, refetch: refetchClaimTime } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getDailyTaskLastClaim",
    args: address ? [address as `0x${string}`, TASK_ID] : undefined,
    query: { enabled: !!address },
  });

  // ২. ডায়নামিক রিসেট আওয়ার রিড
  const { data: resetHourData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getResetHour",
  });

  // ৩. এডমিন লিমিট ডিসেবল করেছে কি না চেক
  const { data: limitDisabled } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "isDailyLimitDisabled",
  });

  const lastClaimTime = lastClaimData ? Number(lastClaimData) : 0;
  const resetHour = resetHourData !== undefined ? Number(resetHourData) : 6;

  // ৪. টাইম রিসেট লজিক (UTC সময় অনুযায়ী)
  useEffect(() => {
    const updateStatus = () => {
      if (limitDisabled) {
        setIsLocked(false);
        return;
      }

      const now = new Date();
      const nowUTC = new Date(now.toUTCString());
      
      const nextResetUTC = new Date(now.toUTCString());
      if (nowUTC.getUTCHours() >= resetHour) {
        nextResetUTC.setUTCDate(nowUTC.getUTCDate() + 1);
      }
      nextResetUTC.setUTCHours(resetHour, 0, 0, 0);

      const currentCycleStartUTC = new Date(now.toUTCString());
      if (nowUTC.getUTCHours() < resetHour) {
        currentCycleStartUTC.setUTCDate(currentCycleStartUTC.getUTCDate() - 1);
      }
      currentCycleStartUTC.setUTCHours(resetHour, 0, 0, 0);

      const lastClaimMs = lastClaimTime * 1000;

      if (lastClaimTime !== 0 && lastClaimMs >= currentCycleStartUTC.getTime()) {
        setIsLocked(true);
        const diff = nextResetUTC.getTime() - nowUTC.getTime();
        
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${h}h ${m}m ${s}s`);
        } else {
          setIsLocked(false);
        }
      } else {
        setIsLocked(false);
      }
    };

    const timer = setInterval(updateStatus, 1000);
    updateStatus();
    return () => clearInterval(timer);
  }, [lastClaimTime, resetHour, limitDisabled]);

  // ৫. এরর কাউন্টডাউন লজিক
  useEffect(() => {
    if (errorTimer > 0) {
      const timerId = setInterval(() => {
        setErrorTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (errorTimer === 0 && verifyError) {
      setVerifyError(false);
      setIsVerifying(false);
      setHasShared(false);
    }
  }, [errorTimer, verifyError]);

const handleShare = () => {
  if (!fid) return;

  const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  const text = "🔥 I just daily shared & earned 50 $PIM! Mint your ID now and earn you too!! 👇";
  
  
  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${fid}`)}`;

  
  const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);

  try {
    if (isFarcaster) {
    
      sdk.actions.openUrl(castIntentUrl);
    } else {
      
      window.open(castIntentUrl, "_blank");
    }
  } catch (error) {
    console.error("SDK Share error:", error);
   
    window.open(castIntentUrl, "_blank");
  }

  setHasShared(true);
};

  const handleVerify = async () => {
    if (!fid) return;
    setIsVerifying(true);
    setVerifyError(false);

    try {
      const response = await fetch(`/api/verify-share?fid=${fid}`);
      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        setIsVerifying(false);
      } else {
        setVerifyError(true);
        setErrorTimer(3); // ৩ সেকেন্ডের কাউন্টডাউন শুরু
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerifyError(true);
      setErrorTimer(3);
    }
  };

  const handleClaim = async () => {
    if (!address) return;
    try {
      setIsClaiming(true);
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimDailyTaskReward",
        args: [TASK_ID],
      });

      if (tx) {
        await refetchClaimTime();
        setHasShared(false);
        setIsVerified(false);
      }
      setIsClaiming(false);
    } catch (err) {
      console.error("Claim failed:", err);
      setIsClaiming(false);
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}><div className={styles.icon}>📢</div></div>
      
      <div className={styles.center}>
        <h3>Daily App Share</h3>
        <p className={styles.desc}>
          Earn 50 PIM daily. Next reset at {resetHour}:00 AM UTC.
        </p>

        {isLocked ? (
          <button className={styles.retryBtn1} disabled style={{ opacity: 0.8, cursor: "wait" }}>
            Reset in: {timeLeft}
          </button>
        ) : verifyError ? (
          <button className={styles.verifyBtn} style={{ backgroundColor: "#ff4444", color: "white" }} disabled>
            Not Shared! Try Again {errorTimer}s
          </button>
        ) : isVerifying ? (
          <button className={styles.verifyBtn} disabled>Verifying...</button>
        ) : isVerified ? (
          <button className={styles.claimBtn} onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim +50 PIM"}
          </button>
        ) : hasShared ? (
          <button className={styles.verifyBtn} onClick={handleVerify}>Verify Share</button>
        ) : (
          <button className={styles.verifyBtn} onClick={handleShare}>Share App</button>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}













