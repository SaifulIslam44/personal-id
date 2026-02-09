// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
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

// interface WinnerProfile {
//   fid: number;
//   displayName: string;
//   pfpUrl: string;
// }

// export default function GiveawayPage(props: any) { 
//   const passedId = props.giveawayId;
  
//   // প্রাথমিক স্টেট ০ বা props থেকে নেওয়া আইডি
//   const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);

//   const [isMounted, setIsMounted] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
//   const [isEnded, setIsEnded] = useState(false);
//   const [isWarpcast, setIsWarpcast] = useState(false);

//   // Fetch Latest ID from Blockchain
//   const { data: latestId } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getLastGiveawayId", 
//     query: { 
//       // Only fetch if no specific ID is currently active (initially 0)
//       enabled: activeGiveawayId === 0 
//     }
//   });

//   // *** URL Param Logic (Vanilla JS) ***
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const params = new URLSearchParams(window.location.search);
//       const queryId = params.get("giveawayId");
      
//       if (passedId) {
//          setActiveGiveawayId(passedId);
//       } else if (queryId) {
//          setActiveGiveawayId(Number(queryId));
//       } else if (latestId && activeGiveawayId === 0) {
//          setActiveGiveawayId(Number(latestId));
//       }
//     }
//   }, [passedId, latestId, activeGiveawayId]);

//   // History Toggle State
//   const [showHistoryList, setShowHistoryList] = useState(true);

//   // User Data (SDK)
//   const [userData, setUserData] = useState({
//     displayName: "Guest",
//     pfpUrl: "https://placehold.co/100x100?text=Guest",
//     fid: 0
//   });

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

//   // --- Contract Reads (Using activeGiveawayId) ---
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

//   // --- Derived Data ---
//   const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
//   const [totalWon, claimCount, currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
    
//   const count = Number(claimCount || 0);
//   const limit = Number(currentLimit || 2);
//   const isFull = Number(current || 0) >= Number(max || 0);
    
//   // Amounts
//   const rewardAmountRaw = amount ? Number(formatUnits(amount, 6)) : 0;
//   const rewardAmountFormatted = rewardAmountRaw.toString();
//   const totalWonFormatted = formatUnits(totalWon || 0n, 6);

//   // Logic for Active/Ended State
//   const isActiveGiveaway = active && !isEnded && !isFull;

//   // Format Date for History
//   const formattedEndDate = useMemo(() => {
//     if (!endTime) return "";
//     const date = new Date(Number(endTime) * 1000);
//     return date.toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
//   }, [endTime]);

//   // List Logic
//   const displayedListRaw = useMemo(() => {
//     return currentWinnersFids ? [...(currentWinnersFids as bigint[])].reverse() : [];
//   }, [currentWinnersFids]);

//   // *** LOGIC: Merge Duplicate Winners & Sum Amounts ***
//   const uniqueWinnersList = useMemo(() => {
//       const winnerMap = new Map();

//       displayedListRaw.forEach((fidBN) => {
//          const fid = Number(fidBN);
//          if (winnerMap.has(fid)) {
//             winnerMap.set(fid, winnerMap.get(fid) + 1);
//          } else {
//             winnerMap.set(fid, 1);
//          }
//       });

//       const mergedList = Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
//          fid,
//          totalWinAmount: (rewardAmountRaw * winCount).toFixed(3) 
//       }));

//       return mergedList.slice(0, 10);
//   }, [displayedListRaw, rewardAmountRaw]);

//   // Derived check for Farcaster User
//   const isFarcasterUser = userData.fid > 0;

//   // --- Initialization ---
//   useEffect(() => {
//     setIsMounted(true);
//     sdk.actions.ready(); 
    
//     // NOTE: Removed all localStorage logic here for fresh load
//     if (document.body.classList.contains('light-mode')) setIsDarkMode(false);

//     // *** STRICT USER AGENT CHECK ***
//     if (typeof navigator !== "undefined") {
//         const ua = navigator.userAgent;
//         setIsWarpcast(/Warpcast/i.test(ua));
//     }

