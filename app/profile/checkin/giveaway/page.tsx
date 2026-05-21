

// //celo mainent network


// "use client";

// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// // import { useReadContract, useSendCalls, useAccount, useConnect } from "wagmi";
// //last farcaster used
// // import { useReadContract, useSendCalls, useAccount, useSwitchChain, useConnect } from "wagmi"; 
// //minipay
// import { useReadContract, useSendCalls, useSendTransaction, useAccount, useSwitchChain, useConnect, usePublicClient } from "wagmi";
// import { formatUnits } from "viem";

// import { CELO_CONTRACT_ADDRESS, ABI } from "@/lib/celo";
// import styles from "./giveaway.module.css";
// import Image from "next/image";
// import { 
//   Moon, Sun, Share2, Users, Trophy, Check, X, Zap, 
//   Loader2, Lock, ShieldCheck, AlertCircle, Sparkles, 
//   History, ChevronDown, ChevronUp, Clock
// } from "lucide-react"; 
// import { sdk } from "@farcaster/miniapp-sdk";

// import { encodeFunctionData, concat } from "viem"; // ডাটা তৈরির জন্য
// import { Attribution } from "ox/erc8021"; // বিল্ডার কোড তৈরির জন্য



// const useMiniPayCompatibility = () => {
//   const [isMiniPay, setIsMiniPay] = useState(false);

//   useEffect(() => {
//     let retry = 0;

//     const detect = () => {
//       if (typeof window === "undefined") return;

//       const eth = (window as any).ethereum;

//       const detected = eth?.isMiniPay === true;

//       if (detected) {
//         setIsMiniPay(true);
//       } else if (retry < 10) {
//         retry++;
//         setTimeout(detect, 300); 
//       }
//     };

//     detect();
//   }, []);

//   return isMiniPay;
// };

// // --- 🔵 CACHE HELPERS (Add this block) ---
// const CACHE_KEY = "leaderboard_users_v1";
// const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // ৭ দিন

// const getLocalCache = () => {
//   if (typeof window === "undefined") return {};
//   try {
//     const stored = localStorage.getItem(CACHE_KEY);
//     if (!stored) return {};
//     const { timestamp, data } = JSON.parse(stored);
//     if (Date.now() - timestamp > CACHE_DURATION) {
//       localStorage.removeItem(CACHE_KEY);
//       return {};
//     }
//     return data || {};
//   } catch { return {}; }
// };

// const saveToLocalCache = (newData: Record<number, any>) => {
//   const current = getLocalCache();
//   const updated = { ...current, ...newData };
//   try {
//     localStorage.setItem(CACHE_KEY, JSON.stringify({
//       timestamp: Date.now(),
//       data: updated
//     }));
//   } catch (e) { console.error("Cache full", e); }
// };
// // ------------------------------------------


// // --- Types ---
// interface WinnerProfile {
//   fid: number;
//   displayName: string;
//   pfpUrl: string;
// }

// // --- SUB-COMPONENT: History Accordion Item ---
// const HistoryAccordionItem = ({ giveawayId }: { giveawayId: number }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [winnersProfiles, setWinnersProfiles] = useState<Record<number, WinnerProfile>>({});
 
  
//   // Ref to track fetched FIDs to avoid infinite loops and linter warnings
//   const fetchedFidsRef = useRef<Set<number>>(new Set());
  
// const { data: details } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(giveawayId)],
//     chainId: 42220, // 👈 Must add this
//   });

//   const { data: currentWinnersFids } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(giveawayId)],
//     chainId: 42220, // 👈 Must add this
//     query: { enabled: isOpen }
//   });
//   const [_tokenAddr, amount, _current, _max, endTime] = (details as any) || [];
  




  
//   // 🔥🔥 Token Logic for History Items 🔥🔥
//   const { decimals, tokenSymbol } = useMemo(() => {
//     // 1. JESSE Token (Only for ID 4)
//     // if (giveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
//     // if (giveawayId === 25) return { decimals: 18, tokenSymbol: "$BETR" };
//     //         if ([26, 28].includes(giveawayId)) { 
//     //     return { decimals: 18, tokenSymbol: "$TOSHI" };
//     // }

//     //             if ([32].includes(giveawayId)) { 
//     //     return { decimals: 18, tokenSymbol: "$ETH" };
//     // }

//     // // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(giveawayId)) { 
//     // //      return { decimals: 18, tokenSymbol: "$DEGEN" };
//     // // }

//     //     if ([1, 2, 3, 5, 6, 7, 9].includes(giveawayId)) { 
//     //     return { decimals: 6, tokenSymbol: "$USDC" };
//     // }

//     return { decimals: 18, tokenSymbol: "$CELO" };
//   }, []);
//   // [giveawayId]);




//   const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
  
//   const formattedEndDate = useMemo(() => {
//     if (!endTime) return "";
//     return new Date(Number(endTime) * 1000).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
//   }, [endTime]);

//   const uniqueWinnersList = useMemo(() => {
//       if(!currentWinnersFids) return [];
//       const list = [...(currentWinnersFids as bigint[])].reverse();
//       const winnerMap = new Map();
//       list.forEach((fidBN) => {
//          const fid = Number(fidBN);
//          winnerMap.set(fid, (winnerMap.get(fid) || 0) + 1);
//       });
//       return Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
//          fid,
//         //  totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
//         totalWinAmount: (rewardAmountRaw * winCount) < 0.001 
//   ? (rewardAmountRaw * winCount).toFixed(6) 
//   : (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2)
//       })).slice(0, 100);
//   }, [currentWinnersFids, rewardAmountRaw, decimals]);

//   // Fetch Profiles
//   // --- HistoryAccordionItem এর জন্য অপ্টিমাইজড useEffect ---
//   useEffect(() => {
//     const fetchProfiles = async () => {
//         if (!isOpen || uniqueWinnersList.length === 0) return;
        
//         const cachedData = getLocalCache();
//         const newFromCache: Record<number, WinnerProfile> = {}; // ⚡ ১. আলাদা অবজেক্টে জমাবো
        
//         // ২. ক্যাশ এবং মিসিং ফিল্টার করা
//         const missingFids = uniqueWinnersList
//             .map(w => w.fid)
//             .filter(fid => {
//                 // যদি ক্যাশে থাকে
//                 if (cachedData[fid] && !winnersProfiles[fid]) {
//                     newFromCache[fid] = cachedData[fid]; // স্টেটে ডিরেক্ট না পাঠিয়ে অবজেক্টে রাখছি
//                     fetchedFidsRef.current.add(fid); 
//                     return false; // ফেচ লিস্ট থেকে বাদ
//                 }
//                 // যদি ক্যাশে না থাকে এবং আগেও ফেচ না করে থাকি
//                 return !fetchedFidsRef.current.has(fid) && !winnersProfiles[fid];
//             });

//         // ⚡ ৩. সব ক্যাশ ডেটা একবারে স্টেটে আপডেট (১ বার রেন্ডার হবে)
//         if (Object.keys(newFromCache).length > 0) {
//             setWinnersProfiles(prev => ({...prev, ...newFromCache}));
//         }
        
//         if (missingFids.length === 0) return;
        
//         // মার্ক করে দিই
//         missingFids.forEach(fid => fetchedFidsRef.current.add(fid));

//         // API Call
//         const chunk = missingFids.slice(0, 50); 
//         try {
//             const res = await fetch(`/api/users?fid=${chunk.join(',')}`);
//             if(res.ok) {
//                 const data = await res.json();
//                 const newProfs: Record<number, WinnerProfile> = {};
//                 data.users?.forEach((u: any) => {
//                     newProfs[u.fid] = { fid: u.fid, displayName: u.displayName || u.username, pfpUrl: u.pfpUrl };
//                 });
                
//                 chunk.forEach(fid => {
//                     if (!newProfs[fid]) newProfs[fid] = { fid, displayName: `User`, pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` };
//                 });

//                 setWinnersProfiles(prev => ({...prev, ...newProfs}));
//                 // 🔥 নতুন ডেটা ক্যাশে সেভ করলাম
//                 saveToLocalCache(newProfs);
//             }
//         } catch (e) { console.error(e); }
//     };
//     fetchProfiles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [uniqueWinnersList, isOpen]);

//   return (
//     <div>
//        {/* HEADER BAR */}
//        <div className={styles.historyHeaderContainer} onClick={() => setIsOpen(!isOpen)}>
//           <div className={styles.historyTitle}>
//              <History size={16} className={styles.titleIcon} /> 
//              <span>Winner History #{giveawayId}</span>
//           </div>
//           <div className={styles.historyStatusBadge}>
//              Ended: {formattedEndDate}
//              {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//           </div>
//        </div>
       
//        {/* LIST */}
//        {isOpen && (
//          <div className={styles.historyListContainer}>
//             {uniqueWinnersList.length > 0 ? (
//                 uniqueWinnersList.map((winner) => {
//                    const profile = winnersProfiles[winner.fid];
//                    const pfp = profile?.pfpUrl || `https://avatar.vercel.sh/${winner.fid}?size=60`;
//                    const name = profile?.displayName || `User ${winner.fid}`;
                   
//                    return (
//                        <div key={winner.fid} className={styles.winnerRow}>
//                           <div className={styles.winnerLeft}>
//                              <div className={styles.pfpWrapper}>
//                                 <Image src={pfp} alt="pfp" width={30} height={30} className={styles.winnerPfp} unoptimized />
//                              </div>
//                              <span className={styles.winnerName} style={{fontSize:'0.8rem'}}>{name}</span>
//                           </div>
//                           <span className={styles.winnerAmount} style={{fontSize:'0.8rem'}}>+{winner.totalWinAmount} {tokenSymbol}</span>
//                        </div>
//                    );
//                 })
//             ) : (
//                 <div className={styles.emptyState} style={{padding:10, fontSize:'0.8rem'}}><p>Loading...</p></div>
//             )}
//          </div>
//        )}
//     </div>
//   );
// };


// // --- MAIN PAGE COMPONENT ---
// export default function GiveawayPage(props: any) { 
//   const _isMiniPay = useMiniPayCompatibility();
//   const passedId = props.giveawayId;
//   const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);
//   const fetchedFidsRef = useRef<Set<number>>(new Set()); // ✅ নতুন লাইন

//   const [isMounted, setIsMounted] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
//   const [isEnded, setIsEnded] = useState(false);
//   const [_isWarpcast, setIsWarpcast] = useState(false);

//   const [showMainList, setShowMainList] = useState(true);
//    const [optimisticCount, setOptimisticCount] = useState<number | null>(null);



