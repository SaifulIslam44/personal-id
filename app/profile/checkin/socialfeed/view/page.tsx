"use client";

import { useReadContract, useAccount, useSendCalls } from "wagmi";
import { formatUnits, zeroAddress, encodeFunctionData } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/lib/testcontract"; 
import styles from "./TaskPages.module.css";

export default function TaskViewPage() {
  const { isConnected } = useAccount();
  const { sendCalls, isPending } = useSendCalls();

  // টাস্ক কাউন্ট রিড করা
  const { data: taskCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getTaskCount",
  });

  // এই ফাংশনটি একটি লুপের মাধ্যমে টাস্কগুলো দেখানোর জন্য (আপনার ABI-তে getAllActiveTasks নেই)
  // তাই ১টি টাস্ক দেখানোর উদাহরণ দেওয়া হলো। মাল্টিপল টাস্কের জন্য আপনাকে লুপ ব্যবহার করতে হবে।
  const { data: task } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getTask",
    args: [0n], // আপাতত প্রথম টাস্ক (ID 0) দেখাচ্ছে
    query: { enabled: !!taskCount && Number(taskCount) > 0 }
  });

  const handleClaim = async () => {
    if (!isConnected) return;

    // ABI অনুযায়ী claimReward আর্গুমেন্ট সাজানো হয়েছে
    const claimCall = {
      to: CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: ABI,
        functionName: "claimReward",
        args: [
          0n, // taskId
          BigInt(Math.floor(Date.now() / 1000)), // nonce
          "0x" // signature (আপনার ব্যাকএন্ড থেকে আসতে হবে)
        ] as any,
      }),
    };

    sendCalls({ calls: [claimCall] });
  };

  if (!task) return <div className={styles.loader}>Loading tasks...</div>;

  const t = task as any;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Active Rewards</h2>
      <div className={styles.taskCard}>
        <div className={styles.cardHeader}>
          <span className={styles.badge}>⚡ Task #{taskCount?.toString()}</span>
          <span className={styles.rewardText}>
            {formatUnits(t.rewardPerUser, 18)} {t.token === zeroAddress ? "ETH" : "Token"}
          </span>
        </div>
        <p className={styles.targetLink}>Target: {t.targetId}</p>
        <div className={styles.progressBarBg}>
           <div className={styles.progressBarFill} style={{ width: `${(Number(t.currentWinners) / Number(t.maxWinners)) * 100}%` }}></div>
        </div>
        <p className={styles.stats}>{Number(t.currentWinners)} / {Number(t.maxWinners)} winners</p>
        <button className={styles.claimBtn} onClick={handleClaim} disabled={isPending}>
          {isPending ? "Claiming..." : "Verify & Claim"}
        </button>
      </div>
    </div>
  );
}