//     const loadContext = async () => {
//       try {
//         const ctx = await sdk.context;
//         if (ctx?.user) {
//           setUserData({
//             displayName: ctx.user.displayName || ctx.user.username || "User",
//             pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User",
//             fid: ctx.user.fid || 0
//           });
//         }
//       } catch (err) {
//         console.error("SDK Context Error:", err);
//       }
//     };
//     loadContext();
//   }, [activeGiveawayId, address]);


//   // --- API CALL LOGIC (Updated to match Leaderboard style) ---
//   const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
//     if (winners.length === 0) return;

//     const missingFids = winners
//       .map(w => w.fid)
//       .filter(fid => !winnersProfiles[fid] && fid !== userData.fid);

//     if (missingFids.length === 0) return;

//     const newFetchedData: Record<number, WinnerProfile> = {};

//     await Promise.all(missingFids.map(async (fid) => {
//       // Fallback clean rakhlam, 'Farcaster ID' text remove korechi
//       const fallbackProfile = {
//         fid,
//         displayName: `User`, // Fallback name cleaned
//         pfpUrl: `https://avatar.vercel.sh/${fid}?size=60` 
//       };
      
//       try {
//         // Keeping 'no-store' to ensure data is fresh from server
//         const response = await fetch(`/api/users?fid=${fid}`, {
//            cache: 'no-store' 
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           // API data map korchi
//           newFetchedData[fid] = {
//             fid,
//             displayName: data.displayName || data.username || fallbackProfile.displayName,
//             pfpUrl: data.pfpUrl || data.pfp || fallbackProfile.pfpUrl
//           };
//         } else {
//           newFetchedData[fid] = fallbackProfile;
//         }
//       } catch {
//          newFetchedData[fid] = fallbackProfile;
//       }
//     }));

//     if (Object.keys(newFetchedData).length > 0) {
//       setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
//     }
//   }, [winnersProfiles, userData.fid]);

//   useEffect(() => {
//     if (uniqueWinnersList.length > 0) {
//       fetchProfiles(uniqueWinnersList);
//     }
//   }, [uniqueWinnersList, fetchProfiles]);


//   // --- Helper Effects ---
//   useEffect(() => {
//     if (errorTimer > 0) {
//       const timerId = setInterval(() => setErrorTimer((p) => p - 1), 1000);
//       return () => clearInterval(timerId);
//     } else if (errorTimer === 0 && verifyError) {
//       setVerifyError(false);
//       setIsVerifying(false);
//       setHasShared(false); 
//       // Removed localStorage logic here
//     }
//   }, [errorTimer, verifyError, activeGiveawayId, address]);

//   // UPDATED TIMER LOGIC FOR HOURS:MINS:SECS
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

//   // If ended, auto-open history
//   useEffect(() => {
//     if (!isActiveGiveaway) {
//         setShowHistoryList(true);
//     }
//   }, [isActiveGiveaway]);

//   // --- Handlers ---
//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.classList.toggle('light-mode');
//   };

//   const handleShare = () => {
//     const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
//     const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//     const text = `I just claimed ${shareAmount} USDC from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸
// This was a time-limited & user-limited FCFS airdrop (first come, first served).

// Mint your identity and unlock full access rewards, task, leaderboard, airdrop and info section💙🟦`;
//     const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
//     try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
    
//     // Updated: Only set state, do not save to storage
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
//       if (data.success) {
//         setIsVerified(true);
//         // Removed localStorage setItem
//         setIsVerifying(false);
//       } else {
//         setVerifyError(true);
//         setErrorTimer(3);
//       }
//     } catch {
//       setVerifyError(true);
//       setErrorTimer(3);
//     }
//   };

//   // *** UPDATED ONCLAIM FUNCTION WITH STRICT CHECK ***
// const onClaim = async () => {
//     // SECURITY: Ensure user is on Warpcast AND has FID
//     if (!isWarpcast || !isFarcasterUser) {
//       setFarcasterError("Open in Warpcast App");
//       return;
//     }
      
//     setFarcasterError("");

