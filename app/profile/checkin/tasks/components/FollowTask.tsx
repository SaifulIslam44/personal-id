// "use client";

// import { useState, useEffect } from "react";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
// import styles from "../task.module.css";

// export default function FollowTask() {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();

//   const [hasFollowed, setHasFollowed] = useState(false);
//   const [isClaiming, setIsClaiming] = useState(false);
//   const [claimError, setClaimError] = useState(false);
//   const [retryTimer, setRetryTimer] = useState(0);
//   const [isVerifying, setIsVerifying] = useState(false);
  
//   // নতুন স্টেট: কতবার ভেরিফাই ক্লিক করা হয়েছে এবং লোডিং টেক্সট
//   const [verifyCount, setVerifyCount] = useState(0);
//   const [verifyLoading, setVerifyLoading] = useState(false);

//   // ১. অন-চেইন চেক করা যে টাস্কটি কমপ্লিট কি না
//   const { data: isTaskDone, refetch: refetchTask } = useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: ABI,
//     functionName: "taskDone",
//     args: address ? [address, "follow_dev"] : undefined,
//     query: { enabled: !!address },
//   });

//   useEffect(() => {
//     let t: NodeJS.Timeout;
//     if (retryTimer > 0) t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
//     if (retryTimer === 0 && claimError) setClaimError(false);
//     return () => clearTimeout(t);
//   }, [retryTimer, claimError]);

//   // ২. আপনার দেওয়া প্রোফাইল লিঙ্কে ইউজারকে পাঠানো
//   const handleFollowClick = () => {
//     const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
//     const farcasterProfile = "https://farcaster.xyz/stlifestyle.base.eth";
//     const baseAppProfile = "https://base.app/profile/stlifestyle";

//     window.open(isFarcaster ? farcasterProfile : baseAppProfile, "_blank");

//     // ভেরিফাই মোড অন করুন
//     setIsVerifying(true);
//   };

//   const handleVerify = () => {
//     setVerifyLoading(true);
    
//     setTimeout(() => {
//       setVerifyLoading(false);
      
//       if (verifyCount === 0) {
//         // প্রথমবার ক্লিক করলে ফেইল করাবে
//         setClaimError(true);
//         setRetryTimer(3); // ৩ সেকেন্ডের টাইমার
//         setVerifyCount(1);
//       } else {
//         // দ্বিতীয়বার ক্লিক করলে সাকসেস হবে
//         setHasFollowed(true);
//         setIsVerifying(false);
//         setClaimError(false);
//       }
//     }, 2000); // ২ সেকেন্ড "Verifying..." দেখাবে
//   };

//   // ৩. অন-চেইন ১০ পয়েন্ট ক্লেম করা
//   const handleClaim = async () => {
//     if (!address) return;
//     try {
//       setIsClaiming(true);

//       await writeContractAsync({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "claimDirectTask",
//         args: ["follow_dev"],
//       });

//       await refetchTask();
//       setIsClaiming(false);
//       console.log("✅ Claim Successful!");
//     } catch (err) {
//       console.error("❌ Claim Error:", err);
//       setIsClaiming(false);
//       setClaimError(true);
//       setRetryTimer(10);
//     }
//   };

//   return (
//     <div className={styles.taskCard}>
//       <div className={styles.left}>
//         <div className={styles.icon}>🙋‍♀️</div>
//       </div>

//       <div className={styles.center}>
//         <h3>Follow Developer</h3>
//         <p className={styles.desc}>Follow developer profile on Farcaster or Base App.</p>

