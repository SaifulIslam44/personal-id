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

  // ২. SDK Context থেকে স্ট্যাটাস চেক করার ফাংশন
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

  // ৩. Add Button হ্যান্ডলার - যেখানে বারবার পপআপ আসার লজিক দেওয়া হয়েছে
  const handleAddClick = async () => {
    // প্রতিবার ক্লিক করলে এরর মেসেজ আগে রিমুভ হবে
    setClaimError(false); 
    
    try {
      // প্রথমে চেক করুন অলরেডি অ্যাড হয়ে গেছে কি না
      const alreadyAdded = await checkAdditionStatus();
      if (alreadyAdded) return;

      // পপআপ ট্রিগার
      // অনেক সময় আগের রিজেক্টেড স্টেটের কারণে পপআপ ব্লক হয়, তাই try-catch এর ভেতর সরাসরি কল
      await sdk.actions.addFrame();
      
      // পপআপ ক্লোজ হওয়ার পর আবার স্ট্যাটাস চেক করুন
      const success = await checkAdditionStatus();
      if (!success) {
        setClaimError(true); 
      }
    } catch (error) {
      // ইউজার 'Not Now' দিলে বা এরর হলে এখানে আসবে
      console.log("Add Action Rejected or Failed", error);
      setClaimError(true);
      
      // গুরুত্বপূর্ণ: যদি SDK ব্লক হয়ে থাকে, তবে এটি ইউজারকে আবার সুযোগ দিবে
      setIsAddedToProfile(false);
    }
  };

  // ৪. রিওয়ার্ড ক্লেম
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