//     try {
//       // ১. আপনার ব্যাকএন্ড এপিআই থেকে সিগনেচার নিয়ে আসা
//       const signResponse = await fetch('/api/sign-claim', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userWallet: address, // Wagmi থেকে পাওয়া ইউজারের অ্যাড্রেস
//           fid: userData.fid,
//           giveawayId: activeGiveawayId,
//         }),
//       });

//       const signData = await signResponse.json();

//       if (!signResponse.ok || !signData.signature) {
//         throw new Error(signData.message || "Failed to get signature");
//       }

//       // ২. স্মার্ট কন্ট্রাক্টে কল করা (args এ signature যোগ করা হয়েছে)
//       const hash = await writeContractAsync({
//         address: CONTRACT_ADDRESS as `0x${string}`,
//         abi: ABI,
//         functionName: "claimGiveaway",
//         args: [
//           BigInt(activeGiveawayId), 
//           BigInt(userData.fid), 
//           signData.signature as `0x${string}` // ব্যাকএন্ড থেকে আসা সিগনেচার
//         ],
//       });

//       if (hash) {
//         setLastClaimedAmount(rewardAmountFormatted); 
//         setShowSuccessModal(true);
//         setTimeout(() => {
//           refetchDetails();
//           refetchStats();
//           refetchWinners();
//         }, 2000);
//       }
//     } catch (error: any) {
//       // এরর হ্যান্ডেলিং
//       if (error.code === 4001 || 
//           error.message?.includes("User rejected") || 
//           error.message?.includes("denied") || 
//           error.name === 'UserRejectedRequestError') {
          
//           setFarcasterError("Transaction cancelled by user");
//           setTimeout(() => setFarcasterError(""), 3000);
//       } else {
//           console.error("Transaction Failed:", error);
//           setFarcasterError(error.message || "Transaction failed. Try again.");
//           setTimeout(() => setFarcasterError(""), 3000);
//       }
//     }
//   };

//   if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

//   // *** STRICT BUTTON RENDERING LOGIC ***
//   const renderActionButton = () => {
//     if (!isWarpcast || !isFarcasterUser) {
//       return (
//         <button 
//           className={styles.primaryBtn} 
//           disabled={true} 
//           style={{ 
//             opacity: 0.5, 
//             cursor: "not-allowed", 
//             backgroundColor: "#2a2a2a", // Dark gray
//             color: "#888",
//             border: "1px solid #444",
//             pointerEvents: "none"
//           }}
//         >
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
//         return (
//           <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>
//               Share to Unlock +1 <Share2 size={16} />
//           </button>
//         );
//       }
//       if (hasShared && !isVerified) {
//          if (verifyError) {
//              return (
//                <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled>Try Again in {errorTimer}s</button>
//              );
//          }
//          return (
//             <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>
//               {isVerifying ? "Verifying..." : "Verify Share"}
//               {!isVerifying && <ShieldCheck size={16} />}
//             </button>
//          );
//       }
//       if (isVerified) {
//         return (
//           <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>
//             {isClaiming ? "Sending..." : "Claim Bonus"}
//             {!isClaiming && <Zap size={16} fill="currentColor" />}
//           </button>
//         );
//       }
//     }
//     return (
//       <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>
//     );
//   };

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
//       <nav className={styles.topBar}>
//         <div className={styles.userInfoSmall}>
//                       <div className={styles.avatarMini}>
//                         <Image 
//                           src={userData.pfpUrl} 
//                           alt="pfp" 
//                           width={34} 
//                           height={34} 
//                           className={styles.pfpRound} 
//                           unoptimized 
//                         />
//                         </div>
//           <div className={styles.userInfo}>
//              <span className={styles.username}>{userData.displayName}</span>
//           </div>
//         </div>
//         <button className={styles.themeBtn} onClick={toggleTheme}>
//           {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
//         </button>
//       </nav>

//       <main className={styles.main}>
        
//         {isActiveGiveaway ? (
//             <div className={styles.giveawayCard}>
//               <div className={styles.liveTag}><span className={styles.pulseDot}></span> LIVE DROP</div>
//               <h2 className={styles.cardTitle}>EXCLUSIVE DROP</h2>
              
