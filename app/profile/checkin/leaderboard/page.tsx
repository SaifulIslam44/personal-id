// "use client";

// import { useState, useEffect } from "react";
// import { useReadContract } from "wagmi";
// import { formatUnits } from "viem";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
// import styles from "./leaderboard.module.css";
// import Image from "next/image";
// import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"; // আইকন যোগ করা হয়েছে
// import miniApp from "@farcaster/miniapp-sdk";

// interface WinnerData {
//   address: string;
//   winnings: number;
//   profileName: string;
//   pfp: string;
// }

// export default function LeaderboardPage() { // প্রোস্প সরিয়ে দেওয়া হয়েছে
//   const [leaderboard, setLeaderboard] = useState<WinnerData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
  
//   // initialLightMode এর বদলে সরাসরি ডিফল্ট ভ্যালু সেট করুন
//   const [isDarkMode, setIsDarkMode] = useState(true); 

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
  
  
//   const [userData, setUserData] = useState({
//     displayName: "User",
//     pfpUrl: "https://placehold.co/100x100?text=User"
//   });

//   // Body class toggle for global styles
//   useEffect(() => {
//     if (!isDarkMode) {
//       document.body.classList.add('light-mode');
//     } else {
//       document.body.classList.remove('light-mode');
//     }
//   }, [isDarkMode]);

//   useEffect(() => { 
//     setIsMounted(true); 
//     miniApp.context.then((ctx) => {
//       if (ctx?.user) {
//         setUserData({
//           displayName: ctx.user.displayName || ctx.user.username || "User",
//           pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User"
//         });
//       }
//     }).catch(() => {});
//   }, []);

//   const { data: contractData } = useReadContract({
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "getLeaderboard",
//   });

//   useEffect(() => {
//     const syncLeaderboard = async () => {
//       if (contractData) {
//         const [addresses, amounts, isEnabled] = contractData as [string[], bigint[], boolean];
//         if (isEnabled && addresses.length > 0) {
//           setLoading(true);
//           const rawWinners = addresses.map((addr, i) => ({
//             address: addr.toLowerCase(),
//             winnings: parseFloat(formatUnits(amounts[i], 6)),
//           })).sort((a, b) => b.winnings - a.winnings);

//           try {
//             const res = await fetch(`/api/get-profiles?addresses=${addresses.join(",")}`);
//             const profileMap = await res.json();
//             const finalData = rawWinners.map(winner => ({
//               ...winner,
//               profileName: profileMap[winner.address]?.profileName || `User_${winner.address.slice(-4)}`,
//               pfp: profileMap[winner.address]?.pfp || "https://placehold.co/100x100?text=?"
//             }));
//             setLeaderboard(finalData);
//           } catch (e) {
//             console.error(e);
//           }
//           setLoading(false);
//         }
//       }
//     };
//     syncLeaderboard();
//   }, [contractData]);

//   // Pagination Logic
//   const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = leaderboard.slice(indexOfFirstItem, indexOfLastItem);

//   if (!isMounted) return null;

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//       {/* Top Bar - Profile & Theme Toggle */}
//       <nav className={styles.topBar}>
//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={userData.pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
//           </div>
//           <span className={styles.profileName}>{userData.displayName}</span>
//         </div>
//         <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
//           {isDarkMode ? <Moon size={18} className={styles.iconBlue} /> : <Sun size={18} className={styles.iconOrange} />}
//         </button>
//       </nav>

//       <main className={styles.mainContent}>
//         <header className={styles.heroHeader}>
//         <h1 className={styles.title}>🏆 WINING LEADERBOARD 🏆</h1>
//           <p className={styles.subTitle}>Top earners and lucky winners of the Spin & Leaderboard</p>
//         </header>

//         {/* Board Section - Directly on Container */}
//         <div className={styles.compactBoard}>
//           <div className={styles.smallHeader}>
//             <span>RANK</span>
//             <span>USER</span>
//             <span className={styles.textRight}>TOTAL WON</span>
//           </div>

