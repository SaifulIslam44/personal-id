




// "use client";

// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useReadContract, useWriteContract, useAccount } from "wagmi";
// import { formatUnits } from "viem";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./giveaway.module.css";
// import Image from "next/image";
// import { 
//   Moon, Sun, Share2, Users, Trophy, Check, X, Zap, 
//   Loader2, Lock, ShieldCheck, AlertCircle, Sparkles, 
//   History, ChevronDown, ChevronUp, Clock
// } from "lucide-react"; 
// import { sdk } from "@farcaster/miniapp-sdk";

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
  
//   const { data: details } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(giveawayId)],
//   });

//   const { data: currentWinnersFids } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(giveawayId)],
//     query: { enabled: isOpen }
//   });

//   const [_tokenAddr, amount, _current, _max, endTime] = (details as any) || [];
  




  
//   // 🔥🔥 Token Logic for History Items 🔥🔥
//   const { decimals, tokenSymbol } = useMemo(() => {
//     // 1. JESSE Token (Only for ID 4)
//     if (giveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };

//     if ([8, 10, 11, 12, 13, 14, 15, 16].includes(giveawayId)) { 
//         return { decimals: 18, tokenSymbol: "$DEGEN" };
//     }

//     return { decimals: 6, tokenSymbol: "$USDC" };
//   }, [giveawayId]);




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
//          totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
//       })).slice(0, 100);
//   }, [currentWinnersFids, rewardAmountRaw, decimals]);

//   // Fetch Profiles
//   useEffect(() => {
//     const fetchProfiles = async () => {
//         if (!isOpen || uniqueWinnersList.length === 0) return;
        
//         // Use ref to filter missing FIDs instead of state dependency
//         const missingFids = uniqueWinnersList
//             .map(w => w.fid)
//             .filter(fid => !fetchedFidsRef.current.has(fid) && !winnersProfiles[fid]);
        
//         if (missingFids.length === 0) return;
        
//         // Mark as fetched immediately
//         missingFids.forEach(fid => fetchedFidsRef.current.add(fid));

//         const chunk = missingFids.slice(0, 50); 
//         try {
//             const res = await fetch(`/api/users?fid=${chunk.join(',')}`);
//             if(res.ok) {
//                 const data = await res.json();
//                 const newProfs: Record<number, WinnerProfile> = {};
//                 data.users?.forEach((u: any) => {
//                     newProfs[u.fid] = { fid: u.fid, displayName: u.displayName || u.username, pfpUrl: u.pfpUrl };
//                 });
                
//                 // Handle defaults for failed/missing profiles
//                 chunk.forEach(fid => {
//                     if (!newProfs[fid]) newProfs[fid] = { fid, displayName: `User`, pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` };
//                 });

//                 setWinnersProfiles(prev => ({...prev, ...newProfs}));
//             }
//         } catch (e) { console.error(e); }
//     };
//     fetchProfiles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [uniqueWinnersList, isOpen]); // keeping original dependencies logic plus ref usage solves the loop

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
//   const passedId = props.giveawayId;
//   const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);
//   const fetchedFidsRef = useRef<Set<number>>(new Set()); // ✅ নতুন লাইন

//   const [isMounted, setIsMounted] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
//   const [isEnded, setIsEnded] = useState(false);
//   const [isWarpcast, setIsWarpcast] = useState(false);

//   const [showMainList, setShowMainList] = useState(true);

//   // Fetch Latest ID
//   const { data: latestId } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getLastGiveawayId", 
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

//   const { address } = useAccount();
//   const { writeContractAsync, isPending: isClaiming } = useWriteContract();

//   // Contract Reads (Active ID)
//   const isValidId = activeGiveawayId > 0;
//   const { data: details, refetch: refetchDetails } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(activeGiveawayId)],
//     query: { enabled: isValidId }
//   });

//   const { data: userStats, refetch: refetchStats } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getUserStats",
//     args: [BigInt(activeGiveawayId), address as `0x${string}`],
//     query: { enabled: isValidId && !!address } 
//   });

//   const { data: currentWinnersFids, refetch: refetchWinners } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(activeGiveawayId)],
//     query: { enabled: isValidId }
//   });