//   // Fetch Latest ID
// const { data: latestId } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getLastGiveawayId", 
//     chainId: 42220, // 👈 Must add this
//     query: { enabled: activeGiveawayId === 0 }
//   });



//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       const queryId = params.get("giveawayId");
//       if (passedId) setActiveGiveawayId(passedId);
//       else if (queryId) setActiveGiveawayId(Number(queryId));
//       else if (latestId && activeGiveawayId === 0) setActiveGiveawayId(Number(latestId));
//     }
//   }, [passedId, latestId, activeGiveawayId]);

//   // User Data
//   const [userData, setUserData] = useState({ displayName: "Guest", pfpUrl: "https://placehold.co/100x100/0052FF/ffffff?text=?", fid: 0 });
//   const [hasShared, setHasShared] = useState(false); 
//   const [isVerifying, setIsVerifying] = useState(false); 
//   const [isVerified, setIsVerified] = useState(false); 
//   const [verifyError, setVerifyError] = useState(false); 
//   const [errorTimer, setErrorTimer] = useState(0); 
//   const [farcasterError, setFarcasterError] = useState(""); 
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [lastClaimedAmount, setLastClaimedAmount] = useState("0");
//   const [winnersProfiles, setWinnersProfiles] = useState<Record<number, WinnerProfile>>({});

//   // const { address } = useAccount();
//     // const { address } = useAccount(); // isConnected এখানে লাগবে
//   // const { connectors, connect } = useConnect();
//   // ফারকাস্টার ফ্রেমের কনটেক্সট থেকে অ্যাড্রেস নেওয়ার চেষ্টা করুন
// // const address = context?.user?.address || context?.user?.custodyAddress;

// const { address, chain, isConnected } = useAccount(); 
//   const { switchChainAsync } = useSwitchChain();
//   const { connect, connectors } = useConnect(); 

// //last farcaster used
// // const { sendCallsAsync, isPending: isClaiming } = useSendCalls();

// //minipay
// const { sendCallsAsync, isPending: isClaimingCalls } = useSendCalls();
// const { sendTransactionAsync, isPending: isClaimingTx } = useSendTransaction();
// const publicClient = usePublicClient(); // <-- Added for blockchain confirmation
// const [isWaitingForTx, setIsWaitingForTx] = useState(false); // <-- Added state

// // বাটন ডিজেবল করার জন্য দুটির যেকোনো একটি Pending থাকলেই লোডিং দেখাবে, এবং ট্রানজেকশন কনফার্ম হওয়ার জন্য ওয়েট করবে
// const isClaiming = isClaimingCalls || isClaimingTx || isWaitingForTx;


//   // Contract Reads (Active ID)
//   const isValidId = activeGiveawayId > 0;
//   const { data: details, refetch: refetchDetails } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(activeGiveawayId)],
//     chainId: 42220, // 👈 Must add this
//     query: { enabled: isValidId }
//   });

//   const { data: userStats, refetch: refetchStats } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getUserStats",
//     args: [BigInt(activeGiveawayId), address as `0x${string}`],
//     chainId: 42220, // 👈 Must add this
//     query: { enabled: isValidId && !!address } 
//   });

//   const { data: currentWinnersFids, refetch: refetchWinners } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(activeGiveawayId)],
//     chainId: 42220, // 👈 Must add this
//     query: { enabled: isValidId }
//   });

//   // 🔥 NEW: Contract থেকে বর্তমান Claim Fee রিড করা
//   const { data: claimFeeRaw } = useReadContract({
//     address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//     abi: ABI,
//     functionName: "getClaimFee",
//     chainId: 42220, // 👈 Must add this
//   });
  
//   // Fee টাকে BigInt হিসেবে সেভ করে রাখা (যাতে 0 সেট থাকলেও কাজ করে)
//   const currentClaimFee = claimFeeRaw ? (claimFeeRaw as bigint) : 0n;

//   const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
//   const [totalWon, claimCount, _currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
//   const realCount = Number(claimCount || 0);
//   const count = optimisticCount !== null ? optimisticCount : realCount;
//   const limit = Number(_currentLimit || 2);   //share logic 1 to 2
//   const isFull = Number(current || 0) >= Number(max || 0);
//   const isActiveGiveaway = active && !isEnded && !isFull;
  


//   //   useEffect(() => {
//   //   if (!isConnected && connectors.length > 0) {
//   //     const connector = connectors[0];
//   //     connect({ connector });
//   //   }
//   // }, [isConnected, connectors, connect]);


// // 🔴 Wagmi Auto Silent Connect for Warpcast
//   useEffect(() => {
//     if (!isConnected && connectors.length > 0) {
//       const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
//       connect({ connector: injectedConnector });
//     }
//   }, [isConnected, connectors, connect]);


//   // 🔥🔥 FIX: Token Symbol & Decimals for MAIN Card 🔥🔥
// const { decimals, tokenSymbol } = useMemo(() => {
//     // পুরোনো বেস নেটওয়ার্কের টোকেন লজিক কমেন্ট করে দেওয়া হলো
//     /*
//     if (activeGiveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
//     if (activeGiveawayId === 25) return { decimals: 18, tokenSymbol: "$BETR" };
//     if ([26, 28].includes(activeGiveawayId)) { 
//         return { decimals: 18, tokenSymbol: "$TOSHI" };
//     }
//     if ([32].includes(activeGiveawayId)) { 
//         return { decimals: 18, tokenSymbol: "$ETH" };
//     }
//     if ([1, 2, 3, 5, 6, 7, 9].includes(activeGiveawayId)) { 
//         return { decimals: 6, tokenSymbol: "$USDC" };
//     }
//     */

//     // সেলো নেটওয়ার্কের ডিফল্ট টোকেন রিটার্ন
//     return { decimals: 18, tokenSymbol: "$CELO" };
//   }, []);
//   // [activeGiveawayId]);





//   const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
//   // const rewardAmountFormatted = decimals === 6 ? rewardAmountRaw.toString() : rewardAmountRaw.toFixed(3);
//   const rewardAmountFormatted = decimals === 6 
//   ? rewardAmountRaw.toString() 
//   : (rewardAmountRaw < 0.001 ? rewardAmountRaw.toFixed(6) : rewardAmountRaw.toFixed(3));
//   const totalWonFormatted = formatUnits(totalWon || 0n, decimals);

//   const formattedEndDate = useMemo(() => {
//     if (!endTime) return "";
//     return new Date(Number(endTime) * 1000).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
//   }, [endTime]);

//   const displayedListRaw = useMemo(() => {
//     return currentWinnersFids ? [...(currentWinnersFids as bigint[])].reverse() : [];
//   }, [currentWinnersFids]);

//   const uniqueWinnersList = useMemo(() => {
//       const winnerMap = new Map();
//       displayedListRaw.forEach((fidBN) => {
//          const fid = Number(fidBN);
//          winnerMap.set(fid, (winnerMap.get(fid) || 0) + 1);
//       });
//       return Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
//          fid,
//         //  totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
//         totalWinAmount: (rewardAmountRaw * winCount) < 0.001 
//   ? (rewardAmountRaw * winCount).toFixed(6) 
//   : (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2)
//       })).slice(0, 100);
//   }, [displayedListRaw, rewardAmountRaw, decimals]);

//   // const isFarcasterUser = userData.fid > 0;

//   // History List IDs (Previous 3 IDs from current)
//   const previousHistoryIds = useMemo(() => {
//     if (!activeGiveawayId) return [];
    
//     const currentId = Number(activeGiveawayId);
//     const ids = [];
//     for (let i = 1; i <= 2; i++) {
//         const pid = currentId - i;
//         if (pid > 0) ids.push(pid);
//     }
//     return ids;
//   }, [activeGiveawayId]);

//   useEffect(() => {
//     setIsMounted(true);
//     sdk.actions.ready(); 
//     if (document.body.classList.contains('light-mode')) setIsDarkMode(false);
//     if (typeof navigator !== "undefined") setIsWarpcast(/Warpcast/i.test(navigator.userAgent));
//     const loadContext = async () => {
//       try {
//         const ctx = await sdk.context;
//         if (ctx?.user) {
//           setUserData({
//             displayName: ctx.user.displayName || ctx.user.username || "User",
//             pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100/0052FF/ffffff?text=?",
//             fid: ctx.user.fid || 0
//           });
//         }
//       } catch (err) { console.error("SDK Context Error:", err); }
//     };
//     loadContext();
//   }, [activeGiveawayId, address]);

// // --- 🔵 UPDATED FETCH PROFILES (Replace old function) ---
//   const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
//     if (winners.length === 0) return;

//     // ১. প্রথমে লোকাল ক্যাশ থেকে ডেটা লোড করি
//     const cachedData = getLocalCache();
//     const newFromCache: Record<number, WinnerProfile> = {};
//     let hasCacheHit = false;

//     // ২. চেক করি কার ডেটা ক্যাশে আছে
//     const missingFids = winners
//       .map(w => w.fid)
//       .filter(fid => {
//         // যদি নিজের প্রোফাইল হয় অথবা ইতিমধ্যে ক্যাশে থাকে
//         if (cachedData[fid]) {
//           newFromCache[fid] = cachedData[fid];
//           fetchedFidsRef.current.add(fid); // মার্ক করে দিলাম যাতে আর ফেচ না হয়
//           hasCacheHit = true;
//           return false; // লিস্ট থেকে বাদ (ফেচ করার দরকার নেই)
//         }
//         // যদি আগেও একবার ফেচ করে থাকি (Ref চেক)
//         if (fetchedFidsRef.current.has(fid)) return false;
        
//         return fid !== userData.fid;
//       });

//     // ৩. যদি ক্যাশে কিছু পাওয়া যায়, স্টেটে সেট করে দিই
//     if (hasCacheHit) {
//       setWinnersProfiles(prev => ({ ...prev, ...newFromCache }));
//     }

//     // ৪. যদি সব ক্যাশে পাওয়া যায়, তাহলে আর নিচে যাওয়ার দরকার নেই
//     if (missingFids.length === 0) return;

//     // ৫. বাকিগুলো ফেচ করি (API Call)
//     missingFids.forEach(fid => fetchedFidsRef.current.add(fid));
    
//     const BATCH_SIZE = 50;
//     const chunks = [];
//     for (let i = 0; i < missingFids.length; i += BATCH_SIZE) {
//         chunks.push(missingFids.slice(i, i + BATCH_SIZE));
//     }

//     for (const chunk of chunks) {
//         try {
//             const response = await fetch(`/api/users?fid=${chunk.join(',')}`);
//             if (response.ok) {
//                 const data = await response.json();
//                 const newFetchedData: Record<number, WinnerProfile> = {};
                
