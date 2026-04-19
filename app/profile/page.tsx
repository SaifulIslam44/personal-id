// // only for base network:

// "use client";

// import { useState, useEffect } from "react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useRouter } from "next/navigation";


// import miniApp from "@farcaster/miniapp-sdk";
// import Image from "next/image";
// import { Moon, Sun, ChevronLeft } from "lucide-react"; 
// import { useAccount, useReadContract, useSendTransaction } from "wagmi"; 
// import { getAddress, isAddress, encodeFunctionData, concat } from "viem"; 
// import { Attribution } from "ox/erc8021"; // Attribution নিন

// import styles from "./profile.module.css";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

// export default function ProfilePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const router = useRouter();
//   const { address, isConnected } = useAccount();

//   const [manualStatus, setManualStatus] = useState("");
//   const [loading, setLoading] = useState(false);
// const { sendTransactionAsync, isPending } = useSendTransaction();

//   useEffect(() => {
//     if (!isDarkMode) {
//       document.body.classList.add('light-mode');
//     } else {
//       document.body.classList.remove('light-mode');
//     }
//   }, [isDarkMode]);

//   useEffect(() => {
//     const loadContext = async () => {
//       try {
//         const ctx = await miniApp.context;
//         setFrameContext(ctx);
//       } catch (err) {
//         console.error("MiniApp context error:", err);
//       }
//     };
//     loadContext();
//   }, []);

//   // ডিফল্ট PFP যদি ইমেজ না থাকে
//   const DEFAULT_PFP = "https://placehold.co/400x400/0052FF/ffffff?text=?";

//   const user = {
//     fid: context?.user?.fid || frameContext?.user?.fid,
//     displayName: context?.user?.displayName || frameContext?.user?.displayName || "Base User",
//     username: context?.user?.username || frameContext?.user?.username || "base.eth",
//     pfpUrl: (context?.user?.pfpUrl && context.user.pfpUrl !== "") 
//             ? context.user.pfpUrl 
//             : (frameContext?.user?.pfpUrl && frameContext.user.pfpUrl !== "") 
//             ? frameContext.user.pfpUrl 
//             : DEFAULT_PFP,
//   };

//   const { data: currentMintFee } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS as `0x${string}`,
//     functionName: "mintFee",
//   });

//   const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [address as `0x${string}`],
//     query: { enabled: isConnected && !!address },
//   });






//   // useEffect(() => {
//   //   if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//   //     router.replace("/profile/checkin");
//   //   }
//   // }, [nftBalance, isConnected, router]);


// useEffect(() => {
//     if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//       router.replace("/profile/checkin/info");
//     }
//   }, [nftBalance, isConnected, router]);



//   const handleMint = async () => {
//     if (!address || !user.fid) return;
//     setManualStatus("Transaction in Progress...");
//     setLoading(true);

//     // ১. রেফারার লজিক (আপনার যা ছিল তাই)
//     const savedRef = localStorage.getItem("referrer_address");
//     let finalReferrer: `0x${string}` = "0x0000000000000000000000000000000000000000";

//     if (savedRef && isAddress(savedRef)) {
//       const formattedRef = getAddress(savedRef);
//       if (formattedRef.toLowerCase() !== address.toLowerCase()) {
//         finalReferrer = formattedRef;
//       }
//     }

//     try {
//       const metadataURL = `${window.location.origin}/api/metadata/${user.fid}`;

//       // 🔥 ২. ফাংশন ডাটা এনকোড করা 🔥
//       const functionData = encodeFunctionData({
//         abi: ABI,
//         functionName: "mintID",
//         args: [metadataURL, finalReferrer, BigInt(user.fid)],
//       });

//       // 🔥 ৩. বিল্ডার কোড সাফিক্স তৈরি করা 🔥
//       const builderSuffix = Attribution.toDataSuffix({
//         codes: ["bc_bmhx0p43"], // আপনার সঠিক কোড
//       });