//           <div className={styles.rowsContainer}>
//             {loading ? (
//               <div className={styles.loaderSmall}>Loading Leaderboard ...</div>
//             ) : currentItems.length > 0 ? (
//               currentItems.map((user, index) => {
//                 const actualRank = indexOfFirstItem + index;
//                 return (
//                   <div key={user.address} className={styles.smallRow}>
//                     <span className={styles.rankBadge}>
//                       {actualRank === 0 ? "🥇" : actualRank === 1 ? "🥈" : actualRank === 2 ? "🥉" : `#${actualRank + 1}`}
//                     </span>
                    
//                     <div className={styles.userInfoSmall}>
//                       <div className={styles.avatarMini}>
//                         <Image 
//                           src={user.pfp} 
//                           alt="pfp" 
//                           width={34} 
//                           height={34} 
//                           className={styles.pfpRound} 
//                           unoptimized 
//                         />
//                       </div>
//                       <span className={styles.userText}>{user.profileName}</span>
//                     </div>
                    
//                     <span className={styles.amountSmall}>
//                       ${user.winnings.toFixed(2)} <small>USDC</small>
//                     </span>
//                   </div>
//                 );
//               })
//             ) : (
//               <p className={styles.emptySmall}>No winners yet.</p>
//             )}
//           </div>

//           {/* Pagination Controls - UI matching your image */}
//           {totalPages > 1 && (
//             <div className={styles.paginationWrapper}>
//                <div className={styles.paginationRight}>
//                   <button 
//                     className={styles.pBtn} 
//                     onClick={() => setCurrentPage(1)} 
//                     disabled={currentPage === 1}
//                   >
//                     First
//                   </button>
//                   <button 
//                     className={styles.pBtnIcon} 
//                     onClick={() => setCurrentPage(prev => prev - 1)} 
//                     disabled={currentPage === 1}
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
//                   <div className={styles.pStatus}>
//                     Page {currentPage} of {totalPages}
//                   </div>
//                   <button 
//                     className={styles.pBtnIcon} 
//                     onClick={() => setCurrentPage(prev => prev + 1)} 
//                     disabled={currentPage === totalPages}
//                   >
//                     <ChevronRight size={16} color="#0052ff" />
//                   </button>
//                   <button 
//                     className={styles.pBtnActive} 
//                     onClick={() => setCurrentPage(totalPages)} 
//                     disabled={currentPage === totalPages}
//                   >
//                     Last
//                   </button>
//                </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }























"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";
import styles from "./leaderboard.module.css";
import Image from "next/image";
import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"; // আইকন যোগ করা হয়েছে
import miniApp from "@farcaster/miniapp-sdk";

interface WinnerData {
  address: string;
  winnings: number;
  profileName: string;
  pfp: string;
}

export default function LeaderboardPage() { // প্রোস্প সরিয়ে দেওয়া হয়েছে
  const [leaderboard, setLeaderboard] = useState<WinnerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // initialLightMode এর বদলে সরাসরি ডিফল্ট ভ্যালু সেট করুন
  const [isDarkMode, setIsDarkMode] = useState(true); 

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;
  
  const [userData, setUserData] = useState({
    displayName: "User",
    pfpUrl: "https://placehold.co/100x100?text=User"
  });

  // Body class toggle for global styles
  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => { 
    setIsMounted(true); 
    miniApp.context.then((ctx) => {
      if (ctx?.user) {
        setUserData({
          displayName: ctx.user.displayName || ctx.user.username || "User",
          pfpUrl: ctx.user.pfpUrl || "https://placehold.co/100x100?text=User"
        });
      }
    }).catch(() => {});
  }, []);

