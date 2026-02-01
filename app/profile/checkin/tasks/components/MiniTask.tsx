"use client";

import { useState, useEffect } from "react";
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
  const checkAdditionStatus = async () => {
    setVerifyLoading(true);
    try {
      const context = await sdk.context;
      // context.client.added চেক করবে অ্যাপটি প্রোফাইলে আছে কি না
      if (context?.client?.added) {
        setIsAddedToProfile(true);
        setClaimError(false);
      } else {
        setIsAddedToProfile(false);
      }
    } catch (error) {
      console.error("SDK Context Error:", error);
    } finally {
      setVerifyLoading(false);
    }
  };

  // ৩. useEffect ব্যবহার করে অ্যাপ ওপেন হওয়ার সময় স্ট্যাটাস চেক (এরর সমাধান)
  useEffect(() => {
    checkAdditionStatus();
  }, []); // একবার রান হবে যখন কম্পোনেন্ট লোড হবে

  // ৪. Add Button হ্যান্ডলার
  const handleAddClick = async () => {
    try {
      await sdk.actions.addFrame();
      // পপআপ ক্লোজ হওয়ার পর আবার ভেরিফাই করা
      await checkAdditionStatus();
    } catch (error) {
      console.error("Add Action Error:", error);
    }
  };

  // ৫. রিওয়ার্ড ক্লেম
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