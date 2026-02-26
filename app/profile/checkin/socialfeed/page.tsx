"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useSendCalls } from "wagmi"; 
import { parseUnits, formatUnits, zeroAddress, encodeFunctionData } from "viem";
import { ABI, CONTRACT_ADDRESS } from "@/lib/testcontract"; 
import styles from "./TaskPages.module.css";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const DEGEN_ADDRESS = "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";

const ERC20_ABI = [
  { inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], name: "allowance", outputs: [{ name: "remaining", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], name: "approve", outputs: [{ name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" },
] as const;

export default function TaskCreationPage() {
  const { address, isConnected } = useAccount();
  const { sendCalls, isPending } = useSendCalls();

  const [selectedTaskType, setSelectedTaskType] = useState<number>(0);
  const [targetId, setTargetId] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [maxWinners, setMaxWinners] = useState("10");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}`>(zeroAddress);
  const [tokenDecimals, setTokenDecimals] = useState<number>(18);
  const [approvalNeeded, setApprovalNeeded] = useState(false);
  const [message, setMessage] = useState("");

  const { data: fetchedDecimals } = useReadContract({
    address: selectedTokenAddress !== zeroAddress ? selectedTokenAddress : undefined,
    abi: ERC20_ABI,
    functionName: "decimals",
    query: { enabled: selectedTokenAddress !== zeroAddress }
  });

  const { data: fetchedAllowance, refetch: refetchAllowance } = useReadContract({
    address: selectedTokenAddress !== zeroAddress ? selectedTokenAddress : undefined,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESS as `0x${string}`] : undefined,
    query: { enabled: selectedTokenAddress !== zeroAddress && !!address }
  });

  const { data: platformConfig } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getPlatformConfig",
  });

  const minRewardAmount = platformConfig ? (platformConfig as any)[0] : 0n;

  useEffect(() => {
    if (fetchedDecimals) setTokenDecimals(Number(fetchedDecimals));
    else if (selectedTokenAddress === zeroAddress) setTokenDecimals(18);
  }, [fetchedDecimals, selectedTokenAddress]);

  const totalReward = (rewardAmount && maxWinners) 
    ? parseUnits(rewardAmount, tokenDecimals) * BigInt(maxWinners) 
    : 0n;

  useEffect(() => {
    if (selectedTokenAddress !== zeroAddress && fetchedAllowance !== undefined) {
      setApprovalNeeded(totalReward > (fetchedAllowance as bigint));
    } else {
      setApprovalNeeded(false);
    }
  }, [totalReward, fetchedAllowance, selectedTokenAddress]);

  const handleCreateTask = async () => {
    if (!address) return setMessage("Connect Wallet First!");
    if (totalReward < minRewardAmount) return setMessage("Reward too low!");

    const calls: any[] = [];

    // ১. ERC20 হলে অ্যাপ্রুভাল কল যোগ হবে
    if (approvalNeeded && selectedTokenAddress !== zeroAddress) {
      calls.push({
        to: selectedTokenAddress,
        data: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CONTRACT_ADDRESS as `0x${string}`, totalReward],
        }),
      });
    }

    // ২. createTask কল (টাইপ এরর ফিক্স করতে any ব্যবহার করা হয়েছে)
    const taskArgs = [
      selectedTaskType, 
      targetId, 
      selectedTokenAddress, 
      totalReward, 
      BigInt(maxWinners)
    ];

    calls.push({
      to: CONTRACT_ADDRESS as `0x${string}`,
      data: encodeFunctionData({
        abi: ABI,
        functionName: "createTask",
        args: taskArgs as any, 
      }),
      value: selectedTokenAddress === zeroAddress ? totalReward : 0n,
    });

    try {
      setMessage("Requesting transaction...");
      sendCalls({
        calls: calls,
      }, {
        onSuccess: () => {
          setMessage("Task Created Successfully! ✅");
          setTargetId("");
          setRewardAmount("");
          refetchAllowance();
        },
        onError: (err) => {
          console.error(err);
          setMessage("Transaction failed.");
        }
      });
    } catch (err) {
      console.error(err);
      setMessage("Execution error.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>New Task</h1>
      
      <div className={styles.label}>TASK TYPE</div>
      <div className={styles.taskTypeGrid}>
        {["Follow", "Boost", "Quote", "Channel"].map((name, index) => (
          <button 
            key={name} 
            className={`${styles.taskTypeButton} ${selectedTaskType === index ? styles.active : ""}`}
            onClick={() => setSelectedTaskType(index)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className={styles.inputGroup}>
        <input className={styles.inputField} placeholder="https://farcaster.xyz/username" value={targetId} onChange={e => setTargetId(e.target.value)} />
      </div>

      <div className={styles.label}>PAYMENT</div>
      <div className={styles.tokenGrid}>
        <button className={`${styles.tokenButton} ${selectedTokenAddress === zeroAddress ? styles.activeToken : ""}`} onClick={() => setSelectedTokenAddress(zeroAddress)}>
          <span className={styles.tokenIcon}>Ξ</span> ETH
        </button>
        <button className={`${styles.tokenButton} ${selectedTokenAddress === USDC_ADDRESS ? styles.activeToken : ""}`} onClick={() => setSelectedTokenAddress(USDC_ADDRESS)}>
          <span className={styles.tokenIcon}>$</span> USDC
        </button>
        <button className={`${styles.tokenButton} ${selectedTokenAddress === DEGEN_ADDRESS ? styles.activeToken : ""}`} onClick={() => setSelectedTokenAddress(DEGEN_ADDRESS)}>
          <span className={styles.tokenIcon}>🎩</span> DEGEN
        </button>
      </div>

      <div className={styles.rewardInputRow}>
         <div className={styles.rewardBox}>
            <label>Amount per user</label>
            <input type="number" value={rewardAmount} onChange={e => setRewardAmount(e.target.value)} placeholder="0.0001" />
         </div>
         <div className={styles.rewardBox}>
            <label>Total Winners</label>
            <input type="number" value={maxWinners} onChange={e => setMaxWinners(e.target.value)} placeholder="10" />
         </div>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryItem}>
            <span>Total Reward</span>
            <span className={styles.summaryValue}>{formatUnits(totalReward, tokenDecimals)} {selectedTokenAddress === zeroAddress ? "ETH" : "Token"}</span>
        </div>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      <button className={styles.createTaskButton} onClick={handleCreateTask} disabled={isPending || !isConnected}>
        {isPending ? "Confirming..." : approvalNeeded ? "Approve & Create" : "Create Task"}
      </button>
    </div>
  );
}