//                 if (data.users && Array.isArray(data.users)) {
//                     data.users.forEach((user: any) => {
//                         newFetchedData[user.fid] = { 
//                             fid: user.fid, 
//                             displayName: user.displayName || user.username || "User", 
//                             pfpUrl: user.pfpUrl 
//                         };
//                     });
//                 }
                
//                 // ডিফল্ট ভ্যালু (যদি API নাম না দেয়)
//                 chunk.forEach(fid => {
//                     if (!newFetchedData[fid]) {
//                         newFetchedData[fid] = { 
//                             fid, 
//                             displayName: `User`, 
//                             pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
//                         };
//                     }
//                 });

//                 // ✅ State আপডেট + Cache সেভ
//                 setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
//                 saveToLocalCache(newFetchedData); // ক্যাশে সেভ করে রাখলাম
//             }
//         } catch (error) { 
//             console.error("Batch fetch error:", error); 
//         }
//     }
//   }, [userData.fid]);

//   useEffect(() => {
//     if (uniqueWinnersList.length > 0) fetchProfiles(uniqueWinnersList);
//   }, [uniqueWinnersList, fetchProfiles]);

//   useEffect(() => {
//     if (errorTimer > 0) {
//       const timerId = setInterval(() => setErrorTimer((p) => p - 1), 1000);
//       return () => clearInterval(timerId);
//     } else if (errorTimer === 0 && verifyError) {
//       setVerifyError(false);
//       setIsVerifying(false);
//       setHasShared(true); 
//     }
//   }, [errorTimer, verifyError, activeGiveawayId, address]);

//   useEffect(() => {
//     if (endTime) {
//       const endTimeNum = Number(endTime); 
//       const initialNow = Math.floor(Date.now() / 1000);
//       if (initialNow >= endTimeNum) {
//           setIsEnded(true);
//           setTimeLeft({ hours: 0, mins: 0, secs: 0 });
//       }
//       const timer = setInterval(() => {
//         const now = Math.floor(Date.now() / 1000);
//         const distance = endTimeNum - now;  
//         if (distance <= 0) {
//            setIsEnded(true);
//            setTimeLeft({ hours: 0, mins: 0, secs: 0 });
//            clearInterval(timer);
//         } else {
//            setIsEnded(false);
//            setTimeLeft({
//              hours: Math.floor(distance / 3600),
//              mins: Math.floor((distance % 3600) / 60),
//              secs: distance % 60
//            });
//         }
//         }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [endTime]);

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.classList.toggle('light-mode');
//   };

//   // const handleShare = () => {
//   //  const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
//   //  const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//   //  const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
//   //  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
//   //  try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
//   //  setHasShared(true);
//   //  setShowSuccessModal(false);
//   // };


// const handleShare = () => {
//   if (!userData.fid) return;

//   const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
//   const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//   const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
  
//   // Warpcast intent URL
//   const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;

//   // Base app ba Warpcast-er SDK environment check
//   const isFarcasterEnv = /warpcast|farcaster/i.test(navigator.userAgent);

//   try {
//     // Jodi frame-er bhitor thake (Warpcast ba Base app)
//     if (isFarcasterEnv) {
//       sdk.actions.openUrl(castIntentUrl);
//     } else {
//       // Normal browser hole
//       window.open(castIntentUrl, "_blank");
//     }
//   } catch (error) {
//     console.error("SDK Share error:", error);
//     // SDK fail korle manual window open
//     window.open(castIntentUrl, "_blank");
//   }

//   setHasShared(true);
//   setShowSuccessModal(false);
// };









//   const handleVerify = async () => {
//     if (!userData.fid) return;
//     setIsVerifying(true);
//     setVerifyError(false);
//     try {
//       const response = await fetch(`/api/verify-share?fid=${userData.fid}`);
//       const data = await response.json();
//       if (data.success) { setIsVerified(true); setIsVerifying(false); } else { setVerifyError(true); setErrorTimer(5); }
//     } catch { setVerifyError(true); setErrorTimer(5); }
//   };



// //last used for farcaster. 

// // const onClaim = async () => {
// //       // if (!isWarpcast || !isFarcasterUser) { 
// //   //   setFarcasterError("Open in Warpcast App"); 
// //   //   return; 
// //   // }
  
// //   // setFarcasterError("");

  
// //   try {
// //     if (chain?.id !== 42220) {
// //       await switchChainAsync({ chainId: 42220 });
// //     }

// //     const walletAddress = 
// //       address || 
// //       (userData as any)?.verified_addresses?.eth_addresses?.[0] || 
// //       (userData as any)?.custody_address ||
// //       (userData as any)?.address;

// //     const userFid = userData?.fid;
// //     const giveawayId = activeGiveawayId;

// //     if (!walletAddress) {
// //       setFarcasterError("Wallet not found. Please connect your wallet.");
// //       return;
// //     }

// //     if (!userFid || !giveawayId) {
// //       setFarcasterError("Missing user identity or Giveaway ID");
// //       return;
// //     }

// //     // ১. ব্যাকএন্ড থেকে Signature এবং Nonce সংগ্রহ করা
// //     const signResponse = await fetch('/api/sign-claim', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ 
// //         userWallet: walletAddress, 
// //         fid: Number(userFid), 
// //         giveawayId: Number(giveawayId), 
// //         isMiniPay: _isMiniPay
// //       }),
// //     });

// //     const signData = await signResponse.json();

// //     if (!signResponse.ok || !signData.signature || signData.nonce === undefined) {
// //       throw new Error(signData.message || "Failed to get signature/nonce");
// //     }

// //     // ২. 🔥 ফাংশন ডাটা এনকোড করা (নতুন আর্গুমেন্ট অর্ডারসহ) 🔥
// //     // অর্ডার: _id, _fid, _nonce, _signature
// //     const functionData = encodeFunctionData({
// //       abi: ABI,
// //       functionName: "claimGiveaway",
// //       args: [ 
// //         BigInt(giveawayId), 
// //         BigInt(userFid), 
// //         BigInt(signData.nonce), // 🔥 নতুন প্যারামিটার Nonce যোগ করা হয়েছে
// //         signData.signature as `0x${string}` 
// //       ],
// //     });

// //     // ৩. বিল্ডার কোড সাফিক্স তৈরি
// //     const builderSuffix = Attribution.toDataSuffix({
// //       codes: ["bc_bmhx0p43"], 
// //     });

// //     // ৪. ডাটা জোড়া লাগানো (Concatenation)
// //     const finalData = concat([functionData, builderSuffix]);

// //     // ৫. sendCallsAsync দিয়ে ট্রানজেকশন পাঠানো
// //     const id = await sendCallsAsync({
// //       calls: [
// //         {
// //           to: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
// //           data: finalData,
// //           value: currentClaimFee,
// //         },
// //       ],
// //       // chainId: 42220, 
// //     });

// //     // ৬. সাকসেস হ্যান্ডলিং
// //     if (id) {
// //       setOptimisticCount(realCount + 1);
// //       setLastClaimedAmount(rewardAmountFormatted); 
// //       setShowSuccessModal(true);
// //       setTimeout(() => { 
// //         refetchDetails(); 
// //         refetchStats(); 
// //         refetchWinners(); 
// //       }, 5000);
// //     }

// //   } catch (error: any) {
// //     console.error("Claim Error:", error);
    
// //     // নির্দিষ্ট এরর মেসেজ হ্যান্ডলিং (যেমন: Identity Check ফেইল করলে)
// //     if (error.message?.includes("Personal ID Mint Required")) {
// //         setFarcasterError("You must mint a Personal ID to claim this giveaway!");
// //     } else if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
// //         setFarcasterError("Transaction cancelled by user");
// //     } else {
// //         setFarcasterError(error.message || "Transaction failed. Try again.");
// //     }
// //     setTimeout(() => setFarcasterError(""), 5000);
// //   }
// // };







// //minipay:
// const onClaim = async () => {
//   try {
//     if (chain?.id !== 42220) {
//       await switchChainAsync({ chainId: 42220 });
//     }

//     const walletAddress = 
//       address || 
//       (userData as any)?.verified_addresses?.eth_addresses?.[0] || 
//       (userData as any)?.custody_address ||
//       (userData as any)?.address;

//     // FID 0 ধরে নিব যদি না থাকে
//     const userFid = userData?.fid || 0; 
//     const giveawayId = activeGiveawayId;

//     if (!walletAddress) {
//       setFarcasterError("Wallet not found. Please connect your wallet.");
//       return;
//     }

//     // 🔥 ফিক্স: যদি MiniPay না হয় এবং FID না থাকে, তবেই শুধু এরর দিবে
//     if (!giveawayId || (!_isMiniPay && !userFid)) {
//       setFarcasterError("Missing user identity or Giveaway ID");
//       return;
//     }

//     // ১. ব্যাকএন্ড থেকে Signature এবং Nonce সংগ্রহ করা
//     const signResponse = await fetch('/api/sign-claim', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         userWallet: walletAddress, 
//         fid: Number(userFid), 
//         giveawayId: Number(giveawayId), 
//         isMiniPay: _isMiniPay 
//       }),
//     });

//     const signData = await signResponse.json();

//     if (!signResponse.ok || !signData.signature || signData.nonce === undefined) {
//       throw new Error(signData.message || "Failed to get signature/nonce");
//     }

//     const functionData = encodeFunctionData({
//       abi: ABI,
//       functionName: "claimGiveaway",
//       args: [ 
//         BigInt(giveawayId), 
//         BigInt(userFid), 
//         BigInt(signData.nonce), 
//         signData.signature as `0x${string}` 
//       ],
//     });

//     const builderSuffix = Attribution.toDataSuffix({
//       codes: ["bc_bmhx0p43"], 
//     });

//     const finalData = concat([functionData, builderSuffix]);

//     let txId;
    
//     if (_isMiniPay) {
//       // MiniPay-এর জন্য স্ট্যান্ডার্ড ট্রানজেকশন
//       txId = await sendTransactionAsync({
//         to: CELO_CONTRACT_ADDRESS as `0x${string}`,
//         data: finalData,
//         value: currentClaimFee,
//       });
//     } else {
//       // Farcaster-এর জন্য Batched (SendCalls) ট্রানজেকশন
//       txId = await sendCallsAsync({
//         calls: [
//           {
//             to: CELO_CONTRACT_ADDRESS as `0x${string}`, 
//             data: finalData,
//             value: currentClaimFee,
//           },
//         ],
//       });
//     }