//         {isTaskDone ? (
//           <span className={styles.done}>✅ Completed</span>
//         ) : isVerifying ? (
//           <button
//             className={claimError ? styles.retryBtn : styles.verifyBtn}
//             onClick={handleVerify}
//             disabled={verifyLoading || retryTimer > 0}
//           >
//             {verifyLoading ? "Verifying..." : retryTimer > 0 ? `Retry in ${retryTimer}s` : "Click to Verify Follow"}
//           </button>
//         ) : hasFollowed ? (
//           <button className={styles.claimBtn} onClick={handleClaim} disabled={isClaiming}>
//             {isClaiming ? "Claiming..." : "Claim +50 PIM"}
//           </button>
//         ) : (
//           <button className={styles.verifyBtn} onClick={handleFollowClick}>
//             Follow Developer
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

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useSendCalls } from "wagmi"; 
import { encodeFunctionData, concat } from "viem"; 
import { Attribution } from "ox/erc8021"; 
import { ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import styles from "../task.module.css";

export default function FollowTask() {
  const { address } = useAccount();
 const { sendCalls } = useSendCalls();

  const [hasFollowed, setHasFollowed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(false);
  const [retryTimer, setRetryTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // নতুন স্টেট: কতবার ভেরিফাই ক্লিক করা হয়েছে এবং লোডিং টেক্সট
  const [verifyCount, setVerifyCount] = useState(0);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ১. অন-চেইন চেক করা যে টাস্কটি কমপ্লিট কি না
  const { data: isTaskDone, refetch: refetchTask } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "taskDone",
    args: address ? [address, "follow_dev"] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (retryTimer > 0) t = setTimeout(() => setRetryTimer(retryTimer - 1), 1000);
    if (retryTimer === 0 && claimError) setClaimError(false);
    return () => clearTimeout(t);
  }, [retryTimer, claimError]);

  // ২. আপনার দেওয়া প্রোফাইল লিঙ্কে ইউজারকে পাঠানো
  const handleFollowClick = () => {
    const isFarcaster = /warpcast|farcaster/i.test(navigator.userAgent);
    const farcasterProfile = "https://farcaster.xyz/stlifestyle.base.eth";
    const baseAppProfile = "https://base.app/profile/stlifestyle";

    window.open(isFarcaster ? farcasterProfile : baseAppProfile, "_blank");

    // ভেরিফাই মোড অন করুন
    setIsVerifying(true);
  };

  const handleVerify = () => {
    setVerifyLoading(true);
    
    setTimeout(() => {
      setVerifyLoading(false);
      
      if (verifyCount === 0) {
        // প্রথমবার ক্লিক করলে ফেইল করাবে
        setClaimError(true);
        setRetryTimer(3); // ৩ সেকেন্ডের টাইমার
        setVerifyCount(1);
      } else {
        // দ্বিতীয়বার ক্লিক করলে সাকসেস হবে
        setHasFollowed(true);
        setIsVerifying(false);
        setClaimError(false);
      }
    }, 2000); // ২ সেকেন্ড "Verifying..." দেখাবে
  };



const handleClaim = async () => {
  if (!address) return;
  setIsClaiming(true);

  try {
    // ১. ডাটা এনকোড করা
    const data = encodeFunctionData({
      abi: ABI,
      functionName: "claimDirectTask",
      args: ["follow_dev"],
    });

    // ২. বিল্ডার কোড সাফিক্স তৈরি করা
    const builderSuffix = Attribution.toDataSuffix({
      codes: ["bc_bmhx0p43"], 
    });

    // ৩. ডাটা এবং সাফিক্স জোড়া লাগানো
    const finalData = concat([data, builderSuffix]);

    // ৪. sendCalls দিয়ে ট্রানজেকশন পাঠানো
    sendCalls({
      calls: [
        {
          to: CONTRACT_ADDRESS as `0x${string}`,
          data: finalData,
        },
      ],
    }, {
      onSuccess: async (id) => {
        console.log("Bundle ID:", id);
        await refetchTask(); // টাস্ক স্ট্যাটাস রিফ্রেশ
        console.log("✅ Claim Successful!");
        setIsClaiming(false);
      },
      onError: (err) => {
        console.error("❌ Claim Error:", err);
        setIsClaiming(false);
        setClaimError(true);
        setRetryTimer(10);
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
        <div className={styles.icon}>🙋‍♀️</div>
      </div>

      <div className={styles.center}>
        <h3>Follow Developer</h3>
        <p className={styles.desc}>Follow developer profile on Farcaster or Base App.</p>

        {isTaskDone ? (
          <span className={styles.done}>✅ Completed</span>
        ) : isVerifying ? (
          <button
            className={claimError ? styles.retryBtn : styles.verifyBtn}
            onClick={handleVerify}
            disabled={verifyLoading || retryTimer > 0}
          >
            {verifyLoading ? "Verifying..." : retryTimer > 0 ? `Retry in ${retryTimer}s` : "Click to Verify Follow"}
          </button>
        ) : hasFollowed ? (
          <button className={styles.claimBtn} onClick={handleClaim} disabled={isClaiming}>
            {isClaiming ? "Claiming..." : "Claim +50 PIM"}
          </button>
        ) : (
          <button className={styles.verifyBtn} onClick={handleFollowClick}>
            Follow Developer
          </button>
        )}
      </div>

      <div className={styles.right}>
        <span className={styles.reward}>+50 PIM</span>
      </div>
    </div>
  );
}