//               <div className={styles.timerWrapper}>
//                  <div className={styles.timerDigit}>{String(timeLeft.hours).padStart(2, '0')}</div>
//                  <span className={styles.timerSep}>:</span>
//                  <div className={styles.timerDigit}>{String(timeLeft.mins).padStart(2, '0')}</div>
//                  <span className={styles.timerSep}>:</span>
//                  <div className={styles.timerDigit}>{String(timeLeft.secs).padStart(2, '0')}</div>
//               </div>

//               <p className={styles.cardSubtitle}>Ends soon! Claim before it's gone.</p>
//             </div>
//         ) : (
//             <div className={`${styles.giveawayCard} ${styles.inactiveCard}`}>
//                <div className={styles.endedIconWrapper}>
//                    {isFull ? <Users size={24} /> : <Clock size={24} />}
//                </div>
               
//                <div className={`${styles.statusBadge} ${isFull ? styles.soldOutTag : styles.endedTag}`}>
//     {isFull ? "ALL CLAIMED" : "TIME EXPIRED"}
// </div>

//                <h2 className={styles.cardTitle}>AIRDROP ENDED</h2>
//                <p className={styles.cardSubtitle}>
//                   This event is closed. See the winner list below. <br/> Please Wait for the next airdrop live soon.
//                </p>
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
//                 <span className={styles.statValue}>{rewardAmountFormatted} USDC</span>
//             </div>
//           </div>
//         </div>

//         {isActiveGiveaway && (
//             <div className={styles.actionZone}>
//               <div className={styles.balanceHeader}>
//                 <span className={styles.totalLabel}>Total Earnings</span>
//                 <span className={styles.totalValue}>{totalWonFormatted} USDC</span>
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

//         <div className={styles.leaderboardSection}>
//           <div 
//              className={`${styles.leaderboardHeader} ${!isActiveGiveaway ? styles.headerClickable : ''}`}
//              onClick={() => !isActiveGiveaway && setShowHistoryList(!showHistoryList)}
//           >
//              <h3 className={styles.leaderboardTitle}>
//                 {isActiveGiveaway ? <Sparkles size={16} className={styles.titleIcon}/> : <History size={16} className={styles.titleIcon}/>} 
//                 {isActiveGiveaway ? "Recent Winners" : "Winner History"}
//              </h3>
             
//              {!isActiveGiveaway && (
//                 <div className={styles.historyMeta}>
//                    <span className={styles.endDateBadge}>Ended: {formattedEndDate}</span>
//                    {showHistoryList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                 </div>
//              )}
//           </div>

//           {(isActiveGiveaway || showHistoryList) && (
//              <div className={styles.leaderboardList}>
//                {uniqueWinnersList.length > 0 ? (
//                  uniqueWinnersList.map((winner, idx) => {
//                    const { fid, totalWinAmount } = winner;
//                    const isMe = fid === userData.fid && userData.fid !== 0;
//                    const profile = winnersProfiles[fid];
                   
//                    // *** CHANGED: Improved display name logic ***
//                    // Jodi profile data thake tahole oita use korbe, na thakle clean 'User' dekhabe
//                    // 'Farcaster ID: ...' text remove kora hoyeche
//                    const displayName = (isMe && userData.displayName !== "Guest") 
//                      ? userData.displayName 
//                      : (profile?.displayName || `User`);
                     
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
//                        <span className={styles.winnerAmount}>+{totalWinAmount} $</span>
//                      </div>
//                    );
//                  })
//                ) : (
//                  <div className={styles.emptyState}>
//                     <div className={styles.emptyIcon}>👻</div>
//                     <p>No winners yet.</p>
//                  </div>
//                )}
//              </div>
//           )}
//         </div>
//       </main>

//       {showSuccessModal && (
//         <div className={styles.overlay}>
//           <div className={styles.modal}>
//             <button className={styles.close} onClick={() => setShowSuccessModal(false)}><X size={18}/></button>
//             <div className={styles.successIcon}><Check size={28} strokeWidth={4} /></div>
//             <h3 className={styles.modalTitle}>Success!</h3>
//             <p className={styles.modalText}>You received <span className={styles.gradientText}>{lastClaimedAmount} USDC</span></p>
//             {count === 1 && !isVerified && (
//                <button className={styles.modalShareBtn} onClick={handleShare}>
//                   Share to Unlock Bonus <Share2 size={16}/>
//                </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











































