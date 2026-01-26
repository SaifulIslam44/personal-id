"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
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

  // ৪. টাইম রিসেট লজিক (সকাল ৬টা)
  useEffect(() => {
    const updateStatus = () => {
      if (limitDisabled) {
        setIsLocked(false);
        return;
      }

      const now = new Date();
      
      // পরবর্তী সকাল ৬টা নির্ধারণ
      const nextReset = new Date();
      if (now.getHours() >= resetHour) {
        nextReset.setDate(now.getDate() + 1);
      }
      nextReset.setHours(resetHour, 0, 0, 0);

      // বর্তমান ক্লেইম সাইকেলের শুরুর সময়
      const currentCycleStart = new Date();
      if (now.getHours() < resetHour) {
        currentCycleStart.setDate(currentCycleStart.getDate() - 1);
      }
      currentCycleStart.setHours(resetHour, 0, 0, 0);

      // যদি লাস্ট ক্লেইম বর্তমান সাইকেলের পরে হয়ে থাকে (অর্থাৎ আজ অলরেডি ডান)
      if (lastClaimTime * 1000 > currentCycleStart.getTime()) {
        setIsLocked(true);
        
        const diff = nextReset.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft(`${h}h ${m}m ${s}s`);
      } else {
        setIsLocked(false);
      }
    };

    const timer = setInterval(updateStatus, 1000);
    updateStatus();
    return () => clearInterval(timer);
  }, [lastClaimTime, resetHour, limitDisabled]);

  const handleShare = () => {
    if (!fid) return;
    const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
    const text = encodeURIComponent("🔥 I just shared & earned 50 PIM! Mint your ID now 👇");
    const shareUrl = `https://warpcast.com/~/compose?text=${text}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${fid}`)}`;
    window.open(shareUrl, "_blank");
    setHasShared(true);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleClaim = async () => {
    if (!address) return;
    try {
      setIsClaiming(true);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimDailyTaskReward",
        args: [TASK_ID],
      });

      // ক্লেইম সফল হলে অন-চেইন ডাটা রিফ্রেশ করা
      await refetchClaimTime();
      
      // স্টেট ক্লিনআপ
      setHasShared(false);
      setIsVerified(false);
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
          Earn 50 PIM daily. Next reset at {resetHour}:00 AM.
        </p>

        {isLocked ? (
          <button className={styles.retryBtn} disabled style={{ opacity: 0.8, cursor: "wait" }}>
            Reset in: {timeLeft}
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