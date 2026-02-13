// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import styles from "../task.module.css";

// export default function Task50({ fid }: { fid: any }) {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();

//   const [hasShared, setHasShared] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [verifyError, setVerifyError] = useState(false);
//   const [verifyTimer, setVerifyTimer] = useState(0);

//   const [isClaiming, setIsClaiming] = useState(false);
//   const [claimError, setClaimError] = useState(false);
//   const [retryTimer, setRetryTimer] = useState(0);

//   const { data: userRefCount, refetch } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "refCount",
//     args: address ? [address] : undefined,
//   });

//   const { data: isTaskDone, refetch: refetchTask } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "taskDone",
//     args: address ? [address, "invite50"] : undefined,
//   });

//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (verifyTimer > 0) t = setTimeout(() => setVerifyTimer(verifyTimer - 1), 1000);
//     if (verifyTimer === 0 && verifyError) setVerifyError(false);
//     return () => clearTimeout(t);
//   }, [verifyTimer, verifyError]);

//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (retryTimer > 0) t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
//     if (retryTimer === 0 && claimError) setClaimError(false);
//     return () => clearTimeout(t);
//   }, [retryTimer, claimError]);

// const handleShare = () => {
//     if (!fid) return;

//     // ইউজার কোন প্ল্যাটফর্মে আছে তা শনাক্ত করা
//     const isBaseApp = /base/i.test(navigator.userAgent);
    
//     // প্ল্যাটফর্ম অনুযায়ী ডোমেইন সেট করা
//     const domain = isBaseApp 
//       ? "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint" // Base App-এর জন্য
//       : "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; // Farcaster-এর জন্য

//     const shareUrl =
//       "https://warpcast.com/~/compose?" +
//       "text=" +
//       encodeURIComponent("🔥 Complete tasks & earn PIM rewards 👇") +
//       "&embeds[]=" +
//       encodeURIComponent(`${domain}?fid=${fid}`);

//     window.open(shareUrl, "_blank");
//     setHasShared(true); // ✅ ONLY FLAG
//   };




//   const handleVerify = async () => {
//     if (!address) return;
//     try {
//       setIsVerifying(true);
//       const res = await refetch();
//       if (Number(res.data ?? 0) < 50) throw new Error();
//       setIsVerifying(false);
//     } catch {
//       setIsVerifying(false);
//       setVerifyError(true);
//       setVerifyTimer(30);
//     }
//   };

//   const handleClaim = async () => {
//     if (!address) return;
//     try {
//       setIsClaiming(true);
//       await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "claimRef",
//         args: [BigInt(50), "invite50"],
//       });
//       await refetch();
//       await refetchTask();
//       setIsClaiming(false);
//     } catch {
//       setIsClaiming(false);
//       setClaimError(true);
//       setRetryTimer(10);
//     }
//   };

//   const isEligible = Number(userRefCount ?? 0) >= 50;

//   return (
//     <div className={styles.taskCard}>
//       <div className={styles.left}><div className={styles.icon}>👑</div></div>
//       <div className={styles.center}>
//         <h3>Invite 50 Friends</h3>
//         <p className={styles.desc}>Earn massive PIM rewards</p>
//         {isTaskDone ? (
//           <span className={styles.done}>✅ Completed</span>
//         ) : isEligible ? (
//           <button className={claimError ? styles.retryBtn : styles.claimBtn} onClick={handleClaim} disabled={isClaiming || retryTimer > 0}>
//             {isClaiming ? "Claiming..." : claimError ? `Retry (${retryTimer}s)` : "Claim +2000 PIM"}
//           </button>
//         ) : hasShared ? (
//           <button className={verifyError ? styles.retryBtn : styles.verifyBtn} onClick={handleVerify} disabled={isVerifying || verifyTimer > 0}>
//             {isVerifying ? "Verifying..." : verifyError ? `Retry (${verifyTimer}s)` : "Verify"}
//           </button>
//         ) : (
//           <button className={styles.verifyBtn} onClick={handleShare}>Share Referral Link</button>
//         )}
//       </div>
//       <div className={styles.right}><span className={styles.reward}>+2000 PIM</span></div>
//     </div>
//   );
// }

































