




// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract, useWriteContract, useConnect } from "wagmi";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import styles from "./task.module.css";

// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import miniApp from "@farcaster/miniapp-sdk";

// export default function TaskPage() {
//   const { address, isConnected } = useAccount();
//   const { connect, connectors } = useConnect();

//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);

//   const [copyStatus, setCopyStatus] = useState("Invite Friends");
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [countdown, setCountdown] = useState(0);

//   useEffect(() => {
//     miniApp.context.then(setFrameContext).catch(() => {});
//   }, []);

//   const fid = context?.user?.fid || frameContext?.user?.fid;

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else if (countdown === 0) {
//       setErrorMessage("");
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   useEffect(() => {
//     if (!isConnected && connectors.length > 0) {
//       const farcasterConnector = connectors.find((c) => c.id === "farcaster");
//       if (farcasterConnector) {
//         connect({ connector: farcasterConnector });
//       } else {
//         connect({ connector: connectors[0] });
//       }
//     }
//   }, [isConnected, connectors, connect]);

//   const { data: userRefCount, refetch: checkReferrals } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "refCount",
//     args: address ? [address] : undefined,
//   });

//   const { data: isTaskDone } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "taskDone",
//     args: address ? [address, "invite1"] : undefined,
//   });

//   const { writeContract } = useWriteContract();

//   const handleVerify = async () => {
//     if (!address || countdown > 0) return;

//     setIsVerifying(true);
//     setErrorMessage("");

//     const { data: latestCount } = await checkReferrals();

//     setTimeout(() => {
//       setIsVerifying(false);
//       if (Number(latestCount) >= 1) {
//       } else {
//         setErrorMessage("No referral found");
//         setCountdown(5);
//       }
//     }, 2000);
//   };

//   const handleClaimTask = () => {
//     if (!address) return;

//     setIsVerifying(true);

//     writeContract(
//       {
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "claimRef",
//         args: [BigInt(2), "invite1"],
//       },
//       {
//         onSuccess() {
//           setIsVerifying(false);
//         },
//         onError() {
//           setIsVerifying(false);
//         },
//       }
//     );
//   };

//   const FARCASTER_LINK = "https://ebooks-extreme-wondering-mirrors.trycloudflare.com";

//   const inviteLink = fid
//     ? `${FARCASTER_LINK}?fid=${fid}`
//     : FARCASTER_LINK;

//   const copyToClipboard = () => {
//     if (!fid) {
//       setCopyStatus("FID Not Found");
//       return;
//     }
//     navigator.clipboard.writeText(inviteLink);
//     setCopyStatus("Link Copied!");
//     setTimeout(() => setCopyStatus("Invite Friends"), 2000);
//   };

//   const refCountNum = userRefCount ? Number(userRefCount) : 0;
//   const isEligible = refCountNum >= 2;

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Complete Task & Earn Points</h2>

//       <div className={styles.taskCard}>
//         <div className={styles.taskInfo}>
//           <h3>Invite 2 Friend</h3>
//           <p>Reward: 10 Points</p>
//           <p className={styles.progress}>
//             Progress: <strong>{refCountNum}</strong> / 2
//           </p>
//         </div>

//         {!isTaskDone ? (
//           <div className={styles.actions}>
//             <button onClick={copyToClipboard} className={styles.inviteBtn}>
//               {copyStatus}
//             </button>

//             {isEligible ? (
//               <button
//                 onClick={handleClaimTask}
//                 className={styles.claimBtn}
//                 disabled={isVerifying}
//               >
//                 {isVerifying ? "Claiming..." : "Claim Reward"}
//               </button>
//             ) : (
//               <button
//                 onClick={handleVerify}
//                 disabled={isVerifying || countdown > 0}
//                 className={
//                   isVerifying
//                     ? styles.verifyingBtn
//                     : countdown > 0
//                     ? styles.disabledBtn
//                     : styles.verifyBtn
//                 }
//               >
//                 {isVerifying
//                   ? "Verifying..."
//                   : countdown > 0
//                   ? `${errorMessage} (${countdown}s)`
//                   : "Verify Task"}
//               </button>
//             )}
//           </div>
//         ) : (
//           <button disabled className={styles.completedBtn}>
//             Task Completed ✅
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }











// "use client";

// import { useState, useEffect } from "react";
// import {
//   useAccount,
//   useReadContract,
//   useWriteContract,
//   useConnect,
// } from "wagmi";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import styles from "./task.module.css";

// import { useMiniKit } from "@coinbase/onchainkit/minikit";
// import miniApp from "@farcaster/miniapp-sdk";

// export default function TaskPage() {
//   const { address, isConnected } = useAccount();
//   const { connect, connectors } = useConnect();
//   const { writeContractAsync } = useWriteContract();

//   const { context } = useMiniKit();
//   const [frameContext, setFrameContext] = useState<any>(null);

//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isClaiming, setIsClaiming] = useState(false);
//   const [claimError, setClaimError] = useState(false);
//   const [retryTimer, setRetryTimer] = useState(0);
//   const [countdown, setCountdown] = useState(0);

//   useEffect(() => {
//     miniApp.context.then(setFrameContext).catch(() => {});
//   }, []);

//   const fid = context?.user?.fid || frameContext?.user?.fid;

//   // verify countdown
//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (countdown > 0) {
//       t = setTimeout(() => setCountdown(countdown - 1), 1000);
//     }
//     return () => clearTimeout(t);
//   }, [countdown]);

//   // retry claim timer (10s)
//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (retryTimer > 0) {
//       t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
//     }
//     if (retryTimer === 0 && claimError) {
//       setClaimError(false); // 🔑 back to Claim Reward
//     }
//     return () => clearTimeout(t);
//   }, [retryTimer, claimError]);

//   useEffect(() => {
//     if (!isConnected && connectors.length > 0) {
//       connect({ connector: connectors[0] });
//     }
//   }, [isConnected, connectors, connect]);

//   const { data: userRefCount } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "refCount",
//     args: address ? [address] : undefined,
//   });

//   const { data: isTaskDone } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "taskDone",
//     args: address ? [address, "invite1"] : undefined,
//   });




// const handleShare = () => {
//   if (!fid) return; // 🔒 FID ছাড়া share হবে না

//   setIsVerifying(true);

//   // 🔑 এখানে FID attach করা হচ্ছে
//   // const farcasterMiniAppUrl =
//   //   `https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint?fid=${fid}`;

//       const farcasterMiniAppUrl =
//     `https://ebooks-extreme-wondering-mirrors.trycloudflare.com?fid=${fid}`;

//   const text = "🔥 Complete tasks & earn PIM rewards 👇";

//   const shareUrl =
//     "https://warpcast.com/~/compose?" +
//     "text=" +
//     encodeURIComponent(text) +
//     "&embeds[]=" +
//     encodeURIComponent(farcasterMiniAppUrl);

//   window.open(shareUrl, "_blank");
//   setCountdown(5);
// };




// // const handleShare = () => {
// //   if (!fid) return;

// //   setIsVerifying(true);

// //   const referralLink =
// //     `https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint?fid=${fid}`;

// //   const text =
// // `🔥 Complete tasks & earn PIM rewards

// // 👉 Open here:
// // ${referralLink}`;

// //   const shareUrl =
// //     "https://warpcast.com/~/compose?text=" +
// //     encodeURIComponent(text);

// //   window.open(shareUrl, "_blank");
// //   setCountdown(5);
// // };



//   const handleClaimTask = async () => {
//     if (!address) return;

//     try {
//       setIsClaiming(true);
//       await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "claimRef",
//         args: [BigInt(4), "invite1"],
//       });
//     } catch (err) {
//       // ❌ wallet cancel
//       setIsClaiming(false);
//       setClaimError(true);
//       setRetryTimer(10); // ⏱️ 10 seconds retry
//     }
//   };

//   const refCountNum = userRefCount ? Number(userRefCount) : 0;
//   const isEligible = refCountNum >= 4;




//   return (
//   <div className={styles.wrapper}>
//     <div className={styles.header}>
//       <h1 className={styles.title}>Complete Tasks & Earn PIM</h1>
//       <p className={styles.subtitle}>
//         Finish simple tasks and earn real onchain rewards
//       </p>
//     </div>

//     <div className={styles.taskCard}>
//       {/* LEFT ICON */}
//       <div className={styles.left}>
//         <div className={styles.icon}>🎯</div>
//       </div>

//       {/* CENTER CONTENT */}
//       <div className={styles.center}>
//         <h3>Invite 5 Friends</h3>
//         <p className={styles.desc}>Invite friends, earn PIM</p>

//         {/* BUTTON BELOW DESCRIPTION */}
//         {isTaskDone ? (
//           <span className={styles.done}>Completed</span>
//         ) : isEligible ? (
//           <button
//             className={claimError ? styles.retryBtn : styles.claimBtn}
//             onClick={handleClaimTask}
//             disabled={isClaiming || retryTimer > 0}
//           >
//             {isClaiming
//               ? "Claiming..."
//               : claimError
//               ? `Retry Claim (${retryTimer}s)`
//               : "Claim Reward"}
//           </button>
//         ) : (
//           <button
//             className={styles.verifyBtn}
//             onClick={handleShare}
//             disabled={isVerifying}
//           >
//             {isVerifying
//               ? countdown > 0
//                 ? `Verifying ${countdown}s`
//                 : "Verifying..."
//               : "Share Referral Link"}
//           </button>
//         )}
//       </div>

//       {/* RIGHT REWARD */}
//       <div className={styles.right}>
//         <span className={styles.reward}>50 PIM</span>
//       </div>
//     </div>
//   </div>
// );
// }









































"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useConnect } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import styles from "./task.module.css";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import miniApp from "@farcaster/miniapp-sdk";
import { Moon, Sun } from "lucide-react";
import Image from "next/image"; 
import Task50 from "./components/Task50";
import FollowTask from "./components/FollowTask";

export default function TaskPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContractAsync } = useWriteContract();

  const { context } = useMiniKit();
  const [frameContext, setFrameContext] = useState<any>(null);

  const [hasShared, setHasShared] = useState(false);        // ✅ NEW
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const [verifyTimer, setVerifyTimer] = useState(0);

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(false);
  const [retryTimer, setRetryTimer] = useState(0);

  // 🔽 এখানে Task-2 (invite2) এর জন্য একই ধরনের state বসবে
const [hasShared2, setHasShared2] = useState(false);
const [isVerifying2, setIsVerifying2] = useState(false);
const [verifyError2, setVerifyError2] = useState(false);
const [verifyTimer2, setVerifyTimer2] = useState(0);

const [isClaiming2, setIsClaiming2] = useState(false);
const [claimError2, setClaimError2] = useState(false);
const [retryTimer2, setRetryTimer2] = useState(0);



// ২. নতুন স্টেট (ইউজার ইনফো এবং ডার্ক মোডের জন্য)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const user = context?.user || frameContext?.user;
  const displayName = user?.displayName || user?.username || "User";
  const pfpUrl = user?.pfpUrl || "https://placehold.co/100x100?text=User";



  useEffect(() => {
    miniApp.context.then(setFrameContext).catch(() => {});
  }, []);

  // পেজের ভেতর useEffect এ এটি যোগ করুন
useEffect(() => {
  if (!isDarkMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
}, [isDarkMode]);

  const fid = context?.user?.fid || frameContext?.user?.fid;

  // 🔁 verify retry timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (verifyTimer > 0) {
      t = setTimeout(() => setVerifyTimer(verifyTimer - 1), 1000);
    }
    if (verifyTimer === 0 && verifyError) {
      setVerifyError(false);
    }
    return () => clearTimeout(t);
  }, [verifyTimer, verifyError]);

//For Task-2 verify retry timer
useEffect(() => {
  let t: NodeJS.Timeout;

  if (verifyTimer2 > 0) {
    t = setTimeout(() => {
      setVerifyTimer2(verifyTimer2 - 1);
    }, 1000);
  }

  if (verifyTimer2 === 0 && verifyError2) {
    setVerifyError2(false); // আবার Verify দেখাবে
  }

  return () => clearTimeout(t);
}, [verifyTimer2, verifyError2]);



  // 🔁 claim retry timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (retryTimer > 0) {
      t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
    }
    if (retryTimer === 0 && claimError) {
      setClaimError(false);
    }
    return () => clearTimeout(t);
  }, [retryTimer, claimError]);

//For Task-2 🔁 claim retry timer
useEffect(() => {
  let t: NodeJS.Timeout;

  if (retryTimer2 > 0) {
    t = setTimeout(() => {
      setRetryTimer2(retryTimer2 - 1);
    }, 1000);
  }

  if (retryTimer2 === 0 && claimError2) {
    setClaimError2(false); // আবার Claim দেখাবে
  }

  return () => clearTimeout(t);
}, [retryTimer2, claimError2]);




  useEffect(() => {
    if (!isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  }, [isConnected, connectors, connect]);



  
const { data: userRefCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "refCount",
    args: address ? [address] : undefined,
  });

  // Task-1 এর জন্য refetchTask1 যোগ করা হয়েছে

  const { data: isTaskDone, refetch: refetchTask1 } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "invite1"] : undefined,
  });

 // Task-2 এর জন্য refetchTask2 যোগ করা হয়েছে

const { data: isTaskDone2, refetch: refetchTask2 } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: "taskDone",
  args: address ? [address, "invite2"] : undefined,

});






  /* =======================
     SHARE (ONLY SHARE)
     ======================= */
const handleShare = () => {
    if (!fid) return;

    // ইউজার কোন প্ল্যাটফর্মে আছে তা শনাক্ত করা
    const isBaseApp = /base/i.test(navigator.userAgent);
    
    // প্ল্যাটফর্ম অনুযায়ী ডোমেইন সেট করা
    const domain = isBaseApp 
      ? "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint" // Base App-এর জন্য
      : "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint"; // Farcaster-এর জন্য

    const shareUrl =
      "https://warpcast.com/~/compose?" +
      "text=" +
      encodeURIComponent("🔥 Complete tasks & earn PIM rewards 👇") +
      "&embeds[]=" +
      encodeURIComponent(`${domain}?fid=${fid}`);

    window.open(shareUrl, "_blank");
    setHasShared(true); // ✅ ONLY FLAG
  };


  // 🔽 এখানে Task-2 এর জন্য handleShare2 বসবে (invite2)
const handleShare2 = () => {
    if (!fid) return;

    // ইউজার কোন প্ল্যাটফর্মে আছে তা শনাক্ত করা
    const isBaseApp = /base/i.test(navigator.userAgent);
    
    // প্ল্যাটফর্ম অনুযায়ী ডোমেইন সেট করা
    const domain = isBaseApp 
      ? "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint" // Base App-এর জন্য
      : "https://farcaster.xyz/miniapps/ihTYq4bv7zgI/personal-id-mint"; // Farcaster-এর জন্য

    const shareUrl2 =
      "https://warpcast.com/~/compose?" +
      "text=" +
      encodeURIComponent("🔥 Complete tasks & earn PIM rewards 👇") +
      "&embeds[]=" +
      encodeURIComponent(`${domain}?fid=${fid}`);

    window.open(shareUrl2, "_blank");
    setHasShared2(true); // ✅ ONLY FLAG
  };




  /* =======================
     VERIFY (LIKE CLAIM)
     ======================= */
  const handleVerify = async () => {
    if (!address) return;

    try {
      setIsVerifying(true);
      const res = await refetch();
      const count = Number(res.data ?? 0);

      if (count < 5) {
        throw new Error("Not verified");
      }

      setIsVerifying(false);
    } catch {
      setIsVerifying(false);
      setVerifyError(true);
      setVerifyTimer(30); // ⏱️ retry verify
    }
  };


// 🔽 এখানে Task-2 verify logic বসবে (count < 10 হলে fail)

const handleVerify2 = async () => {
  if (!address) return;

  try {
    setIsVerifying2(true);
    const res = await refetch();
    if (Number(res.data ?? 0) < 10) throw new Error();
    setIsVerifying2(false);
  } catch {
    setIsVerifying2(false);
    setVerifyError2(true);
    setVerifyTimer2(30);
  }
};







  /* =======================
     CLAIM
     ======================= */

//Task 1

const handleClaimTask = async () => {
    if (!address) return;
    try {
      setIsClaiming(true);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimRef",
        args: [BigInt(5), "invite1"],
      });
      await refetch();
      await refetchTask1();
      setIsClaiming(false);
    } catch {
      setIsClaiming(false);
      setClaimError(true);
      setRetryTimer(10);
    }
  };

// Task 2

  const handleClaimTask2 = async () => {
    if (!address) return;
    try {
      setIsClaiming2(true);
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "claimRef",
        args: [BigInt(10), "invite2"],
      });
      await refetch();
      await refetchTask2();
      setIsClaiming2(false);
    } catch {
      setIsClaiming2(false);
      setClaimError2(true);
      setRetryTimer2(10);
    }
  };



  const refCountNum = userRefCount ? Number(userRefCount) : 0;
  const isEligible = refCountNum >= 5;

  // 🔽 Task-2 eligibility
const isEligible2 = refCountNum >= 10;





  return (

/* 🆕 Added Dynamic LightMode Class */
    <div className={`${styles.wrapper} ${!isDarkMode ? styles.lightMode : ""}`}>
      
      {/* 🆕 User Profile Header Added */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <Image 
  src={pfpUrl} 
  alt="PFP" 
  className={styles.pfp} 
  width={40} 
  height={40} 
  unoptimized 
/>
          <span className={styles.userName}>{displayName}</span>
        </div>
        <button className={styles.themeBtn} onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} color="#000" />}
        </button>
      </div>

  
      <div className={styles.header}>
        <h1 className={styles.title}>Complete Tasks & Earn PIM</h1>
        <p className={styles.subtitle}>
          Finish simple tasks and earn real onchain rewards
        </p>
      </div>

{/* ================= NEW: FOLLOW TASK (সব টাস্কের উপরে) ================= */}
      <FollowTask />

{/* ================= TASK 1 ================= */}
      <div className={styles.taskCard}>
        <div className={styles.left}>
          <div className={styles.icon}>👬</div>
        </div>

        <div className={styles.center}>
          <h3>Invite 5 Friends</h3>
          <p className={styles.desc}>Invite friends, earn PIM</p>

          {isTaskDone ? (
            <span className={styles.done}>✅ Completed</span>
          ) : isEligible ? (
            <button
              className={claimError ? styles.retryBtn : styles.claimBtn}
              onClick={handleClaimTask}
              disabled={isClaiming || retryTimer > 0}
            >
              {isClaiming
                ? "Claiming..."
                : claimError
                ? `Retry Claim (${retryTimer}s)`
                : "Claim +250 PIM"}
            </button>
          ) : hasShared ? (
            <button
              className={verifyError ? styles.retryBtn : styles.verifyBtn}
              onClick={handleVerify}
              disabled={isVerifying || verifyTimer > 0}
            >
              {isVerifying
                ? "Verifying..."
                : verifyError
                ? `Retry Verify (${verifyTimer}s)`
                : "Verify"}
            </button>
          ) : (
            <button
              className={styles.verifyBtn}
              onClick={handleShare}
            >
              Share Referral Link
            </button>
          )}
        </div>

        <div className={styles.right}>
          <span className={styles.reward}>+250 PIM</span>
        </div>
      </div>


          {/* ===== TASK 2 ===== */}
<div className={styles.taskCard}>
  <div className={styles.left}>
    <div className={styles.icon}>👬</div>
  </div>

  <div className={styles.center}>
    <h3>Invite 10 Friends</h3>
    <p className={styles.desc}>Invite more friends, earn more PIM</p>

    {isTaskDone2 ? (
      <span className={styles.done}>✅ Completed</span>
    ) : isEligible2 ? (
      <button
        className={claimError2 ? styles.retryBtn : styles.claimBtn}
        onClick={handleClaimTask2}
        disabled={isClaiming2 || retryTimer2 > 0}
      >
        {isClaiming2
          ? "Claiming..."
          : claimError2
          ? `Retry Claim (${retryTimer2}s)`
          : "Claim +500 PIM"}
      </button>
    ) : hasShared2 ? (
      <button
        className={verifyError2 ? styles.retryBtn : styles.verifyBtn}
        onClick={handleVerify2}
        disabled={isVerifying2 || verifyTimer2 > 0}
      >
        {isVerifying2
          ? "Verifying..."
          : verifyError2
          ? `Retry Verify (${verifyTimer2}s)`
          : "Verify"}
      </button>
    ) : (
      <button className={styles.verifyBtn} onClick={handleShare2}>
        Share Referral Link
      </button>
    )}
  </div>


  <div className={styles.right}>
    <span className={styles.reward}>+500 PIM</span>
  </div>
</div>

{/* ===== TASK 3 (50 Refer) ===== */}
          <Task50 fid={fid} />


          
    </div>
);
}


