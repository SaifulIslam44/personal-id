

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useAccount, useReadContract, useSendCalls } from "wagmi"; 
// import { encodeFunctionData, concat } from "viem"; // নতুন যোগ করুন
// import { Attribution } from "ox/erc8021"; // নতুন যোগ করুন
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import { sdk } from "@farcaster/miniapp-sdk";
// import styles from "../task.module.css";

// export default function MiniTask() {
//   const { address } = useAccount();
//   const { sendCalls } = useSendCalls();

//   const [isClaiming, setIsClaiming] = useState(false);
//   const [claimError, setClaimError] = useState(false);
//   const [isAddedToProfile, setIsAddedToProfile] = useState(false);
//   const [verifyLoading, setVerifyLoading] = useState(false);
  
  
//   const [retryTimer, setRetryTimer] = useState(0);

  
//   const { data: isTaskDone, refetch: refetchTask } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "taskDone",
//     args: address ? [address, "add_miniapp"] : undefined,
//     query: { enabled: !!address },
//   });

//   // টাইমার লজিক
//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (retryTimer > 0) {
//       t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
//     }
//     return () => clearTimeout(t);
//   }, [retryTimer]);

//   // ২. প্রোফাইল স্ট্যাটাস চেক করার ফাংশন
//   const checkAdditionStatus = useCallback(async () => {
//     try {
//       const context = await sdk.context;
//       if (context?.client?.added) {
//         setIsAddedToProfile(true);
//         setClaimError(false);
//         return true;
//       } else {
//         setIsAddedToProfile(false);
//         return false;
//       }
//     } catch (error) {
//       console.error("SDK Context Error:", error);
//       return false;
//     }
//   }, []);

//   // ৩. পোলিং
//   useEffect(() => {
//     checkAdditionStatus();
//     const interval = setInterval(checkAdditionStatus, 3000);
//     return () => clearInterval(interval);
//   }, [checkAdditionStatus]);

//   // ৪. Add Button হ্যান্ডলার
//   const handleAddClick = async () => {
//     setClaimError(false); 
//     setVerifyLoading(true);
    
//     try {
//       const alreadyAdded = await checkAdditionStatus();
//       if (alreadyAdded) {
//         setVerifyLoading(false);
//         return;
//       }

//       await new Promise(resolve => setTimeout(resolve, 100));
//       await sdk.actions.addFrame();
//       await checkAdditionStatus();
//     } catch (error: any) {
//       console.log("Interaction Error:", error);
//       setClaimError(true);
//       setIsAddedToProfile(false);
//     } finally {
//       setVerifyLoading(false);
//     }
//   };

 


// const handleClaim = async () => {
//   if (!address || !isAddedToProfile) return;
//   setIsClaiming(true);

//   try {
//     // ১. ডাটা এনকোড করা
//     const data = encodeFunctionData({
//       abi: ABI,
//       functionName: "claimDirectTask",
//       args: ["add_miniapp"],
//     });

//     // ২. বিল্ডার কোড সাফিক্স তৈরি করা
//     const builderSuffix = Attribution.toDataSuffix({
//       codes: ["bc_bmhx0p43"], // আপনার বিল্ডার কোড
//     });

//     // ৩. ডাটা এবং সাফিক্স ম্যানুয়ালি জোড়া লাগানো
//     const finalData = concat([data, builderSuffix]);

//     // ৪. sendCalls দিয়ে ট্রানজেকশন পাঠানো
//     sendCalls({
//       calls: [
//         {
//           to: CONTRACT_ADDRESS as `0x${string}`,
//           data: finalData, // সাফিক্সসহ ডাটা
//         },
//       ],
//     }, {
//       onSuccess: async (id) => {
//         console.log("Bundle ID:", id);
//         await refetchTask(); // টাস্ক স্ট্যাটাস রিফ্রেশ
//         setIsClaiming(false);
//       },
//       onError: (err) => {
//         console.error("Claim Error:", err);
//         setIsClaiming(false);
//         setRetryTimer(3);
//       }
//     });

//   } catch (err) {
//     console.error("Execution Error:", err);
//     setIsClaiming(false);
//   }
// };

//   return (
//     <div className={styles.taskCard}>
//       <div className={styles.left}>
//         <div className={styles.icon}>📱</div>
//       </div>

//       <div className={styles.center}>
//         <h3>Add Mini App</h3>
//         <p className={styles.desc}>Add to your Farcaster to claim +50 PIM rewards.</p>

//         {isTaskDone ? (
//           <span className={styles.done}>✅ Completed</span>
//         ) : isAddedToProfile ? (
//           <button 
//             className={retryTimer > 0 ? styles.retryBtn : styles.claimBtn} 
//             onClick={handleClaim} 
//             disabled={isClaiming || retryTimer > 0}
//           >
//             {isClaiming ? "Claiming..." : retryTimer > 0 ? `Retry in ${retryTimer}s` : "Claim +50 PIM"}
//           </button>
//         ) : (
//           <button 
//             className={claimError ? styles.errorBtnInside : styles.verifyBtn} 
//             onClick={handleAddClick} 
//             disabled={verifyLoading}
//           >
//             {verifyLoading ? "Checking..." : claimError ? "Please add the app first!" : "Add Mini App"}
//           </button>
//         )}
//       </div>

//       <div className={styles.right}>
//         <span className={styles.reward}>+50 PIM</span>
//       </div>
//     </div>
//   );
// }


















