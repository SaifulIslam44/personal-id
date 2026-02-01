"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "../task.module.css";

export default function MiniTask() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(false);
  const [isAddedToProfile, setIsAddedToProfile] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ১. অন-চেইন চেক: রিওয়ার্ড ক্লেম করা হয়েছে কি না
  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "add_miniapp"] : undefined,
    query: { enabled: !!address },
  });

  // ২. প্রোফাইল স্ট্যাটাস চেক করার ফাংশন
  const checkAdditionStatus = useCallback(async () => {
    setVerifyLoading(true);
    try {
      const context = await sdk.context;
      // context.client.added চেক করবে অ্যাপটি প্রোফাইলে আছে কি না
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
    } finally {
      setVerifyLoading(false);
    }
  }, []);

  // ৩. পোলিং (Polling): প্রতি ৩ সেকেন্ড অন্তর চেক করবে ইউজার থ্রি-ডট মেনু থেকে অ্যাড করেছে কি না
  useEffect(() => {
    checkAdditionStatus();
    const interval = setInterval(checkAdditionStatus, 3000);
    return () => clearInterval(interval);
  }, [checkAdditionStatus]);

  // ৪. Add Button হ্যান্ডলার
  const handleAddClick = async () => {
    setClaimError(false); 
    
    try {
      const alreadyAdded = await checkAdditionStatus();
      if (alreadyAdded) return;

      // সরাসরি SDK অ্যাকশন কল
      await sdk.actions.addFrame();
      
      // পপআপ থেকে ইউজার ফিরে আসার পর স্ট্যাটাস চেক
      const success = await checkAdditionStatus();
      if (!success) {
        setClaimError(true); 
      }
    } catch (error: any) {
      console.log("Interaction Error:", error);
      setClaimError(true);
      setIsAddedToProfile(false);
    }
  };

  // ৫. রিওয়ার্ড ক্লেম
  const handleClaim = async () => {
    if (!address || !isAddedToProfile) return;
    try {
      setIsClaiming(true);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimDirectTask",
        args: ["add_miniapp"],
      });
      await refetchTask();
    } catch (err) {
      console.error("Claim Error:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}>
        <div className={styles.icon}>📱</div>
      </div>

      <div className={styles.center}>
        <h3>Add Mini App</h3>
        <p className={styles.desc}>Add to your Farcaster to claim +50 PIM.</p>

        {isTaskDone ? (
          <span className={styles.done}>✅ Completed</span>
        ) : isAddedToProfile ? (
          <button className={styles.claimBtn} onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim +50 PIM"}
          </button>
        ) : (
          <div className={styles.actionGroup}>
            <button 
              className={claimError ? styles.errorBtnInside : styles.verifyBtn} 
              onClick={handleAddClick} 
              disabled={verifyLoading}
            >
              {verifyLoading ? "Checking..." : claimError ? "Please add the app first!" : "Add Mini App"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}