//   const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
//   const [totalWon, claimCount, currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
//   const count = Number(claimCount || 0);
//   const limit = Number(currentLimit || 2);
//   const isFull = Number(current || 0) >= Number(max || 0);
//   const isActiveGiveaway = active && !isEnded && !isFull;
  




//   // 🔥🔥 FIX: Token Symbol & Decimals for MAIN Card 🔥🔥
//   const { decimals, tokenSymbol } = useMemo(() => {
//     if (activeGiveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
//     if ([8, 10, 11, 12, 13, 14, 15, 16].includes(activeGiveawayId)) {
//       return { decimals: 18, tokenSymbol: "$DEGEN" };
//     }
//     return { decimals: 6, tokenSymbol: "$USDC" };
//   }, [activeGiveawayId]);





//   const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
//   const rewardAmountFormatted = decimals === 6 ? rewardAmountRaw.toString() : rewardAmountRaw.toFixed(3);
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
//          totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
//       })).slice(0, 100);
//   }, [displayedListRaw, rewardAmountRaw, decimals]);

//   const isFarcasterUser = userData.fid > 0;

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

//   const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
//     if (winners.length === 0) return;

//     // ✅ Ref দিয়ে ফিল্টার করা হচ্ছে (State ডিপেন্ডেন্সি নেই)
//     const missingFids = winners
//       .map(w => w.fid)
//       .filter(fid => !fetchedFidsRef.current.has(fid) && fid !== userData.fid);

//     if (missingFids.length === 0) return;

//     // ✅ ফেচ করার আগেই মার্ক করে দিচ্ছি
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
                
//                 // ডিফল্ট ইউজার হ্যান্ডলিং
//                 chunk.forEach(fid => {
//                     if (!newFetchedData[fid]) {
//                         newFetchedData[fid] = { 
//                             fid, 
//                             displayName: `User`, 
//                             pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
//                         };
//                     }
//                 });

//                 // ✅ State আপডেট (Functional Update)
//                 setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
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
//       setHasShared(false); 
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

//   const handleShare = () => {
//     const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
//     const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//     const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
//     const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
//     try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
//     setHasShared(true);
//     setShowSuccessModal(false);
//   };

//   const handleVerify = async () => {
//     if (!userData.fid) return;
//     setIsVerifying(true);
//     setVerifyError(false);
//     try {
//       const response = await fetch(`/api/verify-share?fid=${userData.fid}`);
//       const data = await response.json();
//       if (data.success) { setIsVerified(true); setIsVerifying(false); } else { setVerifyError(true); setErrorTimer(3); }
//     } catch { setVerifyError(true); setErrorTimer(3); }
//   };

//   const onClaim = async () => {
//     if (!isWarpcast || !isFarcasterUser) { setFarcasterError("Open in Warpcast App"); return; }
//     setFarcasterError("");
//     try {
//       const signResponse = await fetch('/api/sign-claim', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userWallet: address, fid: userData.fid, giveawayId: activeGiveawayId }),
//       });
//       const signData = await signResponse.json();
//       if (!signResponse.ok || !signData.signature) throw new Error(signData.message || "Failed to get signature");

//       const hash = await writeContractAsync({
//         address: CONTRACT_ADDRESS as `0x${string}`,
//         abi: ABI,
//         functionName: "claimGiveaway",
//         args: [ BigInt(activeGiveawayId), BigInt(userData.fid), signData.signature as `0x${string}` ],
//       });
//       if (hash) {
//         setLastClaimedAmount(rewardAmountFormatted); 
//         setShowSuccessModal(true);
//         setTimeout(() => { refetchDetails(); refetchStats(); refetchWinners(); }, 2000);
//       }
//     } catch (error: any) {
//       if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
//           setFarcasterError("Transaction cancelled by user");
//       } else {
//           console.error("Transaction Failed:", error);
//           setFarcasterError(error.message || "Transaction failed. Try again.");
//       }
//       setTimeout(() => setFarcasterError(""), 3000);
//     }
//   };

//   if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

