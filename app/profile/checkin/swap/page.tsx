"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
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

// --- 🔵 CACHE HELPERS (To prevent unnecessary Neynar/API requests) ---
// 🔥 ক্যাশ কী 'v2' করা হলো যাতে পুরনো ভুল ক্যাশ বাদ দিয়ে নতুন করে API কল হয়
const CACHE_KEY = "swap_leaderboard_users_v2";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // ৭ দিনের জন্য ক্যাশে সেভ থাকবে

const getLocalCache = () => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return {};
    const { timestamp, data } = JSON.parse(stored);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return {};
    }
    return data || {};
  } catch { return {}; }
};

const saveToLocalCache = (newData: Record<string, any>) => {
  const current = getLocalCache();
  const updated = { ...current, ...newData };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: updated
    }));
  } catch (e) { console.error("Cache full", e); }
};
// ---------------------------------------------------------------------

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

  // --- Profile States ---
  const [userProfiles, setUserProfiles] = useState<Record<string, { displayName: string, pfpUrl: string }>>({});
  const fetchedAddressesRef = useRef<Set<string>>(new Set());

  // 🔥 Farcaster Context for Current User
  const [userData, setUserData] = useState({ displayName: "Guest", pfpUrl: "https://placehold.co/100x100/0052FF/ffffff?text=?" });

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

  const { data: _seasonData } = useReadContract({
    address: CELO_CONTRACT_ADDRESS,
    abi: MINI_ABI,
    functionName: "getCurrentSwapSeason",
    chainId: CELO_CHAIN_ID,
  });

  useEffect(() => {
    setMounted(true);
    // addLog("🟢 App Mounted"); // Commented out
    const loadContext = async () => {
      try {
        await sdk.actions.ready();
        const ctx = await sdk.context;
        if (ctx?.user) {
          setUserData({
            displayName: ctx.user.displayName || ctx.user.username || "User",
            pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100/0052FF/ffffff?text=?",
          });
        }
      } catch (err) { console.error("SDK Context Error:", err); }
    };
    loadContext();
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
      } catch {}

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
        } catch {
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
          } catch {}
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

  // --- 🔵 PROFILE FETCHING LOGIC (API Call only when names are missing from Cache) ---
  useEffect(() => {
    if (topUsers.length === 0) return;

    const cachedData = getLocalCache();
    const newFromCache: Record<string, any> = {};

    const missingAddresses = topUsers
      .map(u => u.address.toLowerCase()) // 🔥 lowercase force korlam ensure korar jonno
      .filter(addr => {
        if (cachedData[addr]) {
          newFromCache[addr] = cachedData[addr];
          return false;
        }
        if (fetchedAddressesRef.current.has(addr)) return false;
        return true;
      });

    if (Object.keys(newFromCache).length > 0) {
      setUserProfiles(prev => ({...prev, ...newFromCache}));
    }

    if (missingAddresses.length === 0) return;

    missingAddresses.forEach(addr => fetchedAddressesRef.current.add(addr));

    const fetchProfiles = async () => {
      try {
        // 🔥 Leaderboard-এর মতো API Endpoint এবং Parameter (addresses=) ব্যবহার করা হয়েছে
        const res = await fetch(`/api/get-profiles?addresses=${missingAddresses.join(',')}`);
        if (res.ok) {
          const profileMap = await res.json();
          const newProfs: Record<string, any> = {};

          // 🔵 Fallback Setup & Data Mapping: API-তে কল কমানোর জন্য ডিফল্ট নাম ও ছবি সেট করা হলো
          missingAddresses.forEach(addr => {
            newProfs[addr] = {
              displayName: profileMap[addr]?.profileName || `${addr.slice(0,6)}...${addr.slice(-4)}`,
              pfpUrl: profileMap[addr]?.pfp || "https://placehold.co/100x100/0052FF/ffffff?text=?"
            };
          });
          
          setUserProfiles(prev => ({...prev, ...newProfs}));
          saveToLocalCache(newProfs); // ক্যাশে সেভ হয়ে যাবে, ফলে বারবার API কল হবে না
        }
      } catch (e) { console.error("Batch fetch error:", e); }
    };
    fetchProfiles();
  }, [topUsers]);
  // ----------------------------------------------------------------------------------

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
            const profile = userProfiles[u.address.toLowerCase()];
            
            // 🔥 Farcaster থেকে ডিরেক্ট নাম ফেস করার লজিক
            let displayName = (isMe && userData.displayName !== "Guest") 
              ? userData.displayName 
              : profile?.displayName || `${u.address.slice(0,6)}...${u.address.slice(-4)}`;
              
            // name boro hole "..." add korar logic
            if (displayName !== `${u.address.slice(0,6)}...${u.address.slice(-4)}` && displayName.length > 17) {
              displayName = displayName.substring(0, 17) + "...";
            }
              
            const pfpUrl = (isMe && userData.pfpUrl !== "https://placehold.co/100x100/0052FF/ffffff?text=?") 
              ? userData.pfpUrl 
              : profile?.pfpUrl || u.pfpUrl;

            return (
            <div key={u.address} className={`${styles.rankRow} ${i === 0 ? styles.top1Row : i === 1 ? styles.top2Row : i === 2 ? styles.top3Row : ""}`}>
              <div className={styles.rowLeft}>
                <div className={`${styles.rankNum} ${i === 0 ? styles.rank1 : i === 1 ? styles.rank2 : i === 2 ? styles.rank3 : ""}`}>{i+1}</div>
                <Image src={pfpUrl} alt="pfp" width={32} height={32} className={styles.pfp} unoptimized />
                <div className={styles.userAddressWrapper}>
                  <span className={styles.userAddress}>{displayName}</span>
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

//#25015425
//#25014254