"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useSendTransaction } from "wagmi"; 
import { encodeFunctionData, concat } from "viem"; 
import { Attribution } from "ox/erc8021"; 
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import styles from "../task.module.css";

export default function Task50({ fid }: { fid: any }) {
  const { address } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const [hasShared, setHasShared] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(false);
  const [retryTimer, setRetryTimer] = useState(0);

  const { data: userRefCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "refCount",
    args: address ? [address] : undefined,
  });

  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "invite50"] : undefined,
  });

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (verifyTimer > 0) t = setTimeout(() => setVerifyTimer(verifyTimer - 1), 1000);
    if (verifyTimer === 0 && verifyError) setVerifyError(false);
    return () => clearTimeout(t);
  }, [verifyTimer, verifyError]);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (retryTimer > 0) t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
    if (retryTimer === 0 && claimError) setClaimError(false);
    return () => clearTimeout(t);
  }, [retryTimer, claimError]);

const handleShare = () => {
    if (!fid) return;

    // ইউজার কোন প্ল্যাটফর্মে আছে তা শনাক্ত করা
    const isBaseApp = /base/i.test(navigator.userAgent);
    
    // প্ল্যাটফর্ম অনুযায়ী ডোমেইন সেট করা
    const domain = isBaseApp 
      ? "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint" // Base App-এর জন্য
      : "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; // Farcaster-এর জন্য

    const shareUrl =
      "https://warpcast.com/~/compose?" +
      "text=" +
      encodeURIComponent("🔥 Complete tasks & earn PIM rewards 👇") +
      "&embeds[]=" +
      encodeURIComponent(`${domain}?fid=${fid}`);

    window.open(shareUrl, "_blank");
    setHasShared(true); // ✅ ONLY FLAG
  };




  const handleVerify = async () => {
    if (!address) return;
    try {
      setIsVerifying(true);
      const res = await refetch();
      if (Number(res.data ?? 0) < 50) throw new Error();
      setIsVerifying(false);
    } catch {
      setIsVerifying(false);
      setVerifyError(true);
      setVerifyTimer(30);
    }
  };

  const handleClaim = async () => {
  if (!address) return;
  setIsClaiming(true);

  try {
    
    const data = encodeFunctionData({
      abi: ABI,
      functionName: "claimRef",
      args: [BigInt(50), "invite50"], 
    });


    const builderSuffix = Attribution.toDataSuffix({
      codes: ["bc_bmhx0p43"], // আপনার কোড
    });


    const hash = await sendTransactionAsync({
      to: CONTRACT_ADDRESS as `0x${string}`,
      data: concat([data, builderSuffix]),
    });

    if (hash) {
      await refetch();
      await refetchTask();
    }
    
    setIsClaiming(false);
  } catch (err) {
    console.error("Claim Error:", err);
    setIsClaiming(false);
    setClaimError(true);
    setRetryTimer(10);
  }
};

  const isEligible = Number(userRefCount ?? 0) >= 50;

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}><div className={styles.icon}>👑</div></div>
      <div className={styles.center}>
        <h3>Invite 50 Friends</h3>
        <p className={styles.desc}>Earn massive PIM rewards</p>
        {isTaskDone ? (
          <span className={styles.done}>✅ Completed</span>
        ) : isEligible ? (
          <button className={claimError ? styles.retryBtn : styles.claimBtn} onClick={handleClaim} disabled={isClaiming || retryTimer > 0}>
            {isClaiming ? "Claiming..." : claimError ? `Retry (${retryTimer}s)` : "Claim +2000 PIM"}
          </button>
        ) : hasShared ? (
          <button className={verifyError ? styles.retryBtn : styles.verifyBtn} onClick={handleVerify} disabled={isVerifying || verifyTimer > 0}>
            {isVerifying ? "Verifying..." : verifyError ? `Retry (${verifyTimer}s)` : "Verify"}
          </button>
        ) : (
          <button className={styles.verifyBtn} onClick={handleShare}>Share Referral Link</button>
        )}
      </div>
      <div className={styles.right}><span className={styles.reward}>+2000 PIM</span></div>
    </div>
  );
}