//   const renderActionButton = () => {
//     if (!isWarpcast || !isFarcasterUser) {
//       return (
//         <button className={styles.primaryBtn} disabled={true} style={{ opacity: 0.5, cursor: "not-allowed", backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444", pointerEvents: "none" }}>
//           Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
//         </button>
//       );
//     }
//     if (count === 0) {
//       return (
//         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//         </button>
//       );
//     }
//     if (count === 1 && count < limit) {
//       if (!hasShared && !isVerified) {
//         return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock +1 <Share2 size={16} /></button>;
//       }
//       if (hasShared && !isVerified) {
//          if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled>Try Again in {errorTimer}s</button>;
//          return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//       }
//       if (isVerified) {
//         return <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>{isClaiming ? "Sending..." : "Claim Bonus"}{!isClaiming && <Zap size={16} fill="currentColor" />}</button>;
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

//         {/* --- PREVIOUS HISTORY SECTION (Accordions) - HIDDEN IF ACTIVE --- */}
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
//             {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






































// "use client";

// import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useReadContract, useWriteContract, useAccount } from "wagmi";
// import { formatUnits } from "viem";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./giveaway.module.css";
// import Image from "next/image";
// import { 
//   Moon, Sun, Share2, Users, Trophy, Check, X, Zap, 
//   Loader2, Lock, ShieldCheck, AlertCircle, Sparkles, 
//   History, ChevronDown, ChevronUp, Clock
// } from "lucide-react"; 
// import { sdk } from "@farcaster/miniapp-sdk";

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
  
//   const { data: details } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(giveawayId)],
//   });

//   const { data: currentWinnersFids } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(giveawayId)],
//     query: { enabled: isOpen }
//   });

//   const [_tokenAddr, amount, _current, _max, endTime] = (details as any) || [];
  




  
//   // 🔥🔥 Token Logic for History Items 🔥🔥
//   const { decimals, tokenSymbol } = useMemo(() => {
//     // 1. JESSE Token (Only for ID 4)
//     if (giveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };

//     // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(giveawayId)) { 
//     //     return { decimals: 18, tokenSymbol: "$DEGEN" };
//     // }

//         if ([1, 2, 3, 5, 6, 7, 9].includes(giveawayId)) { 
//         return { decimals: 6, tokenSymbol: "$USDC" };
//     }

//     return { decimals: 18, tokenSymbol: "$DEGEN" };
//   }, [giveawayId]);




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
//          totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
//       })).slice(0, 100);
//   }, [currentWinnersFids, rewardAmountRaw, decimals]);

//   // Fetch Profiles
//   useEffect(() => {
//     const fetchProfiles = async () => {
//         if (!isOpen || uniqueWinnersList.length === 0) return;
        
//         // Use ref to filter missing FIDs instead of state dependency
//         const missingFids = uniqueWinnersList
//             .map(w => w.fid)
//             .filter(fid => !fetchedFidsRef.current.has(fid) && !winnersProfiles[fid]);
        
//         if (missingFids.length === 0) return;
        
//         // Mark as fetched immediately
//         missingFids.forEach(fid => fetchedFidsRef.current.add(fid));

//         const chunk = missingFids.slice(0, 50); 
//         try {
//             const res = await fetch(`/api/users?fid=${chunk.join(',')}`);
//             if(res.ok) {
//                 const data = await res.json();
//                 const newProfs: Record<number, WinnerProfile> = {};
//                 data.users?.forEach((u: any) => {
//                     newProfs[u.fid] = { fid: u.fid, displayName: u.displayName || u.username, pfpUrl: u.pfpUrl };
//                 });
                
//                 // Handle defaults for failed/missing profiles
//                 chunk.forEach(fid => {
//                     if (!newProfs[fid]) newProfs[fid] = { fid, displayName: `User`, pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` };
//                 });

//                 setWinnersProfiles(prev => ({...prev, ...newProfs}));
//             }
//         } catch (e) { console.error(e); }
//     };
//     fetchProfiles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [uniqueWinnersList, isOpen]); // keeping original dependencies logic plus ref usage solves the loop

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
//   const passedId = props.giveawayId;
//   const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);
//   const fetchedFidsRef = useRef<Set<number>>(new Set()); // ✅ নতুন লাইন