//     // ৬. সাকসেস হ্যান্ডলিং (ট্রানজেকশন কনফার্ম হওয়ার জন্য অপেক্ষা করা)
//     if (txId) {
//       setIsWaitingForTx(true); // লোডিং "Sending..." চালু থাকবে
//       let txSuccess = true;
//       try {
//         if (publicClient && typeof txId === 'string' && txId.startsWith('0x')) {
//           const receipt = await publicClient.waitForTransactionReceipt({ 
//             hash: txId as `0x${string}` 
//           });
//           if (receipt.status === 'reverted') {
//             txSuccess = false;
//             throw new Error("Transaction reverted on chain");
//           }
//         } else {
//           // Farcaster sendCalls ID-এর জন্য ফলব্যাক ওয়েট
//           await new Promise(resolve => setTimeout(resolve, 5000));
//         }
//       } catch (receiptError) {
//         console.error("Receipt error:", receiptError);
//         setIsWaitingForTx(false);
//         throw receiptError; // Outer catch block will handle and show error
//       }

//       setIsWaitingForTx(false);

//       if (txSuccess) {
//         setOptimisticCount(realCount + 1);
//         setLastClaimedAmount(rewardAmountFormatted); 
        
//         // ডেটা রিফেচ
//         refetchDetails(); 
//         refetchStats(); 
//         refetchWinners(); 
        
//         // কনফার্ম হওয়ার পর পপআপ শো করবে
//         setShowSuccessModal(true);
//       }
//     }

//   } catch (error: any) {
//     console.error("Claim Error:", error);
    
//     if (error.message?.includes("Personal ID Mint Required")) {
//         setFarcasterError("You must mint a Personal ID to claim this giveaway!");
//     } else if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
//         setFarcasterError("Transaction cancelled by user");
//     } else {
//         setFarcasterError(error.message || "Transaction failed. Try again.");
//     }
//     setTimeout(() => setFarcasterError(""), 5000);
//   }
// };



// useEffect(() => {
//   if (optimisticCount !== null && realCount >= optimisticCount) {
//     setOptimisticCount(null);
//   }
// }, [realCount, optimisticCount]);

//   if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

  

//   // const renderActionButton = () => {
//   //   // if (!isWarpcast || !isFarcasterUser) {
//   //   //    return (
//   //   //      <button className={styles.primaryBtn} disabled={true} style={{ opacity: 0.5, cursor: "not-allowed", backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444", pointerEvents: "none" }}>
//   //   //        Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
//   //   //      </button>
//   //   //    );
//   //   // }
//   //   if (count === 0) {
//   //     return (
//   //       <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//   //         {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//   //         {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//   //       </button>
//   //     );
//   //   }
//   //   if (count === 1 && count < limit) {
//   //     if (!hasShared && !isVerified) {
//   //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock +1 <Share2 size={16} /></button>;
//   //     }
//   //     if (hasShared && !isVerified) {
//   //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
//   //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//   //     }
//   //     if (isVerified) {
//   //       return <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>{isClaiming ? "Sending..." : "Claim Bonus"}{!isClaiming && <Zap size={16} fill="currentColor" />}</button>;
//   //     }
//   //   }
//   //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
//   // };




// //useable for farcaster
//   // const renderActionButton = () => {
//   //   // --- প্রথম ক্লেইমের আগে শেয়ার এবং ভেরিফাই ---
//   //   if (count === 0) {
//   //     if (!hasShared && !isVerified) {
//   //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Claim <Share2 size={16} /></button>;
//   //     }
//   //     if (hasShared && !isVerified) {
//   //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
//   //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//   //     }
//   //     if (isVerified) {
//   //       return (
//   //         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//   //           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//   //           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//   //         </button>
//   //       );
//   //     }
//   //   }

//   //   // --- ১ বার ক্লেইম হয়ে গেলেই সরাসরি Completed দেখাবে ---
//   //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
//   // };



// // last used minipay
//   // const renderActionButton = () => {
//   //   // --- প্রথম ক্লেইমের আগে শেয়ার এবং ভেরিফাই ---
//   //   if (count === 0) {
      
//   //     // 🔥 MiniPay ইউজারদের জন্য ডিরেক্ট Claim (Share Bypass)
//   //     // অথবা যদি ফারকাস্টার ইউজার ইতিমধ্যে ভেরিফাই করে থাকে
//   //     if (_isMiniPay || isVerified) {
//   //       return (
//   //         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//   //           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//   //           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//   //         </button>
//   //       );
//   //     }

//   //     // 🔥 ফারকাস্টার ইউজারদের জন্য Share Logic
//   //     if (!hasShared && !isVerified) {
//   //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Claim <Share2 size={16} /></button>;
//   //     }
      
//   //     if (hasShared && !isVerified) {
//   //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
//   //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//   //     }
//   //   }

//   //   // --- ১ বার ক্লেইম হয়ে গেলেই সরাসরি Completed দেখাবে ---
//   //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
//   // };


//   const renderActionButton = () => {
    
//     if (count === 0) {
//       return (
//         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//         </button>
//       );
//     }

   
//     if (count === 1 && count < limit) {
      
//       if (_isMiniPay || isVerified) {
//         return (
//           <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>
//             {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Bonus"}
//             {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//           </button>
//         );
//       }

      
//       if (!hasShared && !isVerified) {
//         return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16} /></button>;
//       }
      
//       if (hasShared && !isVerified) {
//          if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
//          return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//       }
//     }

//     return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
//   };
  

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       <nav className={styles.topBar}>
//         <div className={styles.userInfoSmall}>
//            <div className={styles.avatarMini}><Image src={userData.pfpUrl} alt="pfp" width={34} height={34} className={styles.pfpRound} unoptimized /></div>
//            <div className={styles.userInfo}><span className={styles.username}>{userData.displayName}</span></div>
//         </div>
//         <button className={styles.themeBtn} onClick={toggleTheme}>{isDarkMode ? <Moon size={18} /> : <Sun size={18} />}</button>
//       </nav>

//       <main className={styles.main}>
//         {isActiveGiveaway ? (
//             <div className={styles.giveawayCard}>
//               <div className={styles.liveTag}><span className={styles.pulseDot}></span> LIVE DROP</div>
//               <h2 className={styles.cardTitle}>EXCLUSIVE MINI DROP #{activeGiveawayId}</h2>
//               <div className={styles.timerWrapper}>
//                  <div className={styles.timerDigit}>{String(timeLeft.hours).padStart(2, '0')}</div><span className={styles.timerSep}>:</span>
//                  <div className={styles.timerDigit}>{String(timeLeft.mins).padStart(2, '0')}</div><span className={styles.timerSep}>:</span>
//                  <div className={styles.timerDigit}>{String(timeLeft.secs).padStart(2, '0')}</div>
//               </div>
//               <p className={styles.cardSubtitle}>Ends soon! Claim before it's gone.</p>
//             </div>
//         ) : (
//             <div className={`${styles.giveawayCard} ${styles.inactiveCard}`}>
//                <div className={styles.endedIconWrapper}>{isFull ? <Users size={24} /> : <Clock size={24} />}</div>
//                <div className={`${styles.statusBadge} ${isFull ? styles.soldOutTag : styles.endedTag}`}>{isFull ? "ALL CLAIMED" : "TIME EXPIRED"}</div>
//                <h2 className={styles.cardTitle}>AIRDROP ENDED #{activeGiveawayId}</h2>
//                <p className={styles.cardSubtitle}>This event is closed. See the winner list below. <br/> Please Wait for the next airdrop live soon.</p>
//             </div>
//         )}

//         <div className={styles.statsGrid}>
//           <div className={styles.statBox}>
//             <Users size={16} className={styles.statIcon} />
//             <div className={styles.statContent}>
//                 <span className={styles.statLabel}>{isActiveGiveaway ? "Claimed" : "Total Winners"}</span>
//                 <span className={styles.statValue}>{Number(current || 0)} <span className={styles.statTotal}>/ {Number(max || 0)}</span></span>
//             </div>
//           </div>
//           <div className={styles.statBox}>
//             <Trophy size={16} className={styles.statIcon} />
//             <div className={styles.statContent}>
//                 <span className={styles.statLabel}>Airdrop Amount</span>
//                 <span className={styles.statValue}>{rewardAmountFormatted} {tokenSymbol}</span>
//             </div>
//           </div>
//         </div>

//         {isActiveGiveaway && (
//             <div className={styles.actionZone}>
//               <div className={styles.balanceHeader}>
//                 <span className={styles.totalLabel}>Total Earnings</span>
//                 <span className={styles.statValue}>{totalWonFormatted} {tokenSymbol}</span>
//               </div>

          
//               <div className={styles.progressTrack}>
//                  <div className={`${styles.step} ${count > 0 ? styles.stepActive : ''}`}>1</div>
//                  <div className={`${styles.trackLine} ${count > 0 ? styles.lineActive : ''}`}></div>
//                  <div className={`${styles.step} ${count > 1 ? styles.stepActive : ''}`}>2</div>
//               </div>


//               {/* <div className={styles.progressTrack}>
//    <div className={`${styles.step} ${styles.stepActive}`}>1</div>
//    <div className={`${styles.trackLine} ${count > 0 ? styles.lineActive : ''}`}></div>
//    <div className={`${styles.step} ${count > 0 ? styles.stepActive : ''}`}>
//       {count > 0 ? <Check size={16} /> : <Lock size={16} />}
//    </div>
// </div> */}
//               <div className={styles.btnWrapper}>{renderActionButton()}</div>
//               {farcasterError && <p className={styles.errorText}><AlertCircle size={12} style={{marginRight:4}}/> {farcasterError}</p>}
//             </div>
//         )}

//         {/* --- MAIN CURRENT EVENT LIST (Collapsible Header) --- */}
//         <div className={styles.leaderboardSection}>
//           <div className={styles.historyHeaderContainer} onClick={() => setShowMainList(!showMainList)}>
//              <div className={styles.historyTitle}>
//                 {isActiveGiveaway ? <Sparkles size={16} className={styles.titleIcon}/> : <History size={16} className={styles.titleIcon}/>} 
//                 {isActiveGiveaway ? "Recent Winners" : `Recent History #${activeGiveawayId}`}
//              </div>
             
//              <div className={styles.historyStatusBadge}>
//                 {isActiveGiveaway ? "Live" : `Ended: ${formattedEndDate}`}
//                 {showMainList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//              </div>
//           </div>

