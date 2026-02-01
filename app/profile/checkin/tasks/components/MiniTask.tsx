"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useSendCalls } from "wagmi/experimental"; // sendCalls এর জন্য ইম্পোর্ট
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "../task.module.css";

export default function MiniTask() {
  const { address } = useAccount();
  const { sendCallsAsync } = useSendCalls(); // sendCallsAsync ব্যবহার করা হয়েছে

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(false);
  const [isAddedToProfile, setIsAddedToProfile] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  
  // নতুন স্টেট: ক্লেম এরর এবং টাইমার হ্যান্ডেল করার জন্য
  const [retryTimer, setRetryTimer] = useState(0);

  // ১. অন-চেইন চেক: রিওয়ার্ড ক্লেম করা হয়েছে কি না
  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "add_miniapp"] : undefined,
    query: { enabled: !!address },
  });

  // টাইমার লজিক
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (retryTimer > 0) {
      t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [retryTimer]);

  // ২. প্রোফাইল স্ট্যাটাস চেক করার ফাংশন
  const checkAdditionStatus = useCallback(async () => {
    try {
      const context = await sdk.context;
      if (context?.client?.added) {
        setIsAddedToProfile(true);
        setClaimError(false);
        return true;
      } else {
        setIsAddedToProfile(false);
        return false;
      }
    } catch (error) {
      console.error("SDK Context Error:", error);
      return false;
    }
  }, []);

  // ৩. পোলিং
  useEffect(() => {
    checkAdditionStatus();
    const interval = setInterval(checkAdditionStatus, 3000);
    return () => clearInterval(interval);
  }, [checkAdditionStatus]);

  // ৪. Add Button হ্যান্ডলার
  const handleAddClick = async () => {
    setClaimError(false); 
    setVerifyLoading(true);
    
    try {
      const alreadyAdded = await checkAdditionStatus();
      if (alreadyAdded) {
        setVerifyLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      await sdk.actions.addFrame();
      await checkAdditionStatus();
    } catch (error: any) {
      console.log("Interaction Error:", error);
      setClaimError(true);
      setIsAddedToProfile(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  // ৫. রিওয়ার্ড ক্লেম লজিক (sendCallsAsync ব্যবহার করে)
  const handleClaim = async () => {
    if (!address || !isAddedToProfile) return;
    try {
      setIsClaiming(true);
      
      // sendCallsAsync এর মাধ্যমে ট্রানজ্যাকশন কল
      const id = await sendCallsAsync({
        calls: [
          {
            to: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: "claimDirectTask",
            args: ["add_miniapp"],
          },
        ],
      });

      // ট্রানজ্যাকশন আইডি আসলে রিফেচ করা হবে
      if (id) {
        await refetchTask();
      }
      
      setIsClaiming(false);
    } catch (err) {
      setIsClaiming(false);
      setRetryTimer(3); // ৩ সেকেন্ডের টাইমার সেট করা হলো
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}>
        <div className={styles.icon}>📱</div>
      </div>

      <div className={styles.center}>
        <h3>Add Mini App</h3>
        <p className={styles.desc}>Add to your Farcaster to claim +50 PIM rewards.</p>

        {isTaskDone ? (
          <span className={styles.done}>✅ Completed</span>
        ) : isAddedToProfile ? (
          <button 
            className={retryTimer > 0 ? styles.retryBtn : styles.claimBtn} 
            onClick={handleClaim} 
            disabled={isClaiming || retryTimer > 0}
          >
            {isClaiming ? "Claiming..." : retryTimer > 0 ? `Retry in ${retryTimer}s` : "Claim +50 PIM"}
          </button>
        ) : (
          <button 
            className={claimError ? styles.errorBtnInside : styles.verifyBtn} 
            onClick={handleAddClick} 
            disabled={verifyLoading}
          >
            {verifyLoading ? "Checking..." : claimError ? "Please add the app first!" : "Add Mini App"}
          </button>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}