//   const [isMounted, setIsMounted] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
//   const [isEnded, setIsEnded] = useState(false);
//   const [_isWarpcast, setIsWarpcast] = useState(false);

//   const [showMainList, setShowMainList] = useState(true);



//   // Fetch Latest ID
//   const { data: latestId } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getLastGiveawayId", 
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

//   const { address } = useAccount();
//   // ফারকাস্টার ফ্রেমের কনটেক্সট থেকে অ্যাড্রেস নেওয়ার চেষ্টা করুন
// // const address = context?.user?.address || context?.user?.custodyAddress;


//   const { writeContractAsync, isPending: isClaiming } = useWriteContract();

//   // Contract Reads (Active ID)
//   const isValidId = activeGiveawayId > 0;
//   const { data: details, refetch: refetchDetails } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getGiveawayDetails",
//     args: [BigInt(activeGiveawayId)],
//     query: { enabled: isValidId }
//   });

//   const { data: userStats, refetch: refetchStats } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getUserStats",
//     args: [BigInt(activeGiveawayId), address as `0x${string}`],
//     query: { enabled: isValidId && !!address } 
//   });

//   const { data: currentWinnersFids, refetch: refetchWinners } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getWinnersFIDs",
//     args: [BigInt(activeGiveawayId)],
//     query: { enabled: isValidId }
//   });

//   const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
//   const [totalWon, claimCount, currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
//   const count = Number(claimCount || 0);
//   const limit = Number(currentLimit || 2);
//   const isFull = Number(current || 0) >= Number(max || 0);
//   const isActiveGiveaway = active && !isEnded && !isFull;
  




//   // 🔥🔥 FIX: Token Symbol & Decimals for MAIN Card 🔥🔥
//   const { decimals, tokenSymbol } = useMemo(() => {
//     if (activeGiveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
//     // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(activeGiveawayId)) {
//     //   return { decimals: 18, tokenSymbol: "$DEGEN" };
//     // }

//         if ([1, 2, 3, 5, 6, 7, 9].includes(activeGiveawayId)) { 
//         return { decimals: 6, tokenSymbol: "$USDC" };
//     }

//     return { decimals: 18, tokenSymbol: "$DEGEN" };
//   }, [activeGiveawayId]);





//   const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
//   const rewardAmountFormatted = decimals === 6 ? rewardAmountRaw.toString() : rewardAmountRaw.toFixed(3);
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
//          totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
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

//   const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
//     if (winners.length === 0) return;

//     // ✅ Ref দিয়ে ফিল্টার করা হচ্ছে (State ডিপেন্ডেন্সি নেই)
//     const missingFids = winners
//       .map(w => w.fid)
//       .filter(fid => !fetchedFidsRef.current.has(fid) && fid !== userData.fid);

//     if (missingFids.length === 0) return;

//     // ✅ ফেচ করার আগেই মার্ক করে দিচ্ছি
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
                
//                 // ডিফল্ট ইউজার হ্যান্ডলিং
//                 chunk.forEach(fid => {
//                     if (!newFetchedData[fid]) {
//                         newFetchedData[fid] = { 
//                             fid, 
//                             displayName: `User`, 
//                             pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
//                         };
//                     }
//                 });

//                 // ✅ State আপডেট (Functional Update)
//                 setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
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
//       setHasShared(false); 
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

//   const handleShare = () => {
//     const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
//     const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//     const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
//     const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
//     try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
//     setHasShared(true);
//     setShowSuccessModal(false);
//   };

//   const handleVerify = async () => {
//     if (!userData.fid) return;
//     setIsVerifying(true);
//     setVerifyError(false);
//     try {
//       const response = await fetch(`/api/verify-share?fid=${userData.fid}`);
//       const data = await response.json();
//       if (data.success) { setIsVerified(true); setIsVerifying(false); } else { setVerifyError(true); setErrorTimer(3); }
//     } catch { setVerifyError(true); setErrorTimer(3); }
//   };

