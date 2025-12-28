

// "use client";

// import { useState, useEffect } from "react";
// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import { useRouter } from "next/navigation";
// import { useAccount, useReadContract } from "wagmi";
// import { useSendCalls } from "wagmi";
// import { parseEther } from "viem";
// import sdk from "@farcaster/frame-sdk";
// import styles from "./profile.module.css";
// import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

// /* eslint-disable @next/next/no-img-element */

// export default function ProfilePage() {
//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);
//   const router = useRouter();
//   const { address, isConnected } = useAccount();

//   // ✅ States
//   const [isFollowed, setIsFollowed] = useState(false);
//   const [manualStatus, setManualStatus] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasShared, setHasShared] = useState(false);
 
//   const { sendCalls, isPending } = useSendCalls();

//   useEffect(() => {
//     const loadFarcaster = async () => {
//       try {
//         const ctx = await sdk.context;
//         setFrameContext(ctx);
//       } catch (err) {
//         console.error("Farcaster error:", err);
//       }
//     };
//     loadFarcaster();
//   }, []);

//   const user = {
//     fid: context?.user?.fid || frameContext?.user?.fid,
//     displayName: context?.user?.displayName || frameContext?.user?.displayName,
//     pfpUrl: context?.user?.pfpUrl || frameContext?.user?.pfpUrl,
//   };

//   const profileImage = user?.pfpUrl || "";

//   const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [address as `0x${string}`],
//     query: { enabled: isConnected && !!address },
//   });

//   useEffect(() => {
//     if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
//       router.replace("/profile/checkin");
//     }
//   }, [nftBalance, isConnected, router]);



//   const handleShare = () => {
//     const baseDomain = "https://mint.personalids.xyz"; 
//     const farcasterMiniAppUrl =
//       "https://farcaster.xyz/miniapps/offLcGmhl94_/personal-id-mint";
//     const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
//     const text =
//       "🔥 I just checked in today! Join me on Personal Onchain ID Minting and Check in Daily 👇";

//     if (isFarcaster) {
//       const shareUrl =
//         "https://warpcast.com/~/compose?" +
//         "text=" +
//         encodeURIComponent(text) +
//         "&embeds[]=" +
//         encodeURIComponent(farcasterMiniAppUrl);
//       window.open(shareUrl, "_blank");
//     } else {
//       const shareUrl =
//         "https://warpcast.com/~/compose?text=" +
//         encodeURIComponent(text) +
//         "&embeds[]=" +
//         encodeURIComponent(baseDomain);
//       window.open(shareUrl, "_blank");
//     }

//     // ✅ share হলে mint unlock-এর জন্য flag true
//     setHasShared(true);
//   };


//   // ✅ Handle Mint using SendCalls
//   const handleMint = async () => {
//     if (!address || !user.fid) return;

//     setManualStatus("Transaction in Progress...");
//     setLoading(true);

//     try {
//       const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
//       const metadataURL = `${baseUrl}/api/metadata/${user.fid}`;

//       sendCalls(
//         {
//           calls: [
//             {
//               to: CONTRACT_ADDRESS as `0x${string}`,
//               abi: ABI,
//               functionName: "mintID",
//               args: [metadataURL],
//               value: parseEther("0.0000067"),
//             },
//           ],
//           capabilities: {
//             // atomic: {
//             //   enabled: true,
//               auxiliaryData: {
//               data: "bc_v7v8guqa" 
//              }
//             // },
//           },

//         },


//         {
//           onSuccess: (data) => {
//             setManualStatus("Mint Successful! Redirecting...");
//             console.log("Bundle ID:", data);
//             setTimeout(() => router.push("/profile/checkin"), 2000);
//           },
//           onError: (err) => {
//             console.error(err);
//             setManualStatus(
//               err.message.includes("rejected")
//                 ? "Transaction Declined"
//                 : "Mint Failed"
//             );
//             setLoading(false);
//           },
//         }
//       );
//     } catch (err) {
//       console.error("Mint Error:", err);
//       setManualStatus("Error occurred");
//       setLoading(false);
//     }
//   };

//   const isProfileLoading = (isConnected && !address) || isBalanceLoading;

