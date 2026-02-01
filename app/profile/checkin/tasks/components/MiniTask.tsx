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

  useEffect(() => {
    checkAdditionStatus();
  }, [checkAdditionStatus]);

  // ৩. Add Button হ্যান্ডলার - যা "Not Now" দেওয়ার পরও বারবার পপআপ আনবে
  const handleAddClick = async () => {
    setClaimError(false); 
    
    try {
      // রিয়েল-টাইম চেক: অলরেডি অ্যাড হয়ে থাকলে আর পপআপ দেবে না
      const alreadyAdded = await checkAdditionStatus();
      if (alreadyAdded) return;

      // সরাসরি পপআপ ট্রিগার করা
      // এটি করার ফলে ইউজার ক্যানসেল করলেও পরবর্তী ক্লিকে আবার পপআপ আসবে
      await sdk.actions.addFrame();
      
      // পপআপ থেকে ইউজার ফিরে আসার পর স্ট্যাটাস রি-চেক
      await checkAdditionStatus();
    } catch (error: any) {
      console.log("Add Action Interaction", error);
      
      // ইউজার 'Not Now' দিলে বা এরর হলে এখানে আসবে
      // এখানে স্টেট আপডেট করে দিচ্ছি যাতে ইউজার আবার ট্রাই করতে পারে
      setClaimError(true); 
      setIsAddedToProfile(false);
    }
  };

  // ৪. রিওয়ার্ড ক্লেম
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

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}