//   // const onClaim = async () => {
//   //   if (!isWarpcast || !isFarcasterUser) { setFarcasterError("Open in Warpcast App"); return; }
//   //   setFarcasterError("");
//   //   try {
//   //     const signResponse = await fetch('/api/sign-claim', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ userWallet: address, fid: userData.fid, giveawayId: activeGiveawayId }),
//   //     });
//   //     const signData = await signResponse.json();
//   //     if (!signResponse.ok || !signData.signature) throw new Error(signData.message || "Failed to get signature");

//   //     const hash = await writeContractAsync({
//   //       address: CONTRACT_ADDRESS as `0x${string}`,
//   //       abi: ABI,
//   //       functionName: "claimGiveaway",
//   //       args: [ BigInt(activeGiveawayId), BigInt(userData.fid), signData.signature as `0x${string}` ],
//   //     });
//   //     if (hash) {
//   //       setLastClaimedAmount(rewardAmountFormatted); 
//   //       setShowSuccessModal(true);
//   //       setTimeout(() => { refetchDetails(); refetchStats(); refetchWinners(); }, 2000);
//   //     }
//   //   } catch (error: any) {
//   //     if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
//   //         setFarcasterError("Transaction cancelled by user");
//   //     } else {
//   //         console.error("Transaction Failed:", error);
//   //         setFarcasterError(error.message || "Transaction failed. Try again.");
//   //     }
//   //     setTimeout(() => setFarcasterError(""), 3000);
//   //   }
//   // };








// const onClaim = async () => {
//   // if (!isWarpcast || !isFarcasterUser) { 
//   //   setFarcasterError("Open in Warpcast App"); 
//   //   return; 
//   // }
  
//   // setFarcasterError("");

//   try {
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

//     const signResponse = await fetch('/api/sign-claim', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ 
//         userWallet: walletAddress, 
//         fid: Number(userFid), 
//         giveawayId: Number(giveawayId) 
//       }),
//     });

//     const signData = await signResponse.json();

//     if (!signResponse.ok || !signData.signature) {
//       throw new Error(signData.message || "Failed to get signature");
//     }

//     const hash = await writeContractAsync({
//       address: CONTRACT_ADDRESS as `0x${string}`,
//       abi: ABI,
//       functionName: "claimGiveaway",
//       args: [ 
//         BigInt(giveawayId), 
//         BigInt(userFid), 
//         signData.signature as `0x${string}` 
//       ],
//     });

//     if (hash) {
//       setLastClaimedAmount(rewardAmountFormatted); 
//       setShowSuccessModal(true);
//       setTimeout(() => { 
//         refetchDetails(); 
//         refetchStats(); 
//         refetchWinners(); 
//       }, 2000);
//     }

//   } catch (error: any) {
//     if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
//         setFarcasterError("Transaction cancelled by user");
//     } else {
//         setFarcasterError(error.message || "Transaction failed. Try again.");
//     }
//     setTimeout(() => setFarcasterError(""), 3000);
//   }
// };




//   if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

//   const renderActionButton = () => {
//     // if (!isWarpcast || !isFarcasterUser) {
//     //   return (
//     //     <button className={styles.primaryBtn} disabled={true} style={{ opacity: 0.5, cursor: "not-allowed", backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444", pointerEvents: "none" }}>
//     //       Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
//     //     </button>
//     //   );
//     // }
//     if (count === 0) {
//       return (
//         <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
//           {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
//           {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
//         </button>
//       );
//     }
//     if (count === 1 && count < limit) {
//       if (!hasShared && !isVerified) {
//         return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock +1 <Share2 size={16} /></button>;
//       }
//       if (hasShared && !isVerified) {
//          if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled>Try Again in {errorTimer}s</button>;
//          return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
//       }
//       if (isVerified) {
//         return <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>{isClaiming ? "Sending..." : "Claim Bonus"}{!isClaiming && <Zap size={16} fill="currentColor" />}</button>;
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

//         {/* --- PREVIOUS HISTORY SECTION (Accordions) - HIDDEN IF ACTIVE --- */}
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
//             {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














