"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
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

interface WinnerProfile {
  fid: number;
  displayName: string;
  pfpUrl: string;
}

export default function GiveawayPage(props: any) { 
  const passedId = props.giveawayId;
  
  // প্রাথমিক স্টেট ০ বা props থেকে নেওয়া আইডি
  const [activeGiveawayId, setActiveGiveawayId] = useState<number>(passedId || 0);

  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
  const [isEnded, setIsEnded] = useState(false);
  const [isWarpcast, setIsWarpcast] = useState(false);

  const tokenSymbol = "$JESSE"; // অথবা যেই টোকেন দিচ্ছেন

  // Fetch Latest ID from Blockchain
  const { data: latestId } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getLastGiveawayId", 
    query: { 
      // Only fetch if no specific ID is currently active (initially 0)
      enabled: activeGiveawayId === 0 
    }
  });

  // *** URL Param Logic (Vanilla JS) ***
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryId = params.get("giveawayId");
      
      if (passedId) {
         setActiveGiveawayId(passedId);
      } else if (queryId) {
         setActiveGiveawayId(Number(queryId));
      } else if (latestId && activeGiveawayId === 0) {
         setActiveGiveawayId(Number(latestId));
      }
    }
  }, [passedId, latestId, activeGiveawayId]);

  // History Toggle State
  const [showHistoryList, setShowHistoryList] = useState(true);

  // User Data (SDK)
  const [userData, setUserData] = useState({
    displayName: "Guest",
    pfpUrl: "https://placehold.co/100x100?text=Guest",
    fid: 0
  });

  const [hasShared, setHasShared] = useState(false); 
  const [isVerifying, setIsVerifying] = useState(false); 
  const [isVerified, setIsVerified] = useState(false); 
  const [verifyError, setVerifyError] = useState(false); 
  const [errorTimer, setErrorTimer] = useState(0); 
  const [farcasterError, setFarcasterError] = useState(""); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastClaimedAmount, setLastClaimedAmount] = useState("0");

  const [winnersProfiles, setWinnersProfiles] = useState<Record<number, WinnerProfile>>({});

  const { address } = useAccount();
  const { writeContractAsync, isPending: isClaiming } = useWriteContract();

  // --- Contract Reads (Using activeGiveawayId) ---
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

  // --- Derived Data ---
  const [_tokenAddr, amount, current, max, endTime, active] = (details as any) || [];
  const [totalWon, claimCount, currentLimit] = (userStats as any) || [0n, 0n, 2n]; 
    
  const count = Number(claimCount || 0);
  const limit = Number(currentLimit || 2);
  const isFull = Number(current || 0) >= Number(max || 0);
    
  // Amounts USDC
  // const rewardAmountRaw = amount ? Number(formatUnits(amount, 6)) : 0;
  // const rewardAmountFormatted = rewardAmountRaw.toString();
  // const totalWonFormatted = formatUnits(totalWon || 0n, 6);

  //Ammount 18 Decimal Token
  const rewardAmountRaw = amount ? Number(formatUnits(amount, 18)) : 0;
  const rewardAmountFormatted = rewardAmountRaw.toString();
  const totalWonFormatted = formatUnits(totalWon || 0n, 18);

  // Logic for Active/Ended State
  const isActiveGiveaway = active && !isEnded && !isFull;

  // Format Date for History
  const formattedEndDate = useMemo(() => {
    if (!endTime) return "";
    const date = new Date(Number(endTime) * 1000);
    return date.toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
  }, [endTime]);

  // List Logic
  const displayedListRaw = useMemo(() => {
    return currentWinnersFids ? [...(currentWinnersFids as bigint[])].reverse() : [];
  }, [currentWinnersFids]);

  // *** LOGIC: Merge Duplicate Winners & Sum Amounts ***
  const uniqueWinnersList = useMemo(() => {
      const winnerMap = new Map();

      displayedListRaw.forEach((fidBN) => {
         const fid = Number(fidBN);
         if (winnerMap.has(fid)) {
            winnerMap.set(fid, winnerMap.get(fid) + 1);
         } else {
            winnerMap.set(fid, 1);
         }
      });

      const mergedList = Array.from(winnerMap.entries()).map(([fid, winCount]) => ({
         fid,
         totalWinAmount: (rewardAmountRaw * winCount).toFixed(3) 
      }));

      // CHANGED: Removed .slice(0, 10) to show ALL winners
      // return mergedList;
      return mergedList.slice(0, 100);
  }, [displayedListRaw, rewardAmountRaw]);

  // Derived check for Farcaster User
  const isFarcasterUser = userData.fid > 0;

  // --- Initialization ---
  useEffect(() => {
    setIsMounted(true);
    sdk.actions.ready(); 
    
    if (document.body.classList.contains('light-mode')) setIsDarkMode(false);

    // *** STRICT USER AGENT CHECK ***
    if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent;
        setIsWarpcast(/Warpcast/i.test(ua));
    }

    const loadContext = async () => {
      try {
        const ctx = await sdk.context;
        if (ctx?.user) {
          setUserData({
            displayName: ctx.user.displayName || ctx.user.username || "User",
            pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User",
            fid: ctx.user.fid || 0
          });
        }
      } catch (err) {
        console.error("SDK Context Error:", err);
      }
    };
    loadContext();
  }, [activeGiveawayId, address]);


  // --- API CALL LOGIC (OPTIMIZED FOR BULK & FULL LIST) ---
  const fetchProfiles = useCallback(async (winners: {fid: number}[]) => {
    if (winners.length === 0) return;

    // Filter out FIDs we already have or current user
    const missingFids = winners
      .map(w => w.fid)
      .filter(fid => !winnersProfiles[fid] && fid !== userData.fid);

    if (missingFids.length === 0) return;

    // *** BATCHING LOGIC ***
    // Neynar / URL length limitations avoid korar jonno 50 ta kore chunk korchi
    const BATCH_SIZE = 50;
    const chunks = [];
    
    for (let i = 0; i < missingFids.length; i += BATCH_SIZE) {
        chunks.push(missingFids.slice(i, i + BATCH_SIZE));
    }

    // Process each chunk
    for (const chunk of chunks) {
        const fidsString = chunk.join(',');

        try {
            const response = await fetch(`/api/users?fid=${fidsString}`);
            
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

                // Fill in any that failed to fetch with fallbacks
                chunk.forEach(fid => {
                   if (!newFetchedData[fid]) {
                       newFetchedData[fid] = {
                           fid,
                           displayName: `User`,
                           pfpUrl: `https://avatar.vercel.sh/${fid}?size=60`
                       };
                   }
                });

                setWinnersProfiles(prev => ({ ...prev, ...newFetchedData }));
            }
        } catch (error) {
            console.error("Batch fetch error:", error);
        }
    }
  }, [winnersProfiles, userData.fid]);

  useEffect(() => {
    if (uniqueWinnersList.length > 0) {
      fetchProfiles(uniqueWinnersList);
    }
  }, [uniqueWinnersList, fetchProfiles]);


  // --- Helper Effects ---
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

  useEffect(() => {
    if (!isActiveGiveaway) {
        setShowHistoryList(true);
    }
  }, [isActiveGiveaway]);

  // --- Handlers ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleShare = () => {
    const shareAmount = Number(totalWonFormatted) > 0 ? totalWonFormatted : rewardAmountFormatted;
    const appUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
    const text = `I just claimed ${shareAmount} ${tokenSymbol} from the Exclusive Drop in the Airdrop section on Personal ID Mint 💸
This was a time-limited & user-limited FCFS airdrop (first come, first served).

Mint your identity and unlock full access rewards, task, leaderboard, airdrop and info section💙🟦`;
    const castIntentUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(`${appUrl}?fid=${userData.fid}`)}`;
    try { sdk.actions.openUrl(castIntentUrl); } catch { window.open(castIntentUrl, "_blank"); }
    
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
      if (data.success) {
        setIsVerified(true);
        setIsVerifying(false);
      } else {
        setVerifyError(true);
        setErrorTimer(3);
      }
    } catch {
      setVerifyError(true);
      setErrorTimer(3);
    }
  };

  const onClaim = async () => {
    if (!isWarpcast || !isFarcasterUser) {
      setFarcasterError("Open in Warpcast App");
      return;
    }
      
    setFarcasterError("");

    try {
      const signResponse = await fetch('/api/sign-claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userWallet: address, 
          fid: userData.fid,
          giveawayId: activeGiveawayId,
        }),
      });

      const signData = await signResponse.json();

      if (!signResponse.ok || !signData.signature) {
        throw new Error(signData.message || "Failed to get signature");
      }

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "claimGiveaway",
        args: [
          BigInt(activeGiveawayId), 
          BigInt(userData.fid), 
          signData.signature as `0x${string}` 
        ],
      });

      if (hash) {
        setLastClaimedAmount(rewardAmountFormatted); 
        setShowSuccessModal(true);
        setTimeout(() => {
          refetchDetails();
          refetchStats();
          refetchWinners();
        }, 2000);
      }
    } catch (error: any) {
      if (error.code === 4001 || 
          error.message?.includes("User rejected") || 
          error.message?.includes("denied") || 
          error.name === 'UserRejectedRequestError') {
          
          setFarcasterError("Transaction cancelled by user");
          setTimeout(() => setFarcasterError(""), 3000);
      } else {
          console.error("Transaction Failed:", error);
          setFarcasterError(error.message || "Transaction failed. Try again.");
          setTimeout(() => setFarcasterError(""), 3000);
      }
    }
  };

  if (!isMounted) return <div className={styles.loadingPage}><Loader2 className={styles.spinner} size={30}/></div>;

  const renderActionButton = () => {
    if (!isWarpcast || !isFarcasterUser) {
      return (
        <button 
          className={styles.primaryBtn} 
          disabled={true} 
          style={{ 
            opacity: 0.5, 
            cursor: "not-allowed", 
            backgroundColor: "#2a2a2a",
            color: "#888",
            border: "1px solid #444",
            pointerEvents: "none"
          }}
        >
          Farcaster Users Only <Lock size={16} style={{marginLeft: 8}} />
        </button>
      );
    }

    if (count === 0) {
      return (
        <button className={styles.primaryBtn} onClick={onClaim} disabled={isClaiming || isFull}>
          {isClaiming ? "Sending..." : isFull ? "Full" : "Claim Reward"}
          {!isClaiming && !isFull && <Zap size={16} fill="currentColor" />}
        </button>
      );
    }
    
    if (count === 1 && count < limit) {
      if (!hasShared && !isVerified) {
        return (
          <button className={`${styles.primaryBtn} ${styles.shareBtn}`} onClick={handleShare}>
              Share to Unlock +1 <Share2 size={16} />
          </button>
        );
      }
      if (hasShared && !isVerified) {
         if (verifyError) {
             return (
               <button className={`${styles.primaryBtn} ${styles.errorBtn}`} disabled>Try Again in {errorTimer}s</button>
             );
         }
         return (
            <button className={`${styles.primaryBtn} ${styles.verifyBtn}`} onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Share"}
              {!isVerifying && <ShieldCheck size={16} />}
            </button>
         );
      }
      if (isVerified) {
        return (
          <button className={`${styles.primaryBtn} ${styles.bonusBtn}`} onClick={onClaim} disabled={isClaiming || isFull}>
            {isClaiming ? "Sending..." : "Claim Bonus"}
            {!isClaiming && <Zap size={16} fill="currentColor" />}
          </button>
        );
      }
    }
    return (
      <button className={styles.primaryBtn} disabled>Completed <Lock size={16} /></button>
    );
  };

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
      <nav className={styles.topBar}>
        <div className={styles.userInfoSmall}>
                      <div className={styles.avatarMini}>
                        <Image 
                          src={userData.pfpUrl} 
                          alt="pfp" 
                          width={34} 
                          height={34} 
                          className={styles.pfpRound} 
                          unoptimized 
                        />
                        </div>
          <div className={styles.userInfo}>
             <span className={styles.username}>{userData.displayName}</span>
          </div>
        </div>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </nav>

      <main className={styles.main}>
        
        {isActiveGiveaway ? (
            <div className={styles.giveawayCard}>
              <div className={styles.liveTag}><span className={styles.pulseDot}></span> LIVE DROP</div>
              <h2 className={styles.cardTitle}>EXCLUSIVE DROP</h2>
              
              <div className={styles.timerWrapper}>
                 <div className={styles.timerDigit}>{String(timeLeft.hours).padStart(2, '0')}</div>
                 <span className={styles.timerSep}>:</span>
                 <div className={styles.timerDigit}>{String(timeLeft.mins).padStart(2, '0')}</div>
                 <span className={styles.timerSep}>:</span>
                 <div className={styles.timerDigit}>{String(timeLeft.secs).padStart(2, '0')}</div>
              </div>

              <p className={styles.cardSubtitle}>Ends soon! Claim before it's gone.</p>
            </div>
        ) : (
            <div className={`${styles.giveawayCard} ${styles.inactiveCard}`}>
               <div className={styles.endedIconWrapper}>
                   {isFull ? <Users size={24} /> : <Clock size={24} />}
               </div>
               
               <div className={`${styles.statusBadge} ${isFull ? styles.soldOutTag : styles.endedTag}`}>
                  {isFull ? "ALL CLAIMED" : "TIME EXPIRED"}
               </div>

               <h2 className={styles.cardTitle}>AIRDROP ENDED</h2>
               <p className={styles.cardSubtitle}>
                  This event is closed. See the winner list below. <br/> Please Wait for the next airdrop live soon.
               </p>
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
                <span className={styles.statValue}>{rewardAmountFormatted} {tokenSymbol}</span>
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

        <div className={styles.leaderboardSection}>
          <div 
             className={`${styles.leaderboardHeader} ${!isActiveGiveaway ? styles.headerClickable : ''}`}
             onClick={() => !isActiveGiveaway && setShowHistoryList(!showHistoryList)}
          >
             <h3 className={styles.leaderboardTitle}>
                {isActiveGiveaway ? <Sparkles size={16} className={styles.titleIcon}/> : <History size={16} className={styles.titleIcon}/>} 
                {isActiveGiveaway ? "Recent Winners" : "Winner History"}
             </h3>
             
             {!isActiveGiveaway && (
                <div className={styles.historyMeta}>
                   <span className={styles.endDateBadge}>Ended: {formattedEndDate}</span>
                   {showHistoryList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
             )}
          </div>

          {(isActiveGiveaway || showHistoryList) && (
             <div className={styles.leaderboardList}>
               {uniqueWinnersList.length > 0 ? (
                 uniqueWinnersList.map((winner, idx) => {
                   const { fid, totalWinAmount } = winner;
                   const isMe = fid === userData.fid && userData.fid !== 0;
                   const profile = winnersProfiles[fid];
                   
                   const displayName = (isMe && userData.displayName !== "Guest") 
                     ? userData.displayName 
                     : (profile?.displayName || `User`);
                     
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
                       <span className={styles.winnerAmount}>+{totalWinAmount} $</span>
                     </div>
                   );
                 })
               ) : (
                 <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👻</div>
                    <p>No winners yet.</p>
                 </div>
               )}
             </div>
          )}
        </div>
      </main>

      {showSuccessModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.close} onClick={() => setShowSuccessModal(false)}><X size={18}/></button>
            <div className={styles.successIcon}><Check size={28} strokeWidth={4} /></div>
            <h3 className={styles.modalTitle}>Success!</h3>
            <p className={styles.modalText}>You received <span className={styles.gradientText}>{lastClaimedAmount} {tokenSymbol}</span></p>
            {count === 1 && !isVerified && (
               <button className={styles.modalShareBtn} onClick={handleShare}>
                  Share to Unlock Bonus <Share2 size={16}/>
               </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}