//           {showMainList && (
//              <div className={styles.historyListContainer}>
//                {uniqueWinnersList.length > 0 ? (
//                  uniqueWinnersList.map((winner, idx) => {
//                    const { fid, totalWinAmount } = winner;
//                    const isMe = fid === userData.fid && userData.fid !== 0;
//                    const profile = winnersProfiles[fid];
//                    const displayName = (isMe && userData.displayName !== "Guest") ? userData.displayName : (profile?.displayName || `User`);
//                    const pfpUrl = (isMe && userData.pfpUrl.includes("http")) ? userData.pfpUrl : (profile?.pfpUrl || `https://avatar.vercel.sh/${fid}?size=60`);

//                    return (
//                      <div key={fid} className={`${styles.winnerRow} ${isMe ? styles.myRow : ''}`} style={{animationDelay: `${idx * 0.05}s`}}>
//                        <div className={styles.winnerLeft}>
//                           <div className={styles.pfpWrapper}>
//                              <Image src={pfpUrl} alt="pfp" width={34} height={34} className={styles.winnerPfp} unoptimized />
//                              <div className={styles.rankBadge}>{idx + 1}</div>
//                           </div>
//                           <div className={styles.winnerInfo}>
//                               <span className={styles.winnerName}>{displayName}</span>
//                               {isMe && <span className={styles.meBadge}>YOU</span>}
//                           </div>
//                        </div>
//                        <span className={styles.winnerAmount}>+{totalWinAmount} {tokenSymbol}</span>
//                      </div>
//                    );
//                  })
//                ) : (
//                  <div className={styles.emptyState}><div className={styles.emptyIcon}>👻</div><p>No winners yet.</p></div>
//                )}
//              </div>
//           )}
//         </div>

        
//         {/* !isActiveGiveaway &&  */}
//         {previousHistoryIds.length > 0 && (
//            <div style={{ marginTop: 10 }}>
//               {previousHistoryIds.map((id) => (
//                  <HistoryAccordionItem key={id} giveawayId={id} />
//               ))}
//            </div>
//         )}

//       </main>
//       {showSuccessModal && (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <button className={styles.close} onClick={() => setShowSuccessModal(false)}><X size={18}/></button>
//             <div className={styles.successIcon}><Check size={28} strokeWidth={4} /></div>
//             <h3 className={styles.modalTitle}>Success!</h3>
//             <p className={styles.modalText}>You received <span className={styles.gradientText}>{lastClaimedAmount} {tokenSymbol}</span></p>
//             {/* {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>} */}
//             {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// //id: 201254































//celo mainent network






"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useReadContract, useSendCalls, useAccount, useConnect } from "wagmi";
//last farcaster used
// import { useReadContract, useSendCalls, useAccount, useSwitchChain, useConnect } from "wagmi"; 
//minipay
import { useReadContract, useSendCalls, useSendTransaction, useAccount, useSwitchChain, useConnect } from "wagmi";
import { formatUnits } from "viem";

import { CELO_CONTRACT_ADDRESS, ABI } from "@/lib/celo";
import styles from "./giveaway.module.css";
import Image from "next/image";
import { 
  Moon, Sun, Share2, Users, Trophy, Check, X, Zap, 
  Loader2, Lock, ShieldCheck, AlertCircle, Sparkles, 
  History, ChevronDown, ChevronUp, Clock
} from "lucide-react"; 
import { sdk } from "@farcaster/miniapp-sdk";

import { encodeFunctionData, concat } from "viem"; // ডাটা তৈরির জন্য
import { Attribution } from "ox/erc8021"; // বিল্ডার কোড তৈরির জন্য



const useMiniPayCompatibility = () => {
  const [isMiniPay, setIsMiniPay] = useState(false);

  useEffect(() => {
    let retry = 0;

    const detect = () => {
      if (typeof window === "undefined") return;

      const eth = (window as any).ethereum;

      const detected = eth?.isMiniPay === true;

      if (detected) {
        setIsMiniPay(true);
      } else if (retry < 10) {
        retry++;
        setTimeout(detect, 300); 
      }
    };

    detect();
  }, []);

  return isMiniPay;
};

// --- 🔵 CACHE HELPERS (Add this block) ---
const CACHE_KEY = "leaderboard_users_v1";
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // ৭ দিন

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

const saveToLocalCache = (newData: Record<number, any>) => {
  const current = getLocalCache();
  const updated = { ...current, ...newData };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: updated
    }));
  } catch (e) { console.error("Cache full", e); }
};
// ------------------------------------------


// --- Types ---
interface WinnerProfile {
  fid: number;
  displayName: string;
  pfpUrl: string;
}

// --- SUB-COMPONENT: History Accordion Item ---
const HistoryAccordionItem = ({ giveawayId }: { giveawayId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [winnersProfiles, setWinnersProfiles] = useState<Record<number, WinnerProfile>>({});
 
  
  // Ref to track fetched FIDs to avoid infinite loops and linter warnings
  const fetchedFidsRef = useRef<Set<number>>(new Set());
  
const { data: details } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getGiveawayDetails",
    args: [BigInt(giveawayId)],
    chainId: 42220, // 👈 Must add this
  });

  const { data: currentWinnersFids } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getWinnersFIDs",
    args: [BigInt(giveawayId)],
    chainId: 42220, // 👈 Must add this
    query: { enabled: isOpen }
  });
  const [_tokenAddr, amount, _current, _max, endTime] = (details as any) || [];
  




  
  // 🔥🔥 Token Logic for History Items 🔥🔥
  const { decimals, tokenSymbol } = useMemo(() => {
    // 1. JESSE Token (Only for ID 4)
    // if (giveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
    // if (giveawayId === 25) return { decimals: 18, tokenSymbol: "$BETR" };
    //         if ([26, 28].includes(giveawayId)) { 
    //     return { decimals: 18, tokenSymbol: "$TOSHI" };
    // }

    //             if ([32].includes(giveawayId)) { 
    //     return { decimals: 18, tokenSymbol: "$ETH" };
    // }

    // // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(giveawayId)) { 
    // //      return { decimals: 18, tokenSymbol: "$DEGEN" };
    // // }

    //     if ([1, 2, 3, 5, 6, 7, 9].includes(giveawayId)) { 
    //     return { decimals: 6, tokenSymbol: "$USDC" };
    // }

    return { decimals: 18, tokenSymbol: "$CELO" };
  }, []);
  // [giveawayId]);




  const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
  
  const formattedEndDate = useMemo(() => {
    if (!endTime) return "";
    return new Date(Number(endTime) * 1000).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
  }, [endTime]);

  const uniqueWinnersList = useMemo(() => {
      if(!currentWinnersFids) return [];
      const list = [...(currentWinnersFids as bigint[])].reverse();
      const winnerMap = new Map();
      list.forEach((fidBN) => {
         const fid = Number(fidBN);
         winnerMap.set(fid, (winnerMap.get(fid) || 0) + 1);
      });
      return Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
         fid,
        //  totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
        totalWinAmount: (rewardAmountRaw * winCount) < 0.001 
  ? (rewardAmountRaw * winCount).toFixed(6) 
  : (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2)
      })).slice(0, 100);
  }, [currentWinnersFids, rewardAmountRaw, decimals]);

  // Fetch Profiles
  // --- HistoryAccordionItem এর জন্য অপ্টিমাইজড useEffect ---
  useEffect(() => {
    const fetchProfiles = async () => {
        if (!isOpen || uniqueWinnersList.length === 0) return;
        
        const cachedData = getLocalCache();
        const newFromCache: Record<number, WinnerProfile> = {}; // ⚡ ১. আলাদা অবজেক্টে জমাবো
        
        // ২. ক্যাশ এবং মিসিং ফিল্টার করা
        const missingFids = uniqueWinnersList
            .map(w => w.fid)
            .filter(fid => {
                // যদি ক্যাশে থাকে
                if (cachedData[fid] && !winnersProfiles[fid]) {
                    newFromCache[fid] = cachedData[fid]; // স্টেটে ডিরেক্ট না পাঠিয়ে অবজেক্টে রাখছি
                    fetchedFidsRef.current.add(fid); 
                    return false; // ফেচ লিস্ট থেকে বাদ
                }
                // যদি ক্যাশে না থাকে এবং আগেও ফেচ না করে থাকি
                return !fetchedFidsRef.current.has(fid) && !winnersProfiles[fid];
            });

        // ⚡ ৩. সব ক্যাশ ডেটা একবারে স্টেটে আপডেট (১ বার রেন্ডার হবে)
        if (Object.keys(newFromCache).length > 0) {
            setWinnersProfiles(prev => ({...prev, ...newFromCache}));
        }
        
        if (missingFids.length === 0) return;
        
        // মার্ক করে দিই
        missingFids.forEach(fid => fetchedFidsRef.current.add(fid));

        // API Call
        const chunk = missingFids.slice(0, 50); 
        try {
            const res = await fetch(`/api/users?fid=${chunk.join(',')}`);
            if(res.ok) {
                const data = await res.json();
                const newProfs: Record<number, WinnerProfile> = {};
                data.users?.forEach((u: any) => {
                    newProfs[u.fid] = { fid: u.fid, displayName: u.displayName || u.username, pfpUrl: u.pfpUrl };
                });
                
                chunk.forEach(fid => {
                    if (!newProfs[fid]) newProfs[fid] = { fid, displayName: `User`, pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` };
                });

                setWinnersProfiles(prev => ({...prev, ...newProfs}));
                // 🔥 নতুন ডেটা ক্যাশে সেভ করলাম
                saveToLocalCache(newProfs);
            }
        } catch (e) { console.error(e); }
    };
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueWinnersList, isOpen]);

  return (
    <div>
       {/* HEADER BAR */}
       <div className={styles.historyHeaderContainer} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.historyTitle}>
             <History size={16} className={styles.titleIcon} /> 
             <span>Winner History #{giveawayId}</span>
          </div>
          <div className={styles.historyStatusBadge}>
             Ended: {formattedEndDate}
             {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
       </div>
       
       {/* LIST */}
       {isOpen && (
         <div className={styles.historyListContainer}>
            {uniqueWinnersList.length > 0 ? (
                uniqueWinnersList.map((winner) => {
                   const profile = winnersProfiles[winner.fid];
                   const pfp = profile?.pfpUrl || `https://avatar.vercel.sh/${winner.fid}?size=60`;
                   const name = profile?.displayName || `User ${winner.fid}`;
                   
                   return (
                       <div key={winner.fid} className={styles.winnerRow}>
                          <div className={styles.winnerLeft}>
                             <div className={styles.pfpWrapper}>
                                <Image src={pfp} alt="pfp" width={30} height={30} className={styles.winnerPfp} unoptimized />
                             </div>
                             <span className={styles.winnerName} style={{fontSize:'0.8rem'}}>{name}</span>
                          </div>
                          <span className={styles.winnerAmount} style={{fontSize:'0.8rem'}}>+{winner.totalWinAmount} {tokenSymbol}</span>
                       </div>
                   );
                })
            ) : (
                <div className={styles.emptyState} style={{padding:10, fontSize:'0.8rem'}}><p>Loading...</p></div>
            )}
         </div>
       )}
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function GiveawayPage(props: any) { 
  const _isMiniPay = useMiniPayCompatibility();
  const passedId = props.giveawayId;
  const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);
  const fetchedFidsRef = useRef<Set<number>>(new Set()); // ✅ নতুন লাইন

  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [_isWarpcast, setIsWarpcast] = useState(false);

  const [showMainList, setShowMainList] = useState(true);
   const [optimisticCount, setOptimisticCount] = useState<number | null>(null);



  // Fetch Latest ID
const { data: latestId } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getLastGiveawayId", 
    chainId: 42220, // 👈 Must add this
    query: { enabled: activeGiveawayId === 0 }
  });



  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get("giveawayId");
      if (passedId) setActiveGiveawayId(passedId);
      else if (queryId) setActiveGiveawayId(Number(queryId));
      else if (latestId && activeGiveawayId === 0) setActiveGiveawayId(Number(latestId));
    }
  }, [passedId, latestId, activeGiveawayId]);

  // User Data
  const [userData, setUserData] = useState({ displayName: "Guest", pfpUrl: "https://placehold.co/100x100/0052FF/ffffff?text=?", fid: 0 });
  const [hasShared, setHasShared] = useState(false); 
  const [isVerifying, setIsVerifying] = useState(false); 
  const [isVerified, setIsVerified] = useState(false); 
  const [verifyError, setVerifyError] = useState(false); 
  const [errorTimer, setErrorTimer] = useState(0); 
  const [farcasterError, setFarcasterError] = useState(""); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastClaimedAmount, setLastClaimedAmount] = useState("0");
  const [winnersProfiles, setWinnersProfiles] = useState<Record<number, WinnerProfile>>({});

  // const { address } = useAccount();
    // const { address } = useAccount(); // isConnected এখানে লাগবে
  // const { connectors, connect } = useConnect();
  // ফারকাস্টার ফ্রেমের কনটেক্সট থেকে অ্যাড্রেস নেওয়ার চেষ্টা করুন