const { data: contractData } = useReadContract({
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: ABI,
  functionName: "getLeaderboard",
  // এখানে টাইপ কাস্টিং ব্যবহার করা হয়েছে যাতে 'never' বা 'undefined' এরর না আসে
  args: [BigInt(offset), BigInt(itemsPerPage)], 
});


  useEffect(() => {
    const syncLeaderboard = async () => {
      if (contractData) {
        const [addresses, amounts, isEnabled] = contractData as [string[], bigint[], boolean];
        if (isEnabled && addresses.length > 0) {
          setLoading(true);
          const rawWinners = addresses.map((addr, i) => ({
            address: addr.toLowerCase(),
            winnings: parseFloat(formatUnits(amounts[i], 6)),
          })).sort((a, b) => b.winnings - a.winnings);

          try {
            const res = await fetch(`/api/get-profiles?addresses=${addresses.join(",")}`);
            const profileMap = await res.json();
            const finalData = rawWinners.map(winner => ({
              ...winner,
              profileName: profileMap[winner.address]?.profileName || `User_${winner.address.slice(-4)}`,
              pfp: profileMap[winner.address]?.pfp || "https://placehold.co/100x100?text=?"
            }));
            setLeaderboard(finalData);
          } catch (e) {
            console.error(e);
          }
          setLoading(false);
        } else {
          setLeaderboard([]); // যদি ডাটা না থাকে লিস্ট খালি করার জন্য
        }
      }
    };
    syncLeaderboard();
  }, [contractData]);


const totalPages = leaderboard.length === itemsPerPage 
                   ? currentPage + 1 
                   : currentPage;

const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const currentItems = leaderboard;

  if (!isMounted) return null;

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      {/* Top Bar - Profile & Theme Toggle */}
      <nav className={styles.topBar}>
        <div className={styles.profileSummary}>
          <div className={styles.miniPfpWrapper}>
            <Image src={userData.pfpUrl} alt="PFP" className={styles.miniPfp} width={28} height={28} unoptimized />
          </div>
          <span className={styles.profileName}>{userData.displayName}</span>
        </div>
        <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={18} className={styles.iconBlue} /> : <Sun size={18} className={styles.iconOrange} />}
        </button>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.heroHeader}>
        <h1 className={styles.title}>🏆 WINING LEADERBOARD 🏆</h1>
          <p className={styles.subTitle}>Top earners and lucky winners of the Spin & Leaderboard</p>
        </header>

        {/* Board Section - Directly on Container */}
        <div className={styles.compactBoard}>
          <div className={styles.smallHeader}>
            <span>RANK</span>
            <span>USER</span>
            <span className={styles.textRight}>TOTAL WON</span>
          </div>

          <div className={styles.rowsContainer}>
            {loading ? (
              <div className={styles.loaderSmall}>Loading Leaderboard ...</div>
            ) : currentItems.length > 0 ? (
              currentItems.map((user, index) => {
                const actualRank = indexOfFirstItem + index;
                return (
                  <div key={user.address} className={styles.smallRow}>
                    <span className={styles.rankBadge}>
                      {actualRank === 0 ? "🥇" : actualRank === 1 ? "🥈" : actualRank === 2 ? "🥉" : `#${actualRank + 1}`}
                    </span>
                    
                    <div className={styles.userInfoSmall}>
                      <div className={styles.avatarMini}>
                        <Image 
                          src={user.pfp} 
                          alt="pfp" 
                          width={34} 
                          height={34} 
                          className={styles.pfpRound} 
                          unoptimized 
                        />
                      </div>
                      <span className={styles.userText}>{user.profileName}</span>
                    </div>
                    
                    <span className={styles.amountSmall}>
                      ${user.winnings.toFixed(2)} <small>USDC</small>
                    </span>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptySmall}>No winners yet.</p>
            )}
          </div>

          {/* Pagination Controls - UI matching your image */}
          {totalPages > 1 && (
            <div className={styles.paginationWrapper}>
               <div className={styles.paginationRight}>
                  <button 
                    className={styles.pBtn} 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className={styles.pBtnIcon} 
                    onClick={() => setCurrentPage(prev => prev - 1)} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className={styles.pStatus}>
                    Page {currentPage} of {totalPages}
                  </div>
                  <button 
                    className={styles.pBtnIcon} 
                    onClick={() => setCurrentPage(prev => prev + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} color="#0052ff" />
                  </button>
                  <button 
                    className={styles.pBtnActive} 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}