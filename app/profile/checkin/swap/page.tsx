"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  usePublicClient,
  useReadContract,
  useSwitchChain,
  useSendCalls,
  useCallsStatus,
} from "wagmi";
import { erc20Abi, formatUnits, parseUnits, encodeFunctionData } from "viem";
import sdk from "@farcaster/miniapp-sdk";
import Image from "next/image";
import {
  Activity,
  ArrowDownUp,
  Award,
  Gift,
  Loader2,
  Moon,
  Sun,
  Trophy,
  // Terminal, // Commented out
  // Trash2    // Commented out
} from "lucide-react";

import { CELO_CONTRACT_ADDRESS } from "@/lib/celo";
import styles from "./swap.module.css";

const CELO_CHAIN_ID = 42220;

const MINI_ABI = [
  {
    name: "getDexConfig",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "address", name: "router" },
      { type: "address", name: "quoter" },
      { type: "address", name: "cusd" },
    ],
  },
  {
    name: "getSwapTokens",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "address", name: "wCelo" },
      { type: "address", name: "rewardToken" },
    ],
  },
  {
    name: "getUserSwapVolume",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "address", name: "user" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getCurrentSeasonLeaderboardData",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "address[]", name: "users" },
      { type: "uint256[]", name: "volumes" },
    ],
  },
  {
    name: "getCurrentSwapSeason",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getPoolFeeTier",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint24" }],
  },
  {
    name: "quoteCeloToCusd",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "uint256", name: "amountIn" }],
    outputs: [
      { type: "uint256", name: "amountOut" },
      { type: "uint24", name: "feeUsed" }
    ],
  },
  {
    name: "quoteCusdToCelo",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "uint256", name: "amountIn" }],
    outputs: [
      { type: "uint256", name: "amountOut" },
      { type: "uint24", name: "feeUsed" }
    ],
  },
  {
    name: "swapCeloToCusd",
    type: "function",
    stateMutability: "payable",
    inputs: [{ type: "uint256", name: "amountOutMinimum" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "swapCusdToCelo",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { type: "uint256", name: "amountIn" },
      { type: "uint256", name: "amountOutMinimum" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

const QUOTER_V2_ABI = [
  {
    name: "quoteExactInputSingle",
    type: "function",
    stateMutability: "view",
    inputs: [
      {
        components: [
          { type: "address", name: "tokenIn" },
          { type: "address", name: "tokenOut" },
          { type: "uint256", name: "amountIn" },
          { type: "uint24", name: "fee" },
          { type: "uint160", name: "sqrtPriceLimitX96" },
        ],
        type: "tuple",
        name: "params",
      },
    ],
    outputs: [
      { type: "uint256", name: "amountOut" },
      { type: "uint160", name: "sqrtPriceLimitX96After" },
      { type: "uint32", name: "initializedTicksCrossed" },
      { type: "uint256", name: "gasEstimate" },
    ],
  },
] as const;

const QUOTER_V1_ABI = [
  {
    name: "quoteExactInputSingle",
    type: "function",
    stateMutability: "view",
    inputs: [
      { type: "address", name: "tokenIn" },
      { type: "address", name: "tokenOut" },
      { type: "uint24", name: "fee" },
      { type: "uint256", name: "amountIn" },
      { type: "uint160", name: "sqrtPriceLimitX96" },
    ],
    outputs: [{ type: "uint256", name: "amountOut" }],
  },
] as const;

function getReadableError(error: any) {
  const msg = error?.shortMessage || error?.message || error?.details || "Transaction failed";
  if (msg?.includes("User rejected") || msg?.includes("rejected")) {
    return "Transaction cancelled by user";
  }
  return msg;
}

function scaleDown(amount: bigint, bps: bigint) {
  return (amount * (10000n - bps)) / 10000n;
}

export default function SwapPage() {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCeloToCusd, setIsCeloToCusd] = useState(true);
  const [txStatus, setTxStatus] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [quoteData, setQuoteData] = useState<bigint | null>(null);
  const [expectedOut, setExpectedOut] = useState("");
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [slippagePercent, setSlippagePercent] = useState<number>(0.1);
  const [callId, setCallId] = useState<string>("");

  /* DEBUG CONSOLE COMMENTED OUT
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addLog = (title: string, data?: any) => {
    const time = new Date().toLocaleTimeString();
    let parsedData = "";
    if (data !== undefined) {
      try {
        parsedData = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
      } catch (e) {
        parsedData = "Object parsing error";
      }
    }
    setDebugLogs((prev) => [...prev, `[${time}] ${title} ${parsedData ? "\n" + parsedData : ""}`]);
  };
  */

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();
  
  const { sendCallsAsync, isPending: isSendingTx } = useSendCalls();

  const { data: callsStatus } = useCallsStatus({
    id: callId,
    query: {
      enabled: Boolean(callId),
      refetchInterval: 1500,
    },
  });

  const { data: dexConfigData } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getDexConfig",
    chainId: CELO_CHAIN_ID,
  });

  const { data: swapTokensData } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getSwapTokens",
    chainId: CELO_CHAIN_ID,
  });

  const { data: poolFeeTierData } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getPoolFeeTier",
    chainId: CELO_CHAIN_ID,
  });

  const feePercentageString = poolFeeTierData ? (Number(poolFeeTierData) / 10000).toString() : "0.3";

  const { data: celoBalance, refetch: refetchCeloBal } = useBalance({
    address,
    chainId: CELO_CHAIN_ID,
  });

  const routerAddress = dexConfigData?.[0];
  const quoterAddress = dexConfigData?.[1];
  const cusdAddress = dexConfigData?.[2];
  const wCeloAddress = swapTokensData?.[0];
  
  const { data: cusdBalanceData, refetch: refetchCusdBal } = useReadContract({
    address: cusdAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: CELO_CHAIN_ID,
    query: { enabled: !!address && !!cusdAddress },
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: cusdAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && cusdAddress ? [address, CELO_CONTRACT_ADDRESS] : undefined,
    chainId: CELO_CHAIN_ID,
    query: { enabled: !!address && !!cusdAddress },
  });

  const { data: userVolumeData, refetch: refetchVolume } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getUserSwapVolume",
    args: address ? [address] : undefined,
    chainId: CELO_CHAIN_ID,
  });

  const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getCurrentSeasonLeaderboardData",
    chainId: CELO_CHAIN_ID,
  });

  const { data: seasonData } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getCurrentSwapSeason",
    chainId: CELO_CHAIN_ID,
  });

  useEffect(() => {
    setMounted(true);
    // addLog("🟢 App Mounted"); // Commented out
    try { sdk.actions.ready(); } catch (e) {}
  }, []);

  useEffect(() => {
    if (!mounted || isConnected) return;
    const connector = connectors.find((c) => c.id === "injected") || connectors[0];
    if (connector) connect({ connector, chainId: CELO_CHAIN_ID });
  }, [mounted, isConnected, connectors, connect]);

  useEffect(() => {
    if (isConnected && chain?.id !== CELO_CHAIN_ID && switchChain) {
      switchChain({ chainId: CELO_CHAIN_ID });
    }
  }, [isConnected, chain, switchChain]);

  useEffect(() => {
    if (!mounted) return;
    if (!isDarkMode) document.body.classList.add(styles.lightMode);
    else document.body.classList.remove(styles.lightMode);
  }, [isDarkMode, mounted]);

  useEffect(() => {
    if (!callsStatus) return;
    
    // 🔥 TS Fix: Type casting using 'as string' to avoid overlap error
    const status = callsStatus.status as string; 
    
    if (status === "CONFIRMED" || status === "success") {
      setTxStatus("Swap Successful! 🚀");
      setIsProcessing(false);
      setCallId("");
      setAmount("");
      refetchCeloBal(); refetchCusdBal(); refetchVolume(); refetchLeaderboard(); refetchAllowance();
    } else if (status === "REVERTED" || status === "error" || status === "failure") {
      setError("Transaction failed on-chain.");
      setTxStatus("");
      setIsProcessing(false);
      setCallId("");
    }
  }, [callsStatus, refetchCeloBal, refetchCusdBal, refetchVolume, refetchLeaderboard, refetchAllowance]);

  const amountInWei = amount && !isNaN(Number(amount)) ? parseUnits(amount, 18) : 0n;

  useEffect(() => {
    let isSubscribed = true;
    const fetchQuote = async () => {
      if (!amountInWei || amountInWei <= 0n || !publicClient || !quoterAddress) {
        setQuoteData(null); setExpectedOut(""); setIsFetchingQuote(false);
        return;
      }
      setIsFetchingQuote(true);
      try {
        const proxyData = await publicClient.readContract({
          address: CELO_CONTRACT_ADDRESS,
          abi: MINI_ABI,
          functionName: isCeloToCusd ? "quoteCeloToCusd" : "quoteCusdToCelo",
          args: [amountInWei],
        });
        if (isSubscribed) {
          const outAmount = (proxyData as readonly [bigint, number])[0];
          setQuoteData(outAmount);
          setExpectedOut(formatUnits(outAmount, 18));
          setIsFetchingQuote(false);
          return;
        }
      } catch (err) {}

      const tokenIn = isCeloToCusd ? wCeloAddress : cusdAddress;
      const tokenOut = isCeloToCusd ? cusdAddress : wCeloAddress;
      const expectedFee = poolFeeTierData ? Number(poolFeeTierData) : 3000;

      if (tokenIn && tokenOut) {
        try {
          const v2Data = await publicClient.readContract({
            address: quoterAddress as `0x${string}`,
            abi: QUOTER_V2_ABI,
            functionName: "quoteExactInputSingle",
            args: [{
                tokenIn: tokenIn as `0x${string}`,
                tokenOut: tokenOut as `0x${string}`,
                amountIn: amountInWei,
                fee: expectedFee,
                sqrtPriceLimitX96: 0n,
            }],
          });
          if (isSubscribed) {
            setQuoteData(v2Data[0] as bigint);
            setExpectedOut(formatUnits(v2Data[0] as bigint, 18));
            setIsFetchingQuote(false);
            return;
          }
        } catch (err2) {
          try {
            const v1Data = await publicClient.readContract({
              address: quoterAddress as `0x${string}`,
              abi: QUOTER_V1_ABI,
              functionName: "quoteExactInputSingle",
              args: [tokenIn as `0x${string}`, tokenOut as `0x${string}`, expectedFee, amountInWei, 0n],
            });
            if (isSubscribed) {
              setQuoteData(v1Data as unknown as bigint);
              setExpectedOut(formatUnits(v1Data as unknown as bigint, 18));
              setIsFetchingQuote(false);
              return;
            }
          } catch (err3) {}
        }
      }
      if (isSubscribed) {
        setQuoteData(0n);
        setExpectedOut("Pool too small or Error");
        setIsFetchingQuote(false);
      }
    };
    const timer = setTimeout(fetchQuote, 400);
    return () => { clearTimeout(timer); isSubscribed = false; };
  }, [amountInWei, isCeloToCusd, publicClient, quoterAddress, cusdAddress, wCeloAddress, poolFeeTierData]);

  const handleMaxBalance = () => {
    if (isCeloToCusd) {
      const bal = celoBalance?.value || 0n;
      const gasBuffer = parseUnits("0.002", 18);
      setAmount(bal > gasBuffer ? formatUnits(bal - gasBuffer, 18) : "0");
    } else {
      setAmount(formatUnits((cusdBalanceData as bigint) || 0n, 18));
    }
  };

  const handleSwap = async () => {
    try {
      setError(""); 
      setTxStatus("");

      if (!isConnected || !address) { setError("Connect Wallet First"); return; }
      if (!amountInWei || amountInWei <= 0n) { setError("Invalid Amount"); return; }
      if (!routerAddress || !cusdAddress || !wCeloAddress) { setError("Contracts loading..."); return; }

      setIsProcessing(true);
      setCallId("");

      const slippageBps = BigInt(Math.floor(slippagePercent * 100));
      const amountOutMin = quoteData ? scaleDown(quoteData, slippageBps) : 0n;

      if (isCeloToCusd) {
        const balance = celoBalance?.value || 0n;
        const gasBuffer = parseUnits("0.002", 18);

        if (balance < amountInWei + gasBuffer) {
          setError("Keep at least 0.002 CELO for gas");
          setIsProcessing(false); return;
        }

        const callData = encodeFunctionData({
          abi: MINI_ABI,
          functionName: "swapCeloToCusd",
          args: [amountOutMin],
        });

        const result = await sendCallsAsync({
          calls: [{
            to: CELO_CONTRACT_ADDRESS as `0x${string}`,
            data: callData,
            value: amountInWei,
          }],
        });
        
        const newCallId = typeof result === "string" ? result : (result as any).id;
        setCallId(newCallId);

      } else {
        const cBalance = (cusdBalanceData as bigint) || 0n;
        if (cBalance < amountInWei) {
          setError("Not enough USDm balance");
          setIsProcessing(false); return;
        }

        const allowance = (allowanceData as bigint) || 0n;
        const batchedCalls = [];

        if (allowance < amountInWei) {
          const approveData = encodeFunctionData({
            abi: erc20Abi,
            functionName: "approve",
            args: [CELO_CONTRACT_ADDRESS, amountInWei],
          });
          batchedCalls.push({
            to: cusdAddress as `0x${string}`,
            data: approveData,
          });
        }

        const swapData = encodeFunctionData({
          abi: MINI_ABI,
          functionName: "swapCusdToCelo",
          args: [amountInWei, amountOutMin],
        });
        
        batchedCalls.push({
          to: CELO_CONTRACT_ADDRESS as `0x${string}`,
          data: swapData,
        });

        const result = await sendCallsAsync({
          calls: batchedCalls,
        });

        const newCallId = typeof result === "string" ? result : (result as any).id;
        setCallId(newCallId);
      }
    } catch (err: any) {
      setError(getReadableError(err));
      setTxStatus(""); 
      setIsProcessing(false);
      setCallId("");
    }
  };

  const celoBalStr = Number(formatUnits(celoBalance?.value || 0n, 18)).toFixed(4);
  const cusdBalStr = Number(formatUnits((cusdBalanceData as bigint) || 0n, 18)).toFixed(4);
  
  // 🔥 USDm Branding
  const payBalStr = isCeloToCusd ? `${celoBalStr} CELO` : `${cusdBalStr} USDm`;
  const recBalStr = isCeloToCusd ? `${cusdBalStr} USDm` : `${celoBalStr} CELO`;

  const userVolume = userVolumeData ? Number(formatUnits(userVolumeData as bigint, 18)).toFixed(4) : "0.0000";

  const topUsers = useMemo(() => {
    if (!leaderboardData) return [];
    const users = leaderboardData[0] as string[];
    const volumes = leaderboardData[1] as bigint[];
    return users.map((u, i) => ({ 
      address: u, 
      vol: Number(formatUnits(volumes[i] || 0n, 18)).toFixed(2),
      pfpUrl: `https://avatar.vercel.sh/${u}?size=60`
    })).sort((a, b) => Number(b.vol) - Number(a.vol)).slice(0, 20);
  }, [leaderboardData]);

  const isBtnDisabled = isSendingTx || isProcessing || !!callId || amountInWei === 0n || isFetchingQuote || !isConnected;

  if (!mounted) return <div className={styles.loading}><Loader2 className="animate-spin" size={28} color="#3b82f6" /></div>;

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      <nav className={styles.topBar}>
        <h1 className={styles.pageTitle}><Activity /> Swap & Earn</h1>
        <button className={styles.themeBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </nav>

      <div className={styles.rewardBanner}>
        <h2 className={styles.bannerTitle}><Gift color="#fbbf24" /> Monthly Rewards Pay on Base Chain</h2>
        <div className={styles.prizes}>
          <div className={styles.prizeBox}>
            <div className={`${styles.prizeRank} ${styles.rank1}`}>1st Place</div>
            <div className={styles.prizeAmount}>1 USDC</div>
          </div>
          <div className={styles.prizeBox}>
            <div className={`${styles.prizeRank} ${styles.rank2}`}>2nd Place</div>
            <div className={styles.prizeAmount}>0.5 USDC</div>
          </div>
          <div className={styles.prizeBox}>
            <div className={`${styles.prizeRank} ${styles.rank3}`}>3rd Place</div>
            <div className={styles.prizeAmount}>0.3 USDC</div>
          </div>
        </div>
        {/* <div className={styles.seasonInfo}>Season: {seasonData ? seasonData.toString() : "-"}</div> */}
      </div>

      <div className={styles.swapCard}>
        <div className={styles.inputGroup}>
          <div className={styles.inputHeader}>
            <span>You Pay</span>
            <span onClick={handleMaxBalance} className={styles.balanceLink} >
              Bal: {payBalStr}
            </span>
          </div>
          <div className={styles.inputRow}>
            <input type="number" className={styles.amountInput} placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isSendingTx || isProcessing || !!callId} />
            <div className={styles.tokenBadge}>
               <Image 
                src={isCeloToCusd ? "/celo-celo-logo.png" : "/USDm.png"} // 🔥 Provide local path or URL for USDm logo
                alt="token" width={18} height={18} unoptimized 
               />
               {isCeloToCusd ? "CELO" : "USDm"}
            </div>
          </div>
        </div>

        <div className={styles.switchWrapper}>
          <button className={styles.switchBtn} onClick={() => { if (!isSendingTx && !isProcessing && !callId) { setIsCeloToCusd(!isCeloToCusd); setAmount(""); } }}>
            <ArrowDownUp size={16} />
          </button>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputHeader}>
            <span>You Receive</span>
            <span className={styles.balText}>Bal: {recBalStr}</span>
          </div>
          <div className={styles.inputRow}>
            <input type="text" className={styles.amountInput} placeholder="0.0" value={isFetchingQuote ? "..." : expectedOut} readOnly />
            <div className={`${styles.tokenBadge} ${isCeloToCusd ? styles.badgeReceiveGreen : styles.badgeReceiveBlue}`}>
              <Image 
                src={!isCeloToCusd ? "/celo-celo-logo.png" : "/USDm.png"} // 🔥 Provide local path or URL for USDm logo
                alt="token" width={18} height={18} unoptimized 
              />
              {!isCeloToCusd ? "CELO" : "USDm"}
            </div>
          </div>
        </div>

        <div className={styles.configBox}>
          <div className={styles.configRow}>
            <span>Slippage</span>
            <div className={styles.slippageGroup}>
              {[0.01, 0.05, 0.1].map(v => (
                <button 
                  key={v} 
                  onClick={() => setSlippagePercent(v)} 
                  className={slippagePercent === v ? styles.slipActive : ""}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
          <div className={styles.configRow}>
            <span>LP Fee</span>
            <span>{feePercentageString}%</span>
          </div>
        </div>

        <button className={styles.swapBtn} onClick={handleSwap} disabled={isBtnDisabled}>
          {!isConnected ? "Connect Wallet First" : (isSendingTx || isProcessing || !!callId) ? <><Loader2 className="animate-spin loaderIcon" size={20} /> <span className={styles.loaderText}>Processing...</span></> : "Swap Now"}
        </button>

        {txStatus && !isSendingTx && !error && !callId && <div className={styles.successMsg}>{txStatus}</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}
        
        <div className={styles.myVolume}>
          Your Monthly Volume: <span className={styles.volumeHighlight}>{userVolume} Vol</span>
        </div>
      </div>

      <div className={styles.leaderboard}>
        <h3 className={styles.leaderboardHeader}>
          <Trophy color="#fbbf24" size={20} /> Top 20 Swappers
        </h3>
        <div className={styles.listContainer}>
          {topUsers.length > 0 ? topUsers.map((u, i) => {
            const isMe = address && u.address.toLowerCase() === address?.toLowerCase();
            return (
            <div key={u.address} className={`${styles.rankRow} ${i === 0 ? styles.top1Row : i === 1 ? styles.top2Row : i === 2 ? styles.top3Row : ""}`}>
              <div className={styles.rowLeft}>
                <div className={`${styles.rankNum} ${i === 0 ? styles.rank1 : i === 1 ? styles.rank2 : i === 2 ? styles.rank3 : ""}`}>{i+1}</div>
                <Image src={u.pfpUrl} alt="pfp" width={32} height={32} className={styles.pfp} unoptimized />
                <div className={styles.userAddressWrapper}>
                  <span className={styles.userAddress}>{u.address.slice(0,6)}...{u.address.slice(-4)}</span>
                  {isMe && <span className={styles.youTag}>(You)</span>}
                </div>
              </div>
              <div className={styles.rowRight}>
                <span className={styles.volAmount}>{u.vol} Vol</span>
                {i === 0 && <span className={`${styles.rewardTag} ${styles.rank1}`}><Award size={10} /> 1 USDC</span>}
                {i === 1 && <span className={`${styles.rewardTag} ${styles.rank2}`}><Award size={10} /> 0.5 USDC</span>}
                {i === 2 && <span className={`${styles.rewardTag} ${styles.rank3}`}><Award size={10} /> 0.3 USDC</span>}
              </div>
            </div>
            );
          }) : <div className={styles.emptyState}>No swaps this season yet.</div>}
        </div>
      </div>

      {/* DEBUG CONSOLE UI COMMENTED OUT 
      <div className={styles.console}>
        <div className={styles.consoleHeader}>
          <div className={styles.consoleHeaderTitle}>
            <Terminal size={16} /> Debug Console
          </div>
          <button 
            onClick={() => {}} 
            className={styles.trashBtn}
          >
            <Trash2 size={16} />
          </button>
        </div>
        {debugLogs.length === 0 ? <div className={styles.consoleWaiting}>Waiting for actions...</div> : debugLogs.map((log, i) => <div key={i} className={styles.logLine}>{log}</div>)}
      </div>
      */}
    </div>
  );
}


































// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   useAccount,
//   useBalance,
//   useConnect,
//   usePublicClient,
//   useReadContract,
//   useSwitchChain,
//   useSendCalls,
//   useCallsStatus,
// } from "wagmi";
// import { erc20Abi, formatUnits, parseUnits, encodeFunctionData } from "viem";
// import sdk from "@farcaster/miniapp-sdk";
// import Image from "next/image";
// import {
//   Activity,
//   ArrowDownUp,
//   Award,
//   Gift,
//   Loader2,
//   Moon,
//   Sun,
//   Trophy,
//   // Terminal, // Commented out
//   // Trash2    // Commented out
// } from "lucide-react";

// import { CELO_CONTRACT_ADDRESS } from "@/lib/celo";
// import styles from "./swap.module.css";

// const CELO_CHAIN_ID = 42220;

// const MINI_ABI = [
//   {
//     name: "getDexConfig",
//     type: "function",
//     stateMutability: "view",
//     inputs: [],
//     outputs: [
//       { type: "address", name: "router" },
//       { type: "address", name: "quoter" },
//       { type: "address", name: "cusd" },
//     ],
//   },
//   {
//     name: "getSwapTokens",
//     type: "function",
//     stateMutability: "view",
//     inputs: [],
//     outputs: [
//       { type: "address", name: "wCelo" },
//       { type: "address", name: "rewardToken" },
//     ],
//   },
//   {
//     name: "getUserSwapVolume",
//     type: "function",
//     stateMutability: "view",
//     inputs: [{ type: "address", name: "user" }],
//     outputs: [{ type: "uint256" }],
//   },
//   {
//     name: "getCurrentSeasonLeaderboardData",
//     type: "function",
//     stateMutability: "view",
//     inputs: [],
//     outputs: [
//       { type: "address[]", name: "users" },
//       { type: "uint256[]", name: "volumes" },
//     ],
//   },
//   {
//     name: "getCurrentSwapSeason",
//     type: "function",
//     stateMutability: "view",
//     inputs: [],
//     outputs: [{ type: "uint256" }],
//   },
//   {
//     name: "getPoolFeeTier",
//     type: "function",
//     stateMutability: "view",
//     inputs: [],
//     outputs: [{ type: "uint24" }],
//   },
//   {
//     name: "quoteCeloToCusd",
//     type: "function",
//     stateMutability: "view",
//     inputs: [{ type: "uint256", name: "amountIn" }],
//     outputs: [
//       { type: "uint256", name: "amountOut" },
//       { type: "uint24", name: "feeUsed" }
//     ],
//   },
//   {
//     name: "quoteCusdToCelo",
//     type: "function",
//     stateMutability: "view",
//     inputs: [{ type: "uint256", name: "amountIn" }],
//     outputs: [
//       { type: "uint256", name: "amountOut" },
//       { type: "uint24", name: "feeUsed" }
//     ],
//   },
//   {
//     name: "swapCeloToCusd",
//     type: "function",
//     stateMutability: "payable",
//     inputs: [{ type: "uint256", name: "amountOutMinimum" }],
//     outputs: [{ type: "uint256" }],
//   },
//   {
//     name: "swapCusdToCelo",
//     type: "function",
//     stateMutability: "nonpayable",
//     inputs: [
//       { type: "uint256", name: "amountIn" },
//       { type: "uint256", name: "amountOutMinimum" },
//     ],
//     outputs: [{ type: "uint256" }],
//   },
// ] as const;

// const QUOTER_V2_ABI = [
//   {
//     name: "quoteExactInputSingle",
//     type: "function",
//     stateMutability: "view",
//     inputs: [
//       {
//         components: [
//           { type: "address", name: "tokenIn" },
//           { type: "address", name: "tokenOut" },
//           { type: "uint256", name: "amountIn" },
//           { type: "uint24", name: "fee" },
//           { type: "uint160", name: "sqrtPriceLimitX96" },
//         ],
//         type: "tuple",
//         name: "params",
//       },
//     ],
//     outputs: [
//       { type: "uint256", name: "amountOut" },
//       { type: "uint160", name: "sqrtPriceLimitX96After" },
//       { type: "uint32", name: "initializedTicksCrossed" },
//       { type: "uint256", name: "gasEstimate" },
//     ],
//   },
// ] as const;

// const QUOTER_V1_ABI = [
//   {
//     name: "quoteExactInputSingle",
//     type: "function",
//     stateMutability: "view",
//     inputs: [
//       { type: "address", name: "tokenIn" },
//       { type: "address", name: "tokenOut" },
//       { type: "uint24", name: "fee" },
//       { type: "uint256", name: "amountIn" },
//       { type: "uint160", name: "sqrtPriceLimitX96" },
//     ],
//     outputs: [{ type: "uint256", name: "amountOut" }],
//   },
// ] as const;

// function getReadableError(error: any) {
//   const msg = error?.shortMessage || error?.message || error?.details || "Transaction failed";
//   if (msg?.includes("User rejected") || msg?.includes("rejected")) {
//     return "Transaction cancelled by user";
//   }
//   return msg;
// }

// function scaleDown(amount: bigint, bps: bigint) {
//   return (amount * (10000n - bps)) / 10000n;
// }

// export default function SwapPage() {
//   const [mounted, setMounted] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isCeloToCusd, setIsCeloToCusd] = useState(true);
//   const [txStatus, setTxStatus] = useState("");
//   const [error, setError] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [quoteData, setQuoteData] = useState<bigint | null>(null);
//   const [expectedOut, setExpectedOut] = useState("");
//   const [isFetchingQuote, setIsFetchingQuote] = useState(false);
//   const [slippagePercent, setSlippagePercent] = useState<number>(0.1);
//   const [callId, setCallId] = useState<string>("");

//   /* DEBUG CONSOLE COMMENTED OUT
//   const [debugLogs, setDebugLogs] = useState<string[]>([]);
//   const addLog = (title: string, data?: any) => {
//     const time = new Date().toLocaleTimeString();
//     let parsedData = "";
//     if (data !== undefined) {
//       try {
//         parsedData = typeof data === "object" ? JSON.stringify(data, null, 2) : String(data);
//       } catch (e) {
//         parsedData = "Object parsing error";
//       }
//     }
//     setDebugLogs((prev) => [...prev, `[${time}] ${title} ${parsedData ? "\n" + parsedData : ""}`]);
//   };
//   */

//   const { address, isConnected, chain } = useAccount();
//   const { connect, connectors } = useConnect();
//   const { switchChain } = useSwitchChain();
//   const publicClient = usePublicClient();
  
//   const { sendCallsAsync, isPending: isSendingTx } = useSendCalls();

//   const { data: callsStatus } = useCallsStatus({
//     id: callId,
//     query: {
//       enabled: Boolean(callId),
//       refetchInterval: 1500,
//     },
//   });

//   const { data: dexConfigData } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getDexConfig",
//     chainId: CELO_CHAIN_ID,
//   });

//   const { data: swapTokensData } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getSwapTokens",
//     chainId: CELO_CHAIN_ID,
//   });

//   const { data: poolFeeTierData } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getPoolFeeTier",
//     chainId: CELO_CHAIN_ID,
//   });

//   const feePercentageString = poolFeeTierData ? (Number(poolFeeTierData) / 10000).toString() : "0.3";

//   const { data: celoBalance, refetch: refetchCeloBal } = useBalance({
//     address,
//     chainId: CELO_CHAIN_ID,
//   });

//   const routerAddress = dexConfigData?.[0];
//   const quoterAddress = dexConfigData?.[1];
//   const cusdAddress = dexConfigData?.[2];
//   const wCeloAddress = swapTokensData?.[0];
  
//   const { data: cusdBalanceData, refetch: refetchCusdBal } = useReadContract({
//     address: cusdAddress as `0x${string}`,
//     abi: erc20Abi,
//     functionName: "balanceOf",
//     args: address ? [address] : undefined,
//     chainId: CELO_CHAIN_ID,
//     query: { enabled: !!address && !!cusdAddress },
//   });

//   const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
//     address: cusdAddress as `0x${string}`,
//     abi: erc20Abi,
//     functionName: "allowance",
//     args: address && cusdAddress ? [address, CELO_CONTRACT_ADDRESS] : undefined,
//     chainId: CELO_CHAIN_ID,
//     query: { enabled: !!address && !!cusdAddress },
//   });

//   const { data: userVolumeData, refetch: refetchVolume } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getUserSwapVolume",
//     args: address ? [address] : undefined,
//     chainId: CELO_CHAIN_ID,
//   });

//   const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getCurrentSeasonLeaderboardData",
//     chainId: CELO_CHAIN_ID,
//   });

//   const { data: seasonData } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS,
//     abi: MINI_ABI,
//     functionName: "getCurrentSwapSeason",
//     chainId: CELO_CHAIN_ID,
//   });

//   useEffect(() => {
//     setMounted(true);
//     // addLog("🟢 App Mounted"); // Commented out
//     try { sdk.actions.ready(); } catch (e) {}
//   }, []);

//   useEffect(() => {
//     if (!mounted || isConnected) return;
//     const connector = connectors.find((c) => c.id === "injected") || connectors[0];
//     if (connector) connect({ connector, chainId: CELO_CHAIN_ID });
//   }, [mounted, isConnected, connectors, connect]);

//   useEffect(() => {
//     if (isConnected && chain?.id !== CELO_CHAIN_ID && switchChain) {
//       switchChain({ chainId: CELO_CHAIN_ID });
//     }
//   }, [isConnected, chain, switchChain]);

//   useEffect(() => {
//     if (!mounted) return;
//     if (!isDarkMode) document.body.classList.add(styles.lightMode);
//     else document.body.classList.remove(styles.lightMode);
//   }, [isDarkMode, mounted]);

//   useEffect(() => {
//     if (!callsStatus) return;
    
//     // 🔥 TS Fix: Type casting using 'as string' to avoid overlap error
//     const status = callsStatus.status as string; 
    
//     if (status === "CONFIRMED" || status === "success") {
//       setTxStatus("Swap Successful! 🚀");
//       setIsProcessing(false);
//       setCallId("");
//       setAmount("");
//       refetchCeloBal(); refetchCusdBal(); refetchVolume(); refetchLeaderboard(); refetchAllowance();
//     } else if (status === "REVERTED" || status === "error" || status === "failure") {
//       setError("Transaction failed on-chain.");
//       setTxStatus("");
//       setIsProcessing(false);
//       setCallId("");
//     }
//   }, [callsStatus, refetchCeloBal, refetchCusdBal, refetchVolume, refetchLeaderboard, refetchAllowance]);

//   const amountInWei = amount && !isNaN(Number(amount)) ? parseUnits(amount, 18) : 0n;

//   useEffect(() => {
//     let isSubscribed = true;
//     const fetchQuote = async () => {
//       if (!amountInWei || amountInWei <= 0n || !publicClient || !quoterAddress) {
//         setQuoteData(null); setExpectedOut(""); setIsFetchingQuote(false);
//         return;
//       }
//       setIsFetchingQuote(true);
//       try {
//         const proxyData = await publicClient.readContract({
//           address: CELO_CONTRACT_ADDRESS,
//           abi: MINI_ABI,
//           functionName: isCeloToCusd ? "quoteCeloToCusd" : "quoteCusdToCelo",
//           args: [amountInWei],
//         });
//         if (isSubscribed) {
//           const outAmount = (proxyData as readonly [bigint, number])[0];
//           setQuoteData(outAmount);
//           setExpectedOut(formatUnits(outAmount, 18));
//           setIsFetchingQuote(false);
//           return;
//         }
//       } catch (err) {}

//       const tokenIn = isCeloToCusd ? wCeloAddress : cusdAddress;
//       const tokenOut = isCeloToCusd ? cusdAddress : wCeloAddress;
//       const expectedFee = poolFeeTierData ? Number(poolFeeTierData) : 3000;

//       if (tokenIn && tokenOut) {
//         try {
//           const v2Data = await publicClient.readContract({
//             address: quoterAddress as `0x${string}`,
//             abi: QUOTER_V2_ABI,
//             functionName: "quoteExactInputSingle",
//             args: [{
//                 tokenIn: tokenIn as `0x${string}`,
//                 tokenOut: tokenOut as `0x${string}`,
//                 amountIn: amountInWei,
//                 fee: expectedFee,
//                 sqrtPriceLimitX96: 0n,
//             }],
//           });
//           if (isSubscribed) {
//             setQuoteData(v2Data[0] as bigint);
//             setExpectedOut(formatUnits(v2Data[0] as bigint, 18));
//             setIsFetchingQuote(false);
//             return;
//           }
//         } catch (err2) {
//           try {
//             const v1Data = await publicClient.readContract({
//               address: quoterAddress as `0x${string}`,
//               abi: QUOTER_V1_ABI,
//               functionName: "quoteExactInputSingle",
//               args: [tokenIn as `0x${string}`, tokenOut as `0x${string}`, expectedFee, amountInWei, 0n],
//             });
//             if (isSubscribed) {
//               setQuoteData(v1Data as unknown as bigint);
//               setExpectedOut(formatUnits(v1Data as unknown as bigint, 18));
//               setIsFetchingQuote(false);
//               return;
//             }
//           } catch (err3) {}
//         }
//       }
//       if (isSubscribed) {
//         setQuoteData(0n);
//         setExpectedOut("Pool too small or Error");
//         setIsFetchingQuote(false);
//       }
//     };
//     const timer = setTimeout(fetchQuote, 400);
//     return () => { clearTimeout(timer); isSubscribed = false; };
//   }, [amountInWei, isCeloToCusd, publicClient, quoterAddress, cusdAddress, wCeloAddress, poolFeeTierData]);

//   const handleMaxBalance = () => {
//     if (isCeloToCusd) {
//       const bal = celoBalance?.value || 0n;
//       const gasBuffer = parseUnits("0.002", 18);
//       setAmount(bal > gasBuffer ? formatUnits(bal - gasBuffer, 18) : "0");
//     } else {
//       setAmount(formatUnits((cusdBalanceData as bigint) || 0n, 18));
//     }
//   };

//   const handleSwap = async () => {
//     try {
//       setError(""); 
//       setTxStatus("");

//       if (!isConnected || !address) { setError("Connect Wallet First"); return; }
//       if (!amountInWei || amountInWei <= 0n) { setError("Invalid Amount"); return; }
//       if (!routerAddress || !cusdAddress || !wCeloAddress) { setError("Contracts loading..."); return; }

//       setIsProcessing(true);
//       setCallId("");

//       const slippageBps = BigInt(Math.floor(slippagePercent * 100));
//       const amountOutMin = quoteData ? scaleDown(quoteData, slippageBps) : 0n;

//       if (isCeloToCusd) {
//         const balance = celoBalance?.value || 0n;
//         const gasBuffer = parseUnits("0.002", 18);

//         if (balance < amountInWei + gasBuffer) {
//           setError("Keep at least 0.002 CELO for gas");
//           setIsProcessing(false); return;
//         }

//         const callData = encodeFunctionData({
//           abi: MINI_ABI,
//           functionName: "swapCeloToCusd",
//           args: [amountOutMin],
//         });

//         const result = await sendCallsAsync({
//           calls: [{
//             to: CELO_CONTRACT_ADDRESS as `0x${string}`,
//             data: callData,
//             value: amountInWei,
//           }],
//         });
        
//         const newCallId = typeof result === "string" ? result : (result as any).id;
//         setCallId(newCallId);

//       } else {
//         const cBalance = (cusdBalanceData as bigint) || 0n;
//         if (cBalance < amountInWei) {
//           setError("Not enough USDm balance");
//           setIsProcessing(false); return;
//         }

//         const allowance = (allowanceData as bigint) || 0n;
//         const batchedCalls = [];

//         if (allowance < amountInWei) {
//           const approveData = encodeFunctionData({
//             abi: erc20Abi,
//             functionName: "approve",
//             args: [CELO_CONTRACT_ADDRESS, amountInWei],
//           });
//           batchedCalls.push({
//             to: cusdAddress as `0x${string}`,
//             data: approveData,
//           });
//         }

//         const swapData = encodeFunctionData({
//           abi: MINI_ABI,
//           functionName: "swapCusdToCelo",
//           args: [amountInWei, amountOutMin],
//         });
        
//         batchedCalls.push({
//           to: CELO_CONTRACT_ADDRESS as `0x${string}`,
//           data: swapData,
//         });

//         const result = await sendCallsAsync({
//           calls: batchedCalls,
//         });

//         const newCallId = typeof result === "string" ? result : (result as any).id;
//         setCallId(newCallId);
//       }
//     } catch (err: any) {
//       setError(getReadableError(err));
//       setTxStatus(""); 
//       setIsProcessing(false);
//       setCallId("");
//     }
//   };

//   const celoBalStr = Number(formatUnits(celoBalance?.value || 0n, 18)).toFixed(4);
//   const cusdBalStr = Number(formatUnits((cusdBalanceData as bigint) || 0n, 18)).toFixed(4);
  
//   // 🔥 USDm Branding
//   const payBalStr = isCeloToCusd ? `${celoBalStr} CELO` : `${cusdBalStr} USDm`;
//   const recBalStr = isCeloToCusd ? `${cusdBalStr} USDm` : `${celoBalStr} CELO`;

//   const userVolume = userVolumeData ? Number(formatUnits(userVolumeData as bigint, 18)).toFixed(4) : "0.0000";

//   const topUsers = useMemo(() => {
//     if (!leaderboardData) return [];
//     const users = leaderboardData[0] as string[];
//     const volumes = leaderboardData[1] as bigint[];
//     return users.map((u, i) => ({ 
//       address: u, 
//       vol: Number(formatUnits(volumes[i] || 0n, 18)).toFixed(2),
//       pfpUrl: `https://avatar.vercel.sh/${u}?size=60`
//     })).sort((a, b) => Number(b.vol) - Number(a.vol)).slice(0, 20);
//   }, [leaderboardData]);

//   const isBtnDisabled = isSendingTx || isProcessing || !!callId || amountInWei === 0n || isFetchingQuote || !isConnected;

//   if (!mounted) return <div className={styles.loading}><Loader2 className="animate-spin" size={28} color="#3b82f6" /></div>;

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       <nav className={styles.topBar}>
//         <h1 className={styles.pageTitle}><Activity /> Swap & Earn</h1>
//         <button className={styles.themeBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
//           {isDarkMode ? <Sun /> : <Moon />}
//         </button>
//       </nav>

//       <div className={styles.rewardBanner}>
//         <h2 className={styles.bannerTitle}><Gift color="#fbbf24" /> Monthly Rewards</h2>
//         <div className={styles.prizes}>
//           <div className={styles.prizeBox}>
//             <div className={`${styles.prizeRank} ${styles.rank1}`}>1st Place</div>
//             <div className={styles.prizeAmount}>1 USDm</div>
//           </div>
//           <div className={styles.prizeBox}>
//             <div className={`${styles.prizeRank} ${styles.rank2}`}>2nd Place</div>
//             <div className={styles.prizeAmount}>0.5 USDm</div>
//           </div>
//           <div className={styles.prizeBox}>
//             <div className={`${styles.prizeRank} ${styles.rank3}`}>3rd Place</div>
//             <div className={styles.prizeAmount}>0.3 USDm</div>
//           </div>
//         </div>
//         <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>Season: {seasonData ? seasonData.toString() : "-"}</div>
//       </div>

//       <div className={styles.swapCard}>
//         <div className={styles.inputGroup}>
//           <div className={styles.inputHeader}>
//             <span>You Pay</span>
//             <span onClick={handleMaxBalance} className={styles.balanceLink} >
//               Bal: {payBalStr}
//             </span>
//           </div>
//           <div className={styles.inputRow}>
//             <input type="number" className={styles.amountInput} placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isSendingTx || isProcessing || !!callId} />
//             <div className={styles.tokenBadge}>
//                <Image 
//                 src={isCeloToCusd ? "/celo-celo-logo.png" : "/USDm.png"} // 🔥 Provide local path or URL for USDm logo
//                 alt="token" width={18} height={18} unoptimized 
//                />
//                {isCeloToCusd ? "CELO" : "USDm"}
//             </div>
//           </div>
//         </div>

//         <div className={styles.switchWrapper}>
//           <button className={styles.switchBtn} onClick={() => { if (!isSendingTx && !isProcessing && !callId) { setIsCeloToCusd(!isCeloToCusd); setAmount(""); } }}>
//             <ArrowDownUp size={16} />
//           </button>
//         </div>

//         <div className={styles.inputGroup}>
//           <div className={styles.inputHeader}>
//             <span>You Receive</span>
//             <span style={{ fontSize: 12, opacity: 0.6 }}>Bal: {recBalStr}</span>
//           </div>
//           <div className={styles.inputRow}>
//             <input type="text" className={styles.amountInput} placeholder="0.0" value={isFetchingQuote ? "..." : expectedOut} readOnly />
//             <div className={styles.tokenBadge} style={{ background: isCeloToCusd ? "#10b981" : "#2563eb" }}>
//               <Image 
//                 src={!isCeloToCusd ? "/celo-celo-logo.png" : "/USDm.png"} // 🔥 Provide local path or URL for USDm logo
//                 alt="token" width={18} height={18} unoptimized 
//               />
//               {!isCeloToCusd ? "CELO" : "USDm"}
//             </div>
//           </div>
//         </div>

//         <div className={styles.configBox} style={{
//           marginTop: 15,
//           padding: "12px 14px",
//           background: isDarkMode ? "#1f2937" : "#f3f4f6",
//           borderRadius: 10,
//           fontSize: 13,
//           border: "1px solid rgba(255,255,255,0.05)"
//         }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//             <span style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}>Slippage Tolerance</span>
//             <div style={{ display: "flex", gap: 6 }}>
//               {[0.01, 0.05, 0.1].map(v => (
//                 <button 
//                   key={v} 
//                   onClick={() => setSlippagePercent(v)} 
//                   style={{
//                     background: slippagePercent === v ? "#3b82f6" : (isDarkMode ? "#374151" : "#e5e7eb"),
//                     color: slippagePercent === v ? "#fff" : (isDarkMode ? "#d1d5db" : "#374151"),
//                     border: "none",
//                     padding: "4px 8px",
//                     borderRadius: 6,
//                     cursor: "pointer",
//                     fontSize: 12,
//                     fontWeight: slippagePercent === v ? "bold" : "normal",
//                     transition: "all 0.2s"
//                   }}
//                 >
//                   {v}%
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <span style={{ color: isDarkMode ? "#9ca3af" : "#4b5563" }}>LP Fee</span>
//             <span style={{ fontWeight: 600, color: isDarkMode ? "#e5e7eb" : "#111827" }}>{feePercentageString}%</span>
//           </div>
//         </div>

//         <button className={styles.swapBtn} onClick={handleSwap} disabled={isBtnDisabled} style={{ marginTop: 15 }}>
//           {!isConnected ? "Connect Wallet First" : (isSendingTx || isProcessing || !!callId) ? <><Loader2 className="animate-spin" size={20} style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle" }} /> <span style={{ verticalAlign: "middle" }}>Processing...</span></> : "Swap Now"}
//         </button>

//         {txStatus && !isSendingTx && !error && !callId && <div style={{ marginTop: 12, textAlign: "center", color: "#4ade80", fontSize: 13, fontWeight: 600 }}>{txStatus}</div>}
//         {error && <div className={styles.errorMsg} style={{ marginTop: 12, textAlign: "center", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>{error}</div>}
        
//         <div className={styles.myVolume} style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#94a3b8" }}>
//           Your Monthly Volume: <span className={styles.volumeHighlight} style={{ color: "#4ade80", fontWeight: 700, marginLeft: 5 }}>{userVolume} Vol</span>
//         </div>
//       </div>

//       <div className={styles.leaderboard}>
//         <h3 className={styles.leaderboardHeader} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
//           <Trophy color="#fbbf24" size={20} /> Top 20 Swappers
//         </h3>
//         <div className={styles.listContainer} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {topUsers.length > 0 ? topUsers.map((u, i) => {
//             const isMe = address && u.address.toLowerCase() === address?.toLowerCase();
//             return (
//             <div key={u.address} className={`${styles.rankRow} ${i === 0 ? styles.top1Row : i === 1 ? styles.top2Row : i === 2 ? styles.top3Row : ""}`}>
//               <div className={styles.rowLeft} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div className={`${styles.rankNum} ${i === 0 ? styles.rank1 : i === 1 ? styles.rank2 : i === 2 ? styles.rank3 : ""}`}>{i+1}</div>
//                 <Image src={u.pfpUrl} alt="pfp" width={32} height={32} className={styles.pfp} unoptimized />
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <span className={styles.userAddress}>{u.address.slice(0,6)}...{u.address.slice(-4)}</span>
//                   {isMe && <span style={{ fontSize: 10, color: "#4ade80", fontWeight: 700, marginTop: "-2px" }}>(You)</span>}
//                 </div>
//               </div>
//               <div className={styles.rowRight} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//                 <span className={styles.volAmount} style={{ fontWeight: 700, fontSize: 14 }}>{u.vol} Vol</span>
//                 {i === 0 && <span className={`${styles.rewardTag} ${styles.rank1}`} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 3, fontWeight: 600, marginTop: 2, color: "#fbbf24" }}><Award size={10} /> 1 USDm</span>}
//                 {i === 1 && <span className={`${styles.rewardTag} ${styles.rank2}`} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 3, fontWeight: 600, marginTop: 2, color: "#9ca3af" }}><Award size={10} /> 0.5 USDm</span>}
//                 {i === 2 && <span className={`${styles.rewardTag} ${styles.rank3}`} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 3, fontWeight: 600, marginTop: 2, color: "#b45309" }}><Award size={10} /> 0.3 USDm</span>}
//               </div>
//             </div>
//             );
//           }) : <div className={styles.emptyState} style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8", fontSize: 13 }}>No swaps this season yet.</div>}
//         </div>
//       </div>

//       {/* DEBUG CONSOLE UI COMMENTED OUT 
//       <div className={styles.console} style={{ marginTop: 30, marginBottom: 20, backgroundColor: "#000", borderRadius: 8, border: "1px solid #333", padding: 10, color: "#0f0", fontFamily: "monospace", fontSize: 12, maxHeight: 300, overflowY: "auto", wordWrap: "break-word", whiteSpace: "pre-wrap", textAlign: "left" }}>
//         <div className={styles.consoleHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderBottom: "1px solid #333", paddingBottom: 5, color: "#fff", fontWeight: "bold" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
//             <Terminal size={16} /> Debug Console
//           </div>
//           <button 
//             onClick={() => {}} 
//             style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//         {debugLogs.length === 0 ? <div style={{ color: "#666" }}>Waiting for actions...</div> : debugLogs.map((log, i) => <div key={i} className={styles.logLine} style={{ marginBottom: 8, borderBottom: "1px dashed #222", paddingBottom: 5 }}>{log}</div>)}
//       </div>
//       */}
//     </div>
//   );
// }





