// const address = context?.user?.address || context?.user?.custodyAddress;

const { address, chain, isConnected } = useAccount(); 
  const { switchChainAsync } = useSwitchChain();
  const { connect, connectors } = useConnect(); 

//last farcaster used
// const { sendCallsAsync, isPending: isClaiming } = useSendCalls();

//minipay
const { sendCallsAsync, isPending: isClaimingCalls } = useSendCalls();
const { sendTransactionAsync, isPending: isClaimingTx } = useSendTransaction();

// বাটন ডিজেবল করার জন্য দুটির যেকোনো একটি Pending থাকলেই লোডিং দেখাবে
const isClaiming = isClaimingCalls || isClaimingTx;


  // Contract Reads (Active ID)
  const isValidId = activeGiveawayId > 0;
  const { data: details, refetch: refetchDetails } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getGiveawayDetails",
    args: [BigInt(activeGiveawayId)],
    chainId: 42220, // 👈 Must add this
    query: { enabled: isValidId }
  });

  const { data: userStats, refetch: refetchStats } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getUserStats",
    args: [BigInt(activeGiveawayId), address as `0x${string}`],
    chainId: 42220, // 👈 Must add this
    query: { enabled: isValidId && !!address } 
  });

  const { data: currentWinnersFids, refetch: refetchWinners } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getWinnersFIDs",
    args: [BigInt(activeGiveawayId)],
    chainId: 42220, // 👈 Must add this
    query: { enabled: isValidId }
  });

  // 🔥 NEW: Contract থেকে বর্তমান Claim Fee রিড করা
  const { data: claimFeeRaw } = useReadContract({
    address: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
    abi: ABI,
    functionName: "getClaimFee",
    chainId: 42220, // 👈 Must add this
  });
  
  // Fee টাকে BigInt হিসেবে সেভ করে রাখা (যাতে 0 সেট থাকলেও কাজ করে)
  const currentClaimFee = claimFeeRaw ? (claimFeeRaw as bigint) : 0n;

  const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
  const [totalWon, claimCount, _currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
  const realCount = Number(claimCount || 0);
  const count = optimisticCount !== null ? optimisticCount : realCount;
  const limit = Number(_currentLimit || 2);   //share logic 1 to 2
  const isFull = Number(current || 0) >= Number(max || 0);
  const isActiveGiveaway = active && !isEnded && !isFull;
  


  //   useEffect(() => {
  //   if (!isConnected && connectors.length > 0) {
  //     const connector = connectors[0];
  //     connect({ connector });
  //   }
  // }, [isConnected, connectors, connect]);


// 🔴 Wagmi Auto Silent Connect for Warpcast
  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
      connect({ connector: injectedConnector });
    }
  }, [isConnected, connectors, connect]);


  // 🔥🔥 FIX: Token Symbol & Decimals for MAIN Card 🔥🔥
const { decimals, tokenSymbol } = useMemo(() => {
    // পুরোনো বেস নেটওয়ার্কের টোকেন লজিক কমেন্ট করে দেওয়া হলো
    /*
    if (activeGiveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
    if (activeGiveawayId === 25) return { decimals: 18, tokenSymbol: "$BETR" };
    if ([26, 28].includes(activeGiveawayId)) { 
        return { decimals: 18, tokenSymbol: "$TOSHI" };
    }
    if ([32].includes(activeGiveawayId)) { 
        return { decimals: 18, tokenSymbol: "$ETH" };
    }
    if ([1, 2, 3, 5, 6, 7, 9].includes(activeGiveawayId)) { 
        return { decimals: 6, tokenSymbol: "$USDC" };
    }
    */

    // সেলো নেটওয়ার্কের ডিফল্ট টোকেন রিটার্ন
    return { decimals: 18, tokenSymbol: "$CELO" };
  }, []);
  // [activeGiveawayId]);





  const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
  // const rewardAmountFormatted = decimals === 6 ? rewardAmountRaw.toString() : rewardAmountRaw.toFixed(3);
  const rewardAmountFormatted = decimals === 6 
  ? rewardAmountRaw.toString() 
  : (rewardAmountRaw < 0.001 ? rewardAmountRaw.toFixed(6) : rewardAmountRaw.toFixed(3));
  const totalWonFormatted = formatUnits(totalWon || 0n, decimals);

  const formattedEndDate = useMemo(() => {
    if (!endTime) return "";
    return new Date(Number(endTime) * 1000).toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
  }, [endTime]);

  const displayedListRaw = useMemo(() => {
    return currentWinnersFids ? [...(currentWinnersFids as bigint[])].reverse() : [];
  }, [currentWinnersFids]);

  const uniqueWinnersList = useMemo(() => {
      const winnerMap = new Map();
      displayedListRaw.forEach((fidBN) => {
         const fid = Number(fidBN);
         winnerMap.set(fid, (winnerMap.get(fid) || 0) + 1);
      });
      return Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
         fid,
        //  totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
        totalWinAmount: (rewardAmountRaw * winCount) < 0.001 
  ? (rewardAmountRaw * winCount).toFixed(6) 
  : (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2)
      })).slice(0, 100);
  }, [displayedListRaw, rewardAmountRaw, decimals]);

  // const isFarcasterUser = userData.fid > 0;

  // History List IDs (Previous 3 IDs from current)
  const previousHistoryIds = useMemo(() => {
    if (!activeGiveawayId) return [];
    
    const currentId = Number(activeGiveawayId);
    const ids = [];
    for (let i = 1; i <= 2; i++) {
        const pid = currentId - i;
        if (pid > 0) ids.push(pid);
    }
    return ids;
  }, [activeGiveawayId]);

  useEffect(() => {
    setIsMounted(true);
    sdk.actions.ready(); 
    if (document.body.classList.contains('light-mode')) setIsDarkMode(false);
    if (typeof navigator !== "undefined") setIsWarpcast(/Warpcast/i.test(navigator.userAgent));
    const loadContext = async () => {
      try {
        const ctx = await sdk.context;
        if (ctx?.user) {
          setUserData({
            displayName: ctx.user.displayName || ctx.user.username || "User",
            pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100/0052FF/ffffff?text=?",
            fid: ctx.user.fid || 0
          });
        }
      } catch (err) { console.error("SDK Context Error:", err); }
    };
    loadContext();
  }, [activeGiveawayId, address]);