"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useReadContract, useSendCalls, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
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
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getGiveawayDetails",
    args: [BigInt(giveawayId)],
  });

  const { data: currentWinnersFids } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getWinnersFIDs",
    args: [BigInt(giveawayId)],
    query: { enabled: isOpen }
  });

  const [_tokenAddr, amount, _current, _max, endTime] = (details as any) || [];
  




  
  // 🔥🔥 Token Logic for History Items 🔥🔥
  const { decimals, tokenSymbol } = useMemo(() => {
    // 1. JESSE Token (Only for ID 4)
    if (giveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };

    // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(giveawayId)) { 
    //     return { decimals: 18, tokenSymbol: "$DEGEN" };
    // }

        if ([1, 2, 3, 5, 6, 7, 9].includes(giveawayId)) { 
        return { decimals: 6, tokenSymbol: "$USDC" };
    }

    return { decimals: 18, tokenSymbol: "$DEGEN" };
  }, [giveawayId]);




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
         totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
      })).slice(0, 100);
  }, [currentWinnersFids, rewardAmountRaw, decimals]);

  // Fetch Profiles
  useEffect(() => {
    const fetchProfiles = async () => {
        if (!isOpen || uniqueWinnersList.length === 0) return;
        
        // Use ref to filter missing FIDs instead of state dependency
        const missingFids = uniqueWinnersList
            .map(w => w.fid)
            .filter(fid => !fetchedFidsRef.current.has(fid) && !winnersProfiles[fid]);
        
        if (missingFids.length === 0) return;
        
        // Mark as fetched immediately
        missingFids.forEach(fid => fetchedFidsRef.current.add(fid));

        const chunk = missingFids.slice(0, 50); 
        try {
            const res = await fetch(`/api/users?fid=${chunk.join(',')}`);
            if(res.ok) {
                const data = await res.json();
                const newProfs: Record<number, WinnerProfile> = {};
                data.users?.forEach((u: any) => {
                    newProfs[u.fid] = { fid: u.fid, displayName: u.displayName || u.username, pfpUrl: u.pfpUrl };
                });
                
                // Handle defaults for failed/missing profiles
                chunk.forEach(fid => {
                    if (!newProfs[fid]) newProfs[fid] = { fid, displayName: `User`, pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` };
                });

                setWinnersProfiles(prev => ({...prev, ...newProfs}));
            }
        } catch (e) { console.error(e); }
    };
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueWinnersList, isOpen]); // keeping original dependencies logic plus ref usage solves the loop

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
  const passedId = props.giveawayId;
  const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);
  const fetchedFidsRef = useRef<Set<number>>(new Set()); // ✅ নতুন লাইন

  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [_isWarpcast, setIsWarpcast] = useState(false);

  const [showMainList, setShowMainList] = useState(true);




  // Fetch Latest ID
  const { data: latestId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getLastGiveawayId", 
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
  const [isConfirming, setIsConfirming] = useState(false);
  const { address } = useAccount();
  // ফারকাস্টার ফ্রেমের কনটেক্সট থেকে অ্যাড্রেস নেওয়ার চেষ্টা করুন
// const address = context?.user?.address || context?.user?.custodyAddress;


const { sendCallsAsync, isPending: isClaiming } = useSendCalls();


  // Contract Reads (Active ID)
  const isValidId = activeGiveawayId > 0;
  const { data: details, refetch: refetchDetails } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getGiveawayDetails",
    args: [BigInt(activeGiveawayId)],
    query: { enabled: isValidId }
  });

  const { data: userStats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getUserStats",
    args: [BigInt(activeGiveawayId), address as `0x${string}`],
    query: { enabled: isValidId && !!address } 
  });

  const { data: currentWinnersFids, refetch: refetchWinners } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getWinnersFIDs",
    args: [BigInt(activeGiveawayId)],
    query: { enabled: isValidId }
  });

  const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
  const [totalWon, claimCount, currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
  const count = Number(claimCount || 0);
  const limit = Number(currentLimit || 2);
  const isFull = Number(current || 0) >= Number(max || 0);
  const isActiveGiveaway = active && !isEnded && !isFull;
  




  // 🔥🔥 FIX: Token Symbol & Decimals for MAIN Card 🔥🔥
  const { decimals, tokenSymbol } = useMemo(() => {
    if (activeGiveawayId === 4) return { decimals: 18, tokenSymbol: "$JESSE" };
    // if ([8, 10, 11, 12, 13, 14, 15, 16].includes(activeGiveawayId)) {
    //   return { decimals: 18, tokenSymbol: "$DEGEN" };
    // }

        if ([1, 2, 3, 5, 6, 7, 9].includes(activeGiveawayId)) { 
        return { decimals: 6, tokenSymbol: "$USDC" };
    }

    return { decimals: 18, tokenSymbol: "$DEGEN" };
  }, [activeGiveawayId]);





  const rewardAmountRaw = amount ? Number(formatUnits(amount, decimals)) : 0;
  const rewardAmountFormatted = decimals === 6 ? rewardAmountRaw.toString() : rewardAmountRaw.toFixed(3);
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
         totalWinAmount: (rewardAmountRaw * winCount).toFixed(decimals === 6 ? 3 : 2) 
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

  const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
    if (winners.length === 0) return;

    // ✅ Ref দিয়ে ফিল্টার করা হচ্ছে (State ডিপেন্ডেন্সি নেই)
    const missingFids = winners
      .map(w => w.fid)
      .filter(fid => !fetchedFidsRef.current.has(fid) && fid !== userData.fid);

    if (missingFids.length === 0) return;

    // ✅ ফেচ করার আগেই মার্ক করে দিচ্ছি
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
                
                // ডিফল্ট ইউজার হ্যান্ডলিং
                chunk.forEach(fid => {
                    if (!newFetchedData[fid]) {
                        newFetchedData[fid] = { 
                            fid, 
                            displayName: `User`, 
                            pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
                        };
                    }
                });

                // ✅ State আপডেট (Functional Update)
                setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
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
      setHasShared(false); 
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
  //   const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
  //   const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  //   const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸\nThis was a time-limited & user-limited FCFS airdrop (first come, first served)💙🟦`;
  //   const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
  //   try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
  //   setHasShared(true);
  //   setShowSuccessModal(false);
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
      if (data.success) { setIsVerified(true); setIsVerifying(false); } else { setVerifyError(true); setErrorTimer(3); }
    } catch { setVerifyError(true); setErrorTimer(3); }
  };

  // const onClaim = async () => {
  //   if (!isWarpcast || !isFarcasterUser) { setFarcasterError("Open in Warpcast App"); return; }
  //   setFarcasterError("");
  //   try {
  //     const signResponse = await fetch('/api/sign-claim', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userWallet: address, fid: userData.fid, giveawayId: activeGiveawayId }),
  //     });
  //     const signData = await signResponse.json();
  //     if (!signResponse.ok || !signData.signature) throw new Error(signData.message || "Failed to get signature");

  //     const hash = await writeContractAsync({
  //       address: CONTRACT_ADDRESS as `0x${string}`,
  //       abi: ABI,
  //       functionName: "claimGiveaway",
  //       args: [ BigInt(activeGiveawayId), BigInt(userData.fid), signData.signature as `0x${string}` ],
  //     });
  //     if (hash) {
  //       setLastClaimedAmount(rewardAmountFormatted); 
  //       setShowSuccessModal(true);
  //       setTimeout(() => { refetchDetails(); refetchStats(); refetchWinners(); }, 2000);
  //     }
  //   } catch (error: any) {
  //     if (error.code === 4001 || error.message?.includes("User rejected") || error.name === 'UserRejectedRequestError') {
  //         setFarcasterError("Transaction cancelled by user");
  //     } else {
  //         console.error("Transaction Failed:", error);
  //         setFarcasterError(error.message || "Transaction failed. Try again.");
  //     }
  //     setTimeout(() => setFarcasterError(""), 3000);
  //   }
  // };






const onClaim = async () => {
      // if (!isWarpcast || !isFarcasterUser) { 
  //   setFarcasterError("Open in Warpcast App"); 
  //   return; 
  // }
  
  // setFarcasterError("");
    try {
      const walletAddress = 
        address || 
        (userData as any)?.verified_addresses?.eth_addresses?.[0] || 
        (userData as any)?.custody_address ||
        (userData as any)?.address;

      const userFid = userData?.fid;
      const giveawayId = activeGiveawayId;

      if (!walletAddress) { setFarcasterError("Wallet not found. Please connect your wallet."); return; }
      if (!userFid || !giveawayId) { setFarcasterError("Missing user identity or Giveaway ID"); return; }

      const signResponse = await fetch('/api/sign-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userWallet: walletAddress, fid: Number(userFid), giveawayId: Number(giveawayId) }),
      });

      const signData = await signResponse.json();
      if (!signResponse.ok || !signData.signature) { throw new Error(signData.message || "Failed to get signature"); }

      const functionData = encodeFunctionData({
        abi: ABI,
        functionName: "claimGiveaway",
        args: [ BigInt(giveawayId), BigInt(userFid), signData.signature as `0x${string}` ],
      });

      const builderSuffix = Attribution.toDataSuffix({ codes: ["bc_bmhx0p43"] });
      const finalData = concat([functionData, builderSuffix]);

      const id = await sendCallsAsync({
        calls: [{ to: CONTRACT_ADDRESS as `0x${string}`, data: finalData }],
      });

      if (id) {
        // 🔥 ১. লোডিং শুরু (বাটন "Claiming..." দেখাবে)
        setIsConfirming(true);

        // 🔥 ২. পোলিং লুপ: চেক করবে ব্লকচেইনে আপডেট হয়েছে কিনা
        let attempts = 0;
        const checkInterval = setInterval(async () => {
            attempts++;
            
            // ডাটা রি-ফেচ করা
            const { data: newStats } = await refetchStats();
            const [_total, newClaimCount] = (newStats as any) || [0n, 0n];
            const newCount = Number(newClaimCount);
            
            // যদি ব্লকচেইনে কাউন্ট বেড়ে যায় অথবা ৩০ বার চেক করা হয়ে যায়
            if (newCount > count || attempts >= 30) {
                clearInterval(checkInterval); // চেক করা বন্ধ করো
                setIsConfirming(false); // লোডিং বন্ধ করো
                
                // সাকসেস মডেল দেখাও
                setLastClaimedAmount(rewardAmountFormatted);
                setShowSuccessModal(true);
                refetchDetails();
                refetchWinners();
            }
        }, 2000); // প্রতি ২ সেকেন্ড পর পর চেক করবে
      }

    } catch (error: any) {
      console.error("Claim Error:", error);
      setIsConfirming(false); // এরর হলে লোডিং বন্ধ
      if (error.code === 4001 || error.message?.includes("User rejected")) {
          setFarcasterError("Transaction cancelled by user");
      } else {
          setFarcasterError(error.message || "Transaction failed. Try again.");
      }
      setTimeout(() => setFarcasterError(""), 3000);
    }
  };





  if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

  

  const renderActionButton = () => {
    // if (!isWarpcast || !isFarcasterUser) {
    //   return (
    //     <button className={styles.primaryBtn} disabled={true} style={{ opacity: 0.5, cursor: "not-allowed", backgroundColor: "#2a2a2a", color: "#888", border: "1px solid #444", pointerEvents: "none" }}>
    //       Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
    //     </button>
    //   );
    // }
if (count === 0) {
      return (
        <button 
           className={styles.primaryBtn} 
           onClick={onClaim} 
           disabled={isClaiming || isConfirming || isFull}
        >
          {isClaiming || isConfirming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
          
          {!(isClaiming || isConfirming) && !isFull && <Zap size={16} fill="currentColor" />}
        </button>
      );
    }
    if (count === 1 && count < limit) {
      if (!hasShared && !isVerified) {
        return <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>Share to Unlock +1 <Share2 size={16} /></button>;
      }
      if (hasShared && !isVerified) {
         if (verifyError) return <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled> Not Shared! Try Again {errorTimer}s</button>;
         return <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Share"}{!isVerifying && <ShieldCheck size={16} />}</button>;
      }
      if (isVerified) {
        return <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>{isClaiming ? "Sending..." : "Claim Bonus"}{!isClaiming && <Zap size={16} fill="currentColor" />}</button>;
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
            {count === 1 && !isVerified && <button className={styles.modalShareBtn} onClick={handleShare}>Share to Unlock Bonus <Share2 size={16}/></button>}
          </div>
        </div>
      )}
    </div>
  );
}