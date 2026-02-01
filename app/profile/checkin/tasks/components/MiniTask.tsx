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

  // ১. অন-চেইন চেক
  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "add_miniapp"] : undefined,
    query: { enabled: !!address },
  });

  // ২. স্ট্যাটাস চেক ফাংশন
  const checkAdditionStatus = useCallback(async () => {
    setVerifyLoading(true);
    try {
      const context = await sdk.context;
      if (context?.client?.added) {
        setIsAddedToProfile(true);
        setClaimError(false);
        return true;
      }
      setIsAddedToProfile(false);
      return false;
    } catch (error) {
      return false;
    } finally {
      setVerifyLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdditionStatus();
  }, [checkAdditionStatus]);

  // ৩. পপআপ ট্রিগার হ্যান্ডলার (বারবার ট্রাই করার জন্য)
  const handleAddClick = async () => {
    setClaimError(false); 
    
    try {
      // রিয়েল-টাইম চেক: অলরেডি অ্যাড হয়ে থাকলে আর পপআপ দেবে না
      const alreadyAdded = await checkAdditionStatus();
      if (alreadyAdded) return;

      // পপআপ কল
      await sdk.actions.addFrame();
      
      // পপআপ থেকে ইউজার ফিরে আসার পর আবার চেক
      await checkAdditionStatus();
    } catch (error) {
      // ইউজার 'Not Now' দিলে বা ক্যানসেল করলে এখানে আসবে
      console.log("Add Action Interaction", error);
      setClaimError(true); 
      // স্টেট রিসেট করা হচ্ছে যেন পরবর্তী ক্লিকে পপআপ আবার আসতে পারে
      setIsAddedToProfile(false);
    }
  };

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
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}><div className={styles.icon}>📱</div></div>
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
              className={styles.verifyBtn} 
              onClick={handleAddClick} 
              disabled={verifyLoading}
            >
              {verifyLoading ? "Checking..." : "Add Mini App"}
            </button>
            {claimError && <p className={styles.errorMsg}>Please add the app first!</p>}
          </div>
        )}
      </div>
      <div className={styles.right}><span className={styles.reward}>+50 PIM</span></div>
    </div>
  );
}