// --- 🔵 UPDATED FETCH PROFILES (Replace old function) ---
  const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
    if (winners.length === 0) return;

    // ১. প্রথমে লোকাল ক্যাশ থেকে ডেটা লোড করি
    const cachedData = getLocalCache();
    const newFromCache: Record<number, WinnerProfile> = {};
    let hasCacheHit = false;

    // ২. চেক করি কার ডেটা ক্যাশে আছে
    const missingFids = winners
      .map(w => w.fid)
      .filter(fid => {
        // যদি নিজের প্রোফাইল হয় অথবা ইতিমধ্যে ক্যাশে থাকে
        if (cachedData[fid]) {
          newFromCache[fid] = cachedData[fid];
          fetchedFidsRef.current.add(fid); // মার্ক করে দিলাম যাতে আর ফেচ না হয়
          hasCacheHit = true;
          return false; // লিস্ট থেকে বাদ (ফেচ করার দরকার নেই)
        }
        // যদি আগেও একবার ফেচ করে থাকি (Ref চেক)
        if (fetchedFidsRef.current.has(fid)) return false;
        
        return fid !== userData.fid;
      });

    // ৩. যদি ক্যাশে কিছু পাওয়া যায়, স্টেটে সেট করে দিই
    if (hasCacheHit) {
      setWinnersProfiles(prev => ({ ...prev, ...newFromCache }));
    }

    // ৪. যদি সব ক্যাশে পাওয়া যায়, তাহলে আর নিচে যাওয়ার দরকার নেই
    if (missingFids.length === 0) return;

    // ৫. বাকিগুলো ফেচ করি (API Call)
    missingFids.forEach(fid => fetchedFidsRef.current.add(fid));
    
    const BATCH_SIZE = 50;
    const chunks = [];
    for (let i = 0; i < missingFids.length; i += BATCH_SIZE) {
        chunks.push(missingFids.slice(i, i + BATCH_SIZE));
    }

    for (const chunk of chunks) {
        try {
            const response = await fetch(`/api/users?fid=${chunk.join(',')}`);
            if (response.ok) {
                const data = await response.json();
                const newFetchedData: Record<number, WinnerProfile> = {};
                
                if (data.users && Array.isArray(data.users)) {
                    data.users.forEach((user: any) => {
                        newFetchedData[user.fid] = { 
                            fid: user.fid, 
                            displayName: user.displayName || user.username || "User", 
                            pfpUrl: user.pfpUrl 
                        };
                    });
                }
                
                // ডিফল্ট ভ্যালু (যদি API নাম না দেয়)
                chunk.forEach(fid => {
                    if (!newFetchedData[fid]) {
                        newFetchedData[fid] = { 
                            fid, 
                            displayName: `User`, 
                            pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
                        };
                    }
                });

                // ✅ State আপডেট + Cache সেভ
                setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
                saveToLocalCache(newFetchedData); // ক্যাশে সেভ করে রাখলাম
            }
        } catch (error) { 
            console.error("Batch fetch error:", error); 
        }
    }
  }, [userData.fid]);

  useEffect(() => {
    if (uniqueWinnersList.length > 0) fetchProfiles(uniqueWinnersList);
  }, [uniqueWinnersList, fetchProfiles]);

  useEffect(() => {
    if (errorTimer > 0) {
      const timerId = setInterval(() => setErrorTimer((p) => p - 1), 1000);
      return () => clearInterval(timerId);
    } else if (errorTimer === 0 && verifyError) {
      setVerifyError(false);
      setIsVerifying(false);
      setHasShared(true); 
    }
  }, [errorTimer, verifyError, activeGiveawayId, address]);

  useEffect(() => {
    if (endTime) {
      const endTimeNum = Number(endTime); 
      const initialNow = Math.floor(Date.now() / 1000);
      if (initialNow >= endTimeNum) {
          setIsEnded(true);
          setTimeLeft({ hours: 0, mins: 0, secs: 0 });
      }
      const timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const distance = endTimeNum - now;  
        if (distance <= 0) {
           setIsEnded(true);
           setTimeLeft({ hours: 0, mins: 0, secs: 0 });
           clearInterval(timer);
        } else {
           setIsEnded(false);
           setTimeLeft({
             hours: Math.floor(distance / 3600),
             mins: Math.floor((distance % 3600) / 60),
             secs: distance % 60
           });
        }
        }, 1000);
      return () => clearInterval(timer);
    }
  }, [endTime]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  // const handleShare = () => {
  //  const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
  //  const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  //  const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
  //  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
  //  try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
  //  setHasShared(true);
  //  setShowSuccessModal(false);
  // };


const handleShare = () => {
  if (!userData.fid) return;

  const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
  const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
  
  // Warpcast intent URL
  const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;

  // Base app ba Warpcast-er SDK environment check
  const isFarcasterEnv = /warpcast|farcaster/i.test(navigator.userAgent);

  try {
    // Jodi frame-er bhitor thake (Warpcast ba Base app)
    if (isFarcasterEnv) {
      sdk.actions.openUrl(castIntentUrl);
    } else {
      // Normal browser hole
      window.open(castIntentUrl, "_blank");
    }
  } catch (error) {
    console.error("SDK Share error:", error);
    // SDK fail korle manual window open
    window.open(castIntentUrl, "_blank");
  }

  setHasShared(true);
  setShowSuccessModal(false);
};









  const handleVerify = async () => {
    if (!userData.fid) return;
    setIsVerifying(true);
    setVerifyError(false);
    try {
      const response = await fetch(`/api/verify-share?fid=${userData.fid}`);
      const data = await response.json();
      if (data.success) { setIsVerified(true); setIsVerifying(false); } else { setVerifyError(true); setErrorTimer(5); }
    } catch { setVerifyError(true); setErrorTimer(5); }
  };



//last used for farcaster. 

// const onClaim = async () => {
//       // if (!isWarpcast || !isFarcasterUser) { 
//   //   setFarcasterError("Open in Warpcast App"); 
//   //   return; 
//   // }
  
//   // setFarcasterError("");

  
//   try {
//     if (chain?.id !== 42220) {
//       await switchChainAsync({ chainId: 42220 });
//     }

//     const walletAddress = 
//       address || 
//       (userData as any)?.verified_addresses?.eth_addresses?.[0] || 
//       (userData as any)?.custody_address ||
//       (userData as any)?.address;

//     const userFid = userData?.fid;
//     const giveawayId = activeGiveawayId;

//     if (!walletAddress) {
//       setFarcasterError("Wallet not found. Please connect your wallet.");
//       return;
//     }

//     if (!userFid || !giveawayId) {
//       setFarcasterError("Missing user identity or Giveaway ID");
//       return;
//     }

//     // ১. ব্যাকএন্ড থেকে Signature এবং Nonce সংগ্রহ করা
//     const signResponse = await fetch('/api/sign-claim', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         userWallet: walletAddress, 
//         fid: Number(userFid), 
//         giveawayId: Number(giveawayId), 
//         isMiniPay: _isMiniPay
//       }),
//     });

//     const signData = await signResponse.json();

//     if (!signResponse.ok || !signData.signature || signData.nonce === undefined) {
//       throw new Error(signData.message || "Failed to get signature/nonce");
//     }

//     // ২. 🔥 ফাংশন ডাটা এনকোড করা (নতুন আর্গুমেন্ট অর্ডারসহ) 🔥
//     // অর্ডার: _id, _fid, _nonce, _signature
//     const functionData = encodeFunctionData({
//       abi: ABI,
//       functionName: "claimGiveaway",
//       args: [ 
//         BigInt(giveawayId), 
//         BigInt(userFid), 
//         BigInt(signData.nonce), // 🔥 নতুন প্যারামিটার Nonce যোগ করা হয়েছে
//         signData.signature as `0x${string}` 
//       ],
//     });

//     // ৩. বিল্ডার কোড সাফিক্স তৈরি
//     const builderSuffix = Attribution.toDataSuffix({
//       codes: ["bc_bmhx0p43"], 
//     });

//     // ৪. ডাটা জোড়া লাগানো (Concatenation)
//     const finalData = concat([functionData, builderSuffix]);

//     // ৫. sendCallsAsync দিয়ে ট্রানজেকশন পাঠানো
//     const id = await sendCallsAsync({
//       calls: [
//         {
//           to: CELO_CONTRACT_ADDRESS as `0x${string}`, // 👈 Change here
//           data: finalData,
//           value: currentClaimFee,
//         },
//       ],
//       // chainId: 42220, 
//     });

//     // ৬. সাকসেস হ্যান্ডলিং
//     if (id) {
//       setOptimisticCount(realCount + 1);
//       setLastClaimedAmount(rewardAmountFormatted); 
//       setShowSuccessModal(true);
//       setTimeout(() => { 
//         refetchDetails(); 
//         refetchStats(); 
//         refetchWinners(); 
//       }, 5000);
//     }

//   } catch (error: any) {
//     console.error("Claim Error:", error);
    
//     // নির্দিষ্ট এরর মেসেজ হ্যান্ডলিং (যেমন: Identity Check ফেইল করলে)
//     if (error.message?.includes("Personal ID Mint Required")) {
//         setFarcasterError("You must mint a Personal ID to claim this giveaway!");
//     } else if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
//         setFarcasterError("Transaction cancelled by user");
//     } else {
//         setFarcasterError(error.message || "Transaction failed. Try again.");
//     }
//     setTimeout(() => setFarcasterError(""), 5000);
//   }
// };







//minipay:
const onClaim = async () => {
  try {
    if (chain?.id !== 42220) {
      await switchChainAsync({ chainId: 42220 });
    }

    const walletAddress = 
      address || 
      (userData as any)?.verified_addresses?.eth_addresses?.[0] || 
      (userData as any)?.custody_address ||
      (userData as any)?.address;

    // FID 0 ধরে নিব যদি না থাকে
    const userFid = userData?.fid || 0; 
    const giveawayId = activeGiveawayId;

    if (!walletAddress) {
      setFarcasterError("Wallet not found. Please connect your wallet.");
      return;
    }

    // 🔥 ফিক্স: যদি MiniPay না হয় এবং FID না থাকে, তবেই শুধু এরর দিবে
    if (!giveawayId || (!_isMiniPay && !userFid)) {
      setFarcasterError("Missing user identity or Giveaway ID");
      return;
    }

    // ১. ব্যাকএন্ড থেকে Signature এবং Nonce সংগ্রহ করা
    const signResponse = await fetch('/api/sign-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userWallet: walletAddress, 
        fid: Number(userFid), 
        giveawayId: Number(giveawayId), 
        isMiniPay: _isMiniPay 
      }),
    });

    const signData = await signResponse.json();

    if (!signResponse.ok || !signData.signature || signData.nonce === undefined) {
      throw new Error(signData.message || "Failed to get signature/nonce");
    }

    const functionData = encodeFunctionData({
      abi: ABI,
      functionName: "claimGiveaway",
      args: [ 
        BigInt(giveawayId), 
        BigInt(userFid), 
        BigInt(signData.nonce), 
        signData.signature as `0x${string}` 
      ],
    });

    const builderSuffix = Attribution.toDataSuffix({
      codes: ["bc_bmhx0p43"], 
    });

    const finalData = concat([functionData, builderSuffix]);

    let txId;
    
    if (_isMiniPay) {
      // MiniPay-এর জন্য স্ট্যান্ডার্ড ট্রানজেকশন
      txId = await sendTransactionAsync({
        to: CELO_CONTRACT_ADDRESS as `0x${string}`,
        data: finalData,
        value: currentClaimFee,
      });
    } else {
      // Farcaster-এর জন্য Batched (SendCalls) ট্রানজেকশন
      txId = await sendCallsAsync({
        calls: [
          {
            to: CELO_CONTRACT_ADDRESS as `0x${string}`, 
            data: finalData,
            value: currentClaimFee,
          },
        ],
      });
    }

    // ৬. সাকসেস হ্যান্ডলিং
    if (txId) {
      setOptimisticCount(realCount + 1);
      setLastClaimedAmount(rewardAmountFormatted); 
      setShowSuccessModal(true);
      setTimeout(() => { 
        refetchDetails(); 
        refetchStats(); 
        refetchWinners(); 
      }, 5000);
    }

  } catch (error: any) {
    console.error("Claim Error:", error);
    
    if (error.message?.includes("Personal ID Mint Required")) {
        setFarcasterError("You must mint a Personal ID to claim this giveaway!");
    } else if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
        setFarcasterError("Transaction cancelled by user");
    } else {
        setFarcasterError(error.message || "Transaction failed. Try again.");
    }
    setTimeout(() => setFarcasterError(""), 5000);
  }
};