//   if (!isConnected || isProfileLoading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingWrapper}>
//           <div className={styles.loadingSpinner}></div>
//           <h2 className={styles.loadingText}>Your Onchain Profile Loading...</h2>
//           <p className={styles.loadingSubText}>Syncing with Base Network</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Personal Onchain ID</h1>

//       <div className={styles.card}>
//         <div className={styles.avatarWrapper}>
//           <img
//             src={profileImage || "/default-avatar.png"}
//             alt="User"
//             className={styles.avatar}
//           />
//         </div>
//         <div className={styles.info}>
//           <h3>{user?.displayName || "Base User"}</h3>
//           {user?.fid && <p className={styles.fid}>FID: {user.fid}</p>}
//           <p className={styles.wallet}>
//             Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
//           </p>
//           <span className={styles.badge}>Onchain Identity</span>
//         </div>
//       </div>

//          {(!isFollowed || !hasShared) && (
//         <div className={styles.taskBox}>
//           <h4>Task Required</h4>
//           <p>Follow The Developer Profile and Share To Unlock Mint</p>
//           <a
//             href="https://base.app/profile/stlifestyle"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Follow on Base
//           </a>
//           <div className={styles.orText}>OR</div>
//           <a
//             href="https://farcaster.xyz/stlifestyle.base.eth"
//             target="_blank"
//             className={styles.followBtn}
//             onClick={() => setIsFollowed(true)}
//           >
//             Follow on Farcaster
//           </a>
//           <div className={styles.orText}>AND</div>
//            <button
//             className={styles.followBtn}
//             onClick={handleShare}
//             style={{ marginBottom: "10px", display: "block" }}
//           >
//             Share on Base or Farcaster
//           </button>
//         </div>
//       )}

//       {isFollowed && hasShared && (
//         <div className={styles.mintWrapper}>
//           <button
//             className={styles.mintButton}
//             onClick={handleMint}
//             disabled={
//               loading ||
//               isPending ||
//               (nftBalance ? (nftBalance as bigint) > 0n : false)
//             }
//           >
//             {loading || isPending ? "Minting..." : "MINT ID NOW"}
//           </button>

//           {manualStatus && (
//             <p className={styles.manualStatusText}>{manualStatus}</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









"use client";

import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { useSendCalls } from "wagmi";
import { parseEther } from "viem";
import sdk from "@farcaster/frame-sdk";
import styles from "./profile.module.css";
import { CONTRACT_ADDRESS, ABI } from "@/lib/contract";

/* eslint-disable @next/next/no-img-element */

export default function ProfilePage() {
  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // ✅ States
  const [isFollowed, setIsFollowed] = useState(false);
  const [manualStatus, setManualStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasShared, setHasShared] = useState(false);
 
  const { sendCalls, isPending } = useSendCalls();

  useEffect(() => {
    const loadFarcaster = async () => {
      try {
        const ctx = await sdk.context;
        setFrameContext(ctx);
      } catch (err) {
        console.error("Farcaster error:", err);
      }
    };
    loadFarcaster();
  }, []);

  const user = {
    fid: context?.user?.fid || frameContext?.user?.fid,
    displayName: context?.user?.displayName || frameContext?.user?.displayName,
    pfpUrl: context?.user?.pfpUrl || frameContext?.user?.pfpUrl,
  };

  const profileImage = user?.pfpUrl || "";

  const { data: nftBalance, isLoading: isBalanceLoading } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: isConnected && !!address },
  });

  useEffect(() => {
    if (isConnected && nftBalance !== undefined && (nftBalance as bigint) > 0n) {
      router.replace("/profile/checkin");
    }
  }, [nftBalance, isConnected, router]);



  const handleShare = () => {
    const baseDomain = "https://base.app/app/mints.personalids.xyz"; 
    const farcasterMiniAppUrl =
      "https://farcaster.xyz/miniapps/offLcGmhl94_/personal-id-mint";
    const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
    const text =
  "🔥 I just checked in today! Mint your Personal Onchain ID and earn DEGEN rewards 🚀 Daily check-in = 1 Point, 1 Point = 1 DEGEN 👇";


    if (isFarcaster) {
      const shareUrl =
        "https://warpcast.com/~/compose?" +
        "text=" +
        encodeURIComponent(text) +
        "&embeds[]=" +
        encodeURIComponent(farcasterMiniAppUrl);
      window.open(shareUrl, "_blank");
    } else {
      const shareUrl =
        "https://warpcast.com/~/compose?text=" +
        encodeURIComponent(text) +
        "&embeds[]=" +
        encodeURIComponent(baseDomain);
      window.open(shareUrl, "_blank");
    }

    // ✅ share হলে mint unlock-এর জন্য flag true
    setHasShared(true);
  };


// ✅ Handle Mint using SendCalls
  const handleMint = async () => {
    if (!address || !user.fid) return;

    setManualStatus("Transaction in Progress...");
    setLoading(true);

    try {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const metadataURL = `${baseUrl}/api/metadata/${user.fid}`;

      
      sendCalls(
        {
          calls: [
            {
              to: CONTRACT_ADDRESS as `0x${string}`,
              abi: ABI,
              functionName: "mintID",
              args: [metadataURL],
              value: parseEther("0.0000067"),
            },
          ],
       
          capabilities: {
            auxiliaryData: {
              data: "bc_bmhx0p43" 
            }
          },
        },

        {
          onSuccess: (data) => {
            setManualStatus("Mint Successful! Redirecting...");
            console.log("Bundle ID:", data);
            setTimeout(() => router.push("/profile/checkin"), 2000);
          },
          onError: (err) => {
            console.error(err);
            setManualStatus(
              err.message.includes("rejected")
                ? "Transaction Declined"
                : "Mint Failed"
            );
            setLoading(false);
          },
        }
      );
    } catch (err) {
      console.error("Mint Error:", err);
      setManualStatus("Error occurred");
      setLoading(false);
    }
  };




  const isProfileLoading = (isConnected && !address) || isBalanceLoading;

  if (!isConnected || isProfileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.loadingSpinner}></div>
          <h2 className={styles.loadingText}>Your Onchain Profile Loading...</h2>
          <p className={styles.loadingSubText}>Syncing with Base Network</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Personal Onchain ID</h1>

      <div className={styles.card}>
        <div className={styles.avatarWrapper}>
          <img
            src={profileImage || "/default-avatar.png"}
            alt="User"
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <h3>{user?.displayName || "Base User"}</h3>
          {user?.fid && <p className={styles.fid}>FID: {user.fid}</p>}
          <p className={styles.wallet}>
            Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <span className={styles.badge}>Onchain Identity</span>
        </div>
      </div>

         {(!isFollowed || !hasShared) && (
        <div className={styles.taskBox}>
          <h4>Task Required</h4>
          <p>Follow The Developer Profile and Share To Unlock Mint</p>
          <a
            href="https://base.app/profile/stlifestyle"
            target="_blank"
            className={styles.followBtn}
            onClick={() => setIsFollowed(true)}
            style={{ marginBottom: "10px", display: "block" }}
          >
            Follow on Base
          </a>
          <div className={styles.orText}>OR</div>
          <a
            href="https://farcaster.xyz/stlifestyle.base.eth"
            target="_blank"
            className={styles.followBtn}
            onClick={() => setIsFollowed(true)}
          >
            Follow on Farcaster
          </a>
          <div className={styles.orText}>AND</div>
           <button
            className={styles.followBtn}
            onClick={handleShare}
            style={{ marginBottom: "10px", display: "block" }}
          >
            Share on Base or Farcaster
          </button>
        </div>
      )}

      {isFollowed && hasShared && (
        <div className={styles.mintWrapper}>
          <button
            className={styles.mintButton}
            onClick={handleMint}
            disabled={
              loading ||
              isPending ||
              (nftBalance ? (nftBalance as bigint) > 0n : false)
            }
          >
            {loading || isPending ? "Minting..." : "MINT ID NOW"}
          </button>

          {manualStatus && (
            <p className={styles.manualStatusText}>{manualStatus}</p>
          )}
        </div>
      )}
    </div>
  );
}