//       // 🔥 ৪. ডাটা জোড়া লাগানো (Function + Builder Code) 🔥
//       const finalCalldata = concat([functionData, builderSuffix]);

//       // 🔥 ৫. ট্রানজেকশন পাঠানো 🔥
//       const hash = await sendTransactionAsync({
//         to: CONTRACT_ADDRESS as `0x${string}`,
//         value: currentMintFee as bigint, // ফি পাঠানো
//         data: finalCalldata, // 👈 এটাই আসল কাজ করছে
//       });

//       if (hash) {
//         setManualStatus("Mint Successful! Redirecting...");
//         console.log("Tx Hash:", hash);
//         setTimeout(() => router.push("/profile/checkin"), 2000);
//       }

//     } catch (error: any) {
//       console.error("Mint Error:", error);
//       setManualStatus(
//         error.message?.includes("rejected") || error.code === 4001
//           ? "Transaction Declined"
//           : "Mint Failed"
//       );
//       setLoading(false);
//     }
//   };

//   // const isProfileLoading = (isConnected && !address) || isBalanceLoading;
//   const isProfileLoading = (isConnected && !address) || isBalanceLoading || (!loading && nftBalance !== undefined && (nftBalance as bigint) > 0n);

//   if (!isConnected || isProfileLoading) {
//     return (
//       <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Loading Profile...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
//       {/* Top Bar */}
//       <nav className={styles.topBar}>

//       <button 
//           className={styles.backButton} 
//           onClick={() => router.push("/profile/checkin")}
//         >
//           <ChevronLeft size={20} />
//         </button>


//         <div className={styles.profileSummary}>
//           <div className={styles.miniPfpWrapper}>
//             <Image src={user.pfpUrl} alt="PFP" className={styles.miniPfp} width={24} height={24} unoptimized />
//           </div>
//           <span className={styles.profileName}>{user.displayName}</span>
//         </div>
//         <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
//           {isDarkMode ? <Moon size={16} className={styles.iconBlue} /> : <Sun size={16} className={styles.iconOrange} />}
//         </button>
//       </nav>

//       {/* Header Section */}
// <div className={styles.headerSection}>
//         <h1 className={styles.title}>Personal Onchain ID</h1>
//         <p className={styles.subtitle}>
//           Mint ID to unlock Daily Check-in & Tasks, This is the key of mini app to access all features.
//           <br />
//           <span className={styles.referralNote}>
//             (Referrals count only after the invited user mints their ID)
//           </span>
//         </p>
//       </div>
// {/* Personal Onchain ID */}
//       {/* Premium Compact Card */}
//       <div className={styles.premiumCard}>
//         <div className={styles.cardContent}>
          
//           {/* Left: Profile Image */}
//           <div className={styles.pfpContainer}>
//             <Image 
//               src={user.pfpUrl} 
//               alt="Profile" 
//               className={styles.cardPfp} 
//               width={80} 
//               height={80} 
//               unoptimized
//             />
//           </div>

//           {/* Right: User Details */}
//           <div className={styles.cardDetails}>
//             <h2 className={styles.cardName}>{user.displayName}</h2>
//             <p className={styles.cardHandle}>@{user.username}</p>
//             <p className={styles.cardFid}>FID: {user.fid}</p>
            
//             <div className={styles.onchainBadgeWrapper}>
//               <span className={styles.onchainBadge}>Onchain Identity</span>
//             </div>
//           </div>

//         </div>

//         {/* Bottom Verified Badge */}
//         <div className={styles.verifiedBadge}>
//           VERIFIED PIM USER
//         </div>
//       </div>

//       {/* Mint Button Section */}
//       <div className={styles.mintWrapper}>
//         <button
//           className={styles.mintButton}
//           onClick={handleMint}
//           disabled={loading || isPending || (nftBalance ? (nftBalance as bigint) > 0n : false)}
//         >
//           {loading || isPending ? "Minting..." : "MINT ID NOW"}
//         </button>

//         {manualStatus && (
//           <p className={styles.manualStatusText}>{manualStatus}</p>
//         )}
//       </div>
//     </div>
//   );
// }





















//celo and base network:


"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";


import miniApp from "@farcaster/miniapp-sdk";
import Image from "next/image";
import { Moon, Sun, ChevronLeft } from "lucide-react"; 
import { useAccount, useReadContract, useSendTransaction, useConnect, useSwitchChain } from "wagmi"; 
import { getAddress, isAddress, encodeFunctionData, concat } from "viem"; 
import { Attribution } from "ox/erc8021"; // Attribution নিন

import styles from "./profile.module.css";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

export default function ProfilePage() {
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();
  const { address, chain, isConnected } = useAccount(); 
  const { connect, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain(); // 👈 এটি যোগ করুন

  const [manualStatus, setManualStatus] = useState("");
  const [loading, setLoading] = useState(false);
const { sendTransactionAsync, isPending } = useSendTransaction();



  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      // Warpcast বা Injected প্রোভাইডার খুঁজে বের করে অটো কানেক্ট করবে
      const injectedConnector = connectors.find(c => c.id === 'injected') || connectors[0];
      connect({ connector: injectedConnector });
    }
  }, [isConnected, connectors, connect]);

  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await miniApp.context;
        setFrameContext(ctx);
      } catch (err) {
        console.error("MiniApp context error:", err);
      }
    };
    loadContext();
  }, []);

  // ডিফল্ট PFP যদি ইমেজ না থাকে
  const DEFAULT_PFP = "https://placehold.co/400x400/0052FF/ffffff?text=?";

  const user = {
    fid: context?.user?.fid || frameContext?.user?.fid,
    displayName: context?.user?.displayName || frameContext?.user?.displayName || "Base User",
    username: context?.user?.username || frameContext?.user?.username || "base.eth",
    pfpUrl: (context?.user?.pfpUrl && context.user.pfpUrl !== "") 
            ? context.user.pfpUrl 
            : (frameContext?.user?.pfpUrl && frameContext.user.pfpUrl !== "") 
            ? frameContext.user.pfpUrl 
            : DEFAULT_PFP,
  };

  const { data: currentMintFee } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS as `0x${string}`,
    functionName: "mintFee",
  });

  const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: isConnected && !!address },
  });






  // useEffect(() => {
  //   if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
  //     router.replace("/profile/checkin");
  //   }
  // }, [nftBalance, isConnected, router]);


useEffect(() => {
    if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
      router.replace("/profile/checkin/info");
    }
  }, [nftBalance, isConnected, router]);



  const handleMint = async () => {
    if (!address || !user.fid) return;
    setManualStatus("Transaction in Progress...");
    setLoading(true);

    // ১. রেফারার লজিক (আপনার যা ছিল তাই)
    const savedRef = localStorage.getItem("referrer_address");
    let finalReferrer: `0x${string}` = "0x0000000000000000000000000000000000000000";

    if (savedRef && isAddress(savedRef)) {
      const formattedRef = getAddress(savedRef);
      if (formattedRef.toLowerCase() !== address.toLowerCase()) {
        finalReferrer = formattedRef;
      }
    }

    try {
      if (chain?.id !== 8453) {
      await switchChainAsync({ chainId: 8453 });
    }
      const metadataURL = `${window.location.origin}/api/metadata/${user.fid}`;

      // 🔥 ২. ফাংশন ডাটা এনকোড করা 🔥
      const functionData = encodeFunctionData({
        abi: ABI,
        functionName: "mintID",
        args: [metadataURL, finalReferrer, BigInt(user.fid)],
      });

      // 🔥 ৩. বিল্ডার কোড সাফিক্স তৈরি করা 🔥
      const builderSuffix = Attribution.toDataSuffix({
        codes: ["bc_bmhx0p43"], // আপনার সঠিক কোড
      });

      // 🔥 ৪. ডাটা জোড়া লাগানো (Function + Builder Code) 🔥
      const finalCalldata = concat([functionData, builderSuffix]);

      // 🔥 ৫. ট্রানজেকশন পাঠানো 🔥
      const hash = await sendTransactionAsync({
        to: CONTRACT_ADDRESS as `0x${string}`,
        value: currentMintFee as bigint, // ফি পাঠানো
        data: finalCalldata, // 👈 এটাই আসল কাজ করছে
      });

      if (hash) {
        setManualStatus("Mint Successful! Redirecting...");
        console.log("Tx Hash:", hash);
        setTimeout(() => router.push("/profile/checkin"), 2000);
      }

    } catch (error: any) {
      console.error("Mint Error:", error);
      setManualStatus(
        error.message?.includes("rejected") || error.code === 4001
          ? "Transaction Declined"
          : "Mint Failed"
      );
      setLoading(false);
    }
  };

  // const isProfileLoading = (isConnected && !address) || isBalanceLoading;
  const isProfileLoading = (isConnected && !address) || isBalanceLoading || (!loading && nftBalance !== undefined && (nftBalance as bigint) > 0n);

  if (!isConnected || isProfileLoading) {
    return (
      <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${!isDarkMode ? styles.lightMode : ""}`}>
      
      {/* Top Bar */}
      <nav className={styles.topBar}>

      <button 
          className={styles.backButton} 
          onClick={() => router.push("/profile/checkin")}
        >
          <ChevronLeft size={20} />
        </button>


        <div className={styles.profileSummary}>
          <div className={styles.miniPfpWrapper}>
            <Image src={user.pfpUrl} alt="PFP" className={styles.miniPfp} width={24} height={24} unoptimized />
          </div>
          <span className={styles.profileName}>{user.displayName}</span>
        </div>
        <button className={styles.themeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={16} className={styles.iconBlue} /> : <Sun size={16} className={styles.iconOrange} />}
        </button>
      </nav>

      {/* Header Section */}
<div className={styles.headerSection}>
        <h1 className={styles.title}>Personal Onchain ID</h1>
        <p className={styles.subtitle}>
          Mint ID to unlock Daily Check-in & Tasks, This is the key of mini app to access all features.
          <br />
          <span className={styles.referralNote}>
            (Referrals count only after the invited user mints their ID)
          </span>
        </p>
      </div>
{/* Personal Onchain ID */}
      {/* Premium Compact Card */}
      <div className={styles.premiumCard}>
        <div className={styles.cardContent}>
          
          {/* Left: Profile Image */}
          <div className={styles.pfpContainer}>
            <Image 
              src={user.pfpUrl} 
              alt="Profile" 
              className={styles.cardPfp} 
              width={80} 
              height={80} 
              unoptimized
            />
          </div>

          {/* Right: User Details */}
          <div className={styles.cardDetails}>
            <h2 className={styles.cardName}>{user.displayName}</h2>
            <p className={styles.cardHandle}>@{user.username}</p>
            <p className={styles.cardFid}>FID: {user.fid}</p>
            
            <div className={styles.onchainBadgeWrapper}>
              <span className={styles.onchainBadge}>Onchain Identity</span>
            </div>
          </div>

        </div>

        {/* Bottom Verified Badge */}
        <div className={styles.verifiedBadge}>
          VERIFIED PIM USER
        </div>
      </div>

      {/* Mint Button Section */}
      <div className={styles.mintWrapper}>
        <button
          className={styles.mintButton}
          onClick={handleMint}
          disabled={loading || isPending || (nftBalance ? (nftBalance as bigint) > 0n : false)}
        >
          {loading || isPending ? "Minting..." : "MINT ID NOW"}
        </button>

        {manualStatus && (
          <p className={styles.manualStatusText}>{manualStatus}</p>
        )}
      </div>
    </div>
  );
}



// ID: 375 changes