"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useReadContract, useSendCalls } from "wagmi"; 
import { encodeFunctionData, concat } from "viem";
import { Attribution } from "ox/erc8021";
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "../task.module.css";

interface MiniTaskProps {
  fid?: number | string;
}

export default function MiniTask({ fid }: MiniTaskProps) {
  const { address } = useAccount();
  const { sendCalls } = useSendCalls();

  const [isClaiming, setIsClaiming] = useState(false);
  const [isAddedToProfile, setIsAddedToProfile] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [retryTimer, setRetryTimer] = useState(0);

  // 1. টোকেন সেভ করার ফাংশন
  const saveTokenToDB = useCallback(async (userFid: number | string, url: string, token: string) => {
    try {
      const response = await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: userFid,
          url: url,
          token: token
        }),
      });

      if (response.ok) {
        console.log(`✅ Token synced for FID: ${userFid}`);
        // [FIX]: FID এর বদলে এখন আমরা টোকেনটাই সেভ করে রাখব
        localStorage.setItem("pim_synced_token", token);
      }
    } catch (error) {
      console.error("❌ Token Save Error:", error);
    }
  }, []);

  // 2. স্মার্ট অটো-সিঙ্ক লজিক (3-dot মেনু সাপোর্টসহ)
  const checkAndSyncStatus = useCallback(async () => {
    try {
      const context = await sdk.context;
      if (!context || !context.user) return;

      const userFid = fid || context.user.fid;
      const isAdded = context.client.added;
      const notifDetails = context.client.notificationDetails;

      setIsAddedToProfile(!!isAdded);

      // লজিক: 
      // ক) নোটিফিকেশন অন আছে (notifDetails আছে)
      // খ) এবং বর্তমান টোকেনটি আমাদের সেভ করা টোকেনের সাথে মিলছে না
      // (মানে ইউজার ৩-ডট দিয়ে রি-এনাদবল করেছে অথবা নতুন ইউজার)
      
      const lastSyncedToken = localStorage.getItem("pim_synced_token");

      if (notifDetails && userFid && notifDetails.token !== lastSyncedToken) {
        console.log("🔄 Token changed (or new user), syncing to DB...");
        await saveTokenToDB(userFid, notifDetails.url, notifDetails.token);
      }
      
    } catch (error) {
      console.error("Context Error:", error);
    }
  }, [fid, saveTokenToDB]);

  // 3. পোলিং (টোকেন চেঞ্জ চেক করার জন্য)
  useEffect(() => {
    checkAndSyncStatus();
    // প্রতি ৩ সেকেন্ডে চেক করবে টোকেন চেঞ্জ হয়েছে কি না
    const interval = setInterval(checkAndSyncStatus, 3000);
    return () => clearInterval(interval);
  }, [checkAndSyncStatus]);

  // 4. রিট্রাই টাইমার
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (retryTimer > 0) {
      t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [retryTimer]);

  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "add_miniapp"] : undefined,
    query: { enabled: !!address },
  });

  // 5. বাটন হ্যান্ডলার
  const handleAddClick = async () => {
    setVerifyLoading(true);
    
    try {
      const result = await sdk.actions.addFrame();
      
      if (result.notificationDetails) {
        const context = await sdk.context;
        const userFid = fid || context?.user?.fid;

        if (userFid) {
            // ফোর্স আপডেট
            await saveTokenToDB(
                userFid, 
                result.notificationDetails.url, 
                result.notificationDetails.token
            );
        }
      }
      
      await checkAndSyncStatus();
      
    } catch (error: any) {
      console.error("Interaction Error:", error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!address || !isAddedToProfile) return;
    setIsClaiming(true);

    try {
      const data = encodeFunctionData({
        abi: ABI,
        functionName: "claimDirectTask",
        args: ["add_miniapp"],
      });

      const builderSuffix = Attribution.toDataSuffix({
        codes: ["bc_bmhx0p43"], 
      });

      const finalData = concat([data, builderSuffix]);

      sendCalls({
        calls: [
          {
            to: CONTRACT_ADDRESS as `0x${string}`,
            data: finalData,
          },
        ],
      }, {
        onSuccess: async () => {
          await refetchTask();
          setIsClaiming(false);
        },
        onError: (err) => {
          console.error("Claim Error:", err);
          setIsClaiming(false);
          setRetryTimer(3);
        }
      });

    } catch (err) {
      console.error("Execution Error:", err);
      setIsClaiming(false);
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.left}>
        <div className={styles.icon}>📱</div>
      </div>

      <div className={styles.center}>
        <h3>Add Mini App</h3>
        <p className={styles.desc}>Enable notifications to claim +50 PIM.</p>

        {isTaskDone ? (
          <span className={styles.done}>✅ Completed</span>
        ) : isAddedToProfile ? (
          <button 
            className={retryTimer > 0 ? styles.retryBtn : styles.claimBtn} 
            onClick={handleClaim} 
            disabled={isClaiming || retryTimer > 0}
          >
            {isClaiming ? "Claiming..." : retryTimer > 0 ? `Retry in ${retryTimer}s` : "Claim +50 PIM"}
          </button>
        ) : (
          <button 
            className={styles.verifyBtn} 
            onClick={handleAddClick} 
            disabled={verifyLoading}
          >
            {verifyLoading ? "Checking..." : "Enable Notifications"}
          </button>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}