useEffect(() => {
  if (optimisticCount !== null && realCount >= optimisticCount) {
    setOptimisticCount(null);
  }
}, [realCount, optimisticCount]);

  if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

  

  // const renderActionButton = () => {
  //   // if (!isWarpcast || !isFarcasterUser) {
  //   //    return (
  //   //      <button className={styles.primaryBtn} disabled={true} style={{ opacity: 0.5, cursor: "not-allowed", backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444", pointerEvents: "none" }}>
  //   //        Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
  //   //      </button>
  //   //    );
  //   // }
  //   if (count === 0) {
  //     return (
  //       <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
  //         {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
  //         {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
  //       </button>
  //     );
  //   }
  //   if (count === 1 && count < limit) {
  //     if (!hasShared && !isVerified) {
  //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock +1 <Share2 size={16} /></button>;
  //     }
  //     if (hasShared && !isVerified) {
  //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
  //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
  //     }
  //     if (isVerified) {
  //       return <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>{isClaiming ? "Sending..." : "Claim Bonus"}{!isClaiming && <Zap size={16} fill="currentColor" />}</button>;
  //     }
  //   }
  //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
  // };




//useable for farcaster
  // const renderActionButton = () => {
  //   // --- প্রথম ক্লেইমের আগে শেয়ার এবং ভেরিফাই ---
  //   if (count === 0) {
  //     if (!hasShared && !isVerified) {
  //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Claim <Share2 size={16} /></button>;
  //     }
  //     if (hasShared && !isVerified) {
  //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
  //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
  //     }
  //     if (isVerified) {
  //       return (
  //         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
  //           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
  //           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
  //         </button>
  //       );
  //     }
  //   }

  //   // --- ১ বার ক্লেইম হয়ে গেলেই সরাসরি Completed দেখাবে ---
  //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
  // };



// last used minipay
  // const renderActionButton = () => {
  //   // --- প্রথম ক্লেইমের আগে শেয়ার এবং ভেরিফাই ---
  //   if (count === 0) {
      
  //     // 🔥 MiniPay ইউজারদের জন্য ডিরেক্ট Claim (Share Bypass)
  //     // অথবা যদি ফারকাস্টার ইউজার ইতিমধ্যে ভেরিফাই করে থাকে
  //     if (_isMiniPay || isVerified) {
  //       return (
  //         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
  //           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
  //           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
  //         </button>
  //       );
  //     }

  //     // 🔥 ফারকাস্টার ইউজারদের জন্য Share Logic
  //     if (!hasShared && !isVerified) {
  //       return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Claim <Share2 size={16} /></button>;
  //     }
      
  //     if (hasShared && !isVerified) {
  //        if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
  //        return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
  //     }
  //   }

  //   // --- ১ বার ক্লেইম হয়ে গেলেই সরাসরি Completed দেখাবে ---
  //   return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
  // };


  const renderActionButton = () => {
    
    if (count === 0) {
      return (
        <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
          {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
          {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
        </button>
      );
    }

   
    if (count === 1 && count < limit) {
      
      if (_isMiniPay || isVerified) {
        return (
          <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>
            {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Bonus"}
            {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
          </button>
        );
      }

      
      if (!hasShared && !isVerified) {
        return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16} /></button>;
      }
      
      if (hasShared && !isVerified) {
         if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
         return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
      }
    }

    return <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>;
  };
  

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      <nav className={styles.topBar}>
        <div className={styles.userInfoSmall}>
           <div className={styles.avatarMini}><Image src={userData.pfpUrl} alt="pfp" width={34} height={34} className={styles.pfpRound} unoptimized /></div>
           <div className={styles.userInfo}><span className={styles.username}>{userData.displayName}</span></div>
        </div>
        <button className={styles.themeBtn} onClick={toggleTheme}>{isDarkMode ? <Moon size={18} /> : <Sun size={18} />}</button>
      </nav>

      <main className={styles.main}>
        {isActiveGiveaway ? (
            <div className={styles.giveawayCard}>
              <div className={styles.liveTag}><span className={styles.pulseDot}></span> LIVE DROP</div>
              <h2 className={styles.cardTitle}>EXCLUSIVE MINI DROP #{activeGiveawayId}</h2>
              <div className={styles.timerWrapper}>
                 <div className={styles.timerDigit}>{String(timeLeft.hours).padStart(2, '0')}</div><span className={styles.timerSep}>:</span>
                 <div className={styles.timerDigit}>{String(timeLeft.mins).padStart(2, '0')}</div><span className={styles.timerSep}>:</span>
                 <div className={styles.timerDigit}>{String(timeLeft.secs).padStart(2, '0')}</div>
              </div>
              <p className={styles.cardSubtitle}>Ends soon! Claim before it's gone.</p>
            </div>
        ) : (
            <div className={`${styles.giveawayCard} ${styles.inactiveCard}`}>
               <div className={styles.endedIconWrapper}>{isFull ? <Users size={24} /> : <Clock size={24} />}</div>
               <div className={`${styles.statusBadge} ${isFull ? styles.soldOutTag : styles.endedTag}`}>{isFull ? "ALL CLAIMED" : "TIME EXPIRED"}</div>
               <h2 className={styles.cardTitle}>AIRDROP ENDED #{activeGiveawayId}</h2>
               <p className={styles.cardSubtitle}>This event is closed. See the winner list below. <br/> Please Wait for the next airdrop live soon.</p>
            </div>
        )}

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <Users size={16} className={styles.statIcon} />
            <div className={styles.statContent}>
                <span className={styles.statLabel}>{isActiveGiveaway ? "Claimed" : "Total Winners"}</span>
                <span className={styles.statValue}>{Number(current || 0)} <span className={styles.statTotal}>/ {Number(max || 0)}</span></span>
            </div>
          </div>
          <div className={styles.statBox}>
            <Trophy size={16} className={styles.statIcon} />
            <div className={styles.statContent}>
                <span className={styles.statLabel}>Airdrop Amount</span>
                <span className={styles.statValue}>{rewardAmountFormatted} {tokenSymbol}</span>
            </div>
          </div>
        </div>

        {isActiveGiveaway && (
            <div className={styles.actionZone}>
              <div className={styles.balanceHeader}>
                <span className={styles.totalLabel}>Total Earnings</span>
                <span className={styles.statValue}>{totalWonFormatted} {tokenSymbol}</span>
              </div>

          
              <div className={styles.progressTrack}>
                 <div className={`${styles.step} ${count > 0 ? styles.stepActive : ''}`}>1</div>
                 <div className={`${styles.trackLine} ${count > 0 ? styles.lineActive : ''}`}></div>
                 <div className={`${styles.step} ${count > 1 ? styles.stepActive : ''}`}>2</div>
              </div>


              {/* <div className={styles.progressTrack}>
   <div className={`${styles.step} ${styles.stepActive}`}>1</div>
   <div className={`${styles.trackLine} ${count > 0 ? styles.lineActive : ''}`}></div>
   <div className={`${styles.step} ${count > 0 ? styles.stepActive : ''}`}>
      {count > 0 ? <Check size={16} /> : <Lock size={16} />}
   </div>
</div> */}
              <div className={styles.btnWrapper}>{renderActionButton()}</div>
              {farcasterError && <p className={styles.errorText}><AlertCircle size={12} style={{marginRight:4}}/> {farcasterError}</p>}
            </div>
        )}

        {/* --- MAIN CURRENT EVENT LIST (Collapsible Header) --- */}
        <div className={styles.leaderboardSection}>
          <div className={styles.historyHeaderContainer} onClick={() => setShowMainList(!showMainList)}>
             <div className={styles.historyTitle}>
                {isActiveGiveaway ? <Sparkles size={16} className={styles.titleIcon}/> : <History size={16} className={styles.titleIcon}/>} 
                {isActiveGiveaway ? "Recent Winners" : `Recent History #${activeGiveawayId}`}
             </div>
             
             <div className={styles.historyStatusBadge}>
                {isActiveGiveaway ? "Live" : `Ended: ${formattedEndDate}`}
                {showMainList ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
             </div>
          </div>

          {showMainList && (
             <div className={styles.historyListContainer}>
               {uniqueWinnersList.length > 0 ? (
                 uniqueWinnersList.map((winner, idx) => {
                   const { fid, totalWinAmount } = winner;
                   const isMe = fid === userData.fid && userData.fid !== 0;
                   const profile = winnersProfiles[fid];
                   const displayName = (isMe && userData.displayName !== "Guest") ? userData.displayName : (profile?.displayName || `User`);
                   const pfpUrl = (isMe && userData.pfpUrl.includes("http")) ? userData.pfpUrl : (profile?.pfpUrl || `https://avatar.vercel.sh/${fid}?size=60`);

                   return (
                     <div key={fid} className={`${styles.winnerRow} ${isMe ? styles.myRow : ''}`} style={{animationDelay: `${idx * 0.05}s`}}>
                       <div className={styles.winnerLeft}>
                          <div className={styles.pfpWrapper}>
                             <Image src={pfpUrl} alt="pfp" width={34} height={34} className={styles.winnerPfp} unoptimized />
                             <div className={styles.rankBadge}>{idx + 1}</div>
                          </div>
                          <div className={styles.winnerInfo}>
                              <span className={styles.winnerName}>{displayName}</span>
                              {isMe && <span className={styles.meBadge}>YOU</span>}
                          </div>
                       </div>
                       <span className={styles.winnerAmount}>+{totalWinAmount} {tokenSymbol}</span>
                     </div>
                   );
                 })
               ) : (
                 <div className={styles.emptyState}><div className={styles.emptyIcon}>👻</div><p>No winners yet.</p></div>
               )}
             </div>
          )}
        </div>

        {/* --- PREVIOUS HISTORY SECTION (Accordions) - HIDDEN IF ACTIVE --- */}
        {/* !isActiveGiveaway &&  */}
        {previousHistoryIds.length > 0 && (
           <div style={{ marginTop: 10 }}>
              {previousHistoryIds.map((id) => (
                 <HistoryAccordionItem key={id} giveawayId={id} />
              ))}
           </div>
        )}

      </main>
      {showSuccessModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setShowSuccessModal(false)}><X size={18}/></button>
            <div className={styles.successIcon}><Check size={28} strokeWidth={4} /></div>
            <h3 className={styles.modalTitle}>Success!</h3>
            <p className={styles.modalText}>You received <span className={styles.gradientText}>{lastClaimedAmount} {tokenSymbol}</span></p>
            {/* {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>} */}
            {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>}
          </div>
        </div>
      )}
    </div>
  );
}



//id: 201254