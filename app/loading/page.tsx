



// "use client";

// import { useState, useEffect } from "react";
// import { useConnect, useAccount, useSignMessage } from "wagmi";
// import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
// import { useRouter } from "next/navigation";
// import styles from "./loading.module.css"; 

// export default function LoadingPage() {
//   const { connect, isPending: isConnecting } = useConnect();
//   const { isConnected, address } = useAccount();
//   const { signMessageAsync } = useSignMessage(); // সিগনেচার নেওয়ার জন্য
//   const [isLocalLoading, setIsLocalLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState("");
//   const router = useRouter();

//   const handleConnect = async () => {
//     try {
//       setIsLocalLoading(true);
//       setStatusMessage("Connecting...");
//       // বেস মিনি অ্যাপ কানেক্টর কল করা
//       connect({ connector: farcasterMiniApp() });
//     } catch (error) {
//       console.error("Connection failed:", error);
//       setIsLocalLoading(false);
//     }
//   };

//   // কানেকশন সফল হলে সিগনেচার নিয়ে প্রোফাইল পেজে রিডাইরেক্ট লজিক
//   useEffect(() => {
//     const verifyAndRedirect = async () => {
//       if (isConnected && address) {
//         try {
//           setStatusMessage("Verifying...");
          
//           // প্যাট্রিক ডোমেইন মিসম্যাচ ফিক্স করতে সিগনেচার চেয়েছিলেন
//           // এটি ওয়ালেটে আপনার ডোমেইন mint.personalids.xyz ভেরিফাই করবে
//           await signMessageAsync({
//             message: `Login to Personal Onchain ID\nDomain: ${window.location.host}\nAddress: ${address}`,
//           });

//           setStatusMessage("Redirecting...");
          
//           const timer = setTimeout(() => {
//             router.push("/profile");
//           }, 2000); // ভেরিফিকেশনের পর দ্রুত রিডাইরেক্ট

//           return () => clearTimeout(timer);
//         } catch (err) {
//           console.error("Signature failed:", err);
//           setStatusMessage("Signature Required");
//           setIsLocalLoading(false);
//         }
//       }
//     };

//     verifyAndRedirect();
//   }, [isConnected, address, router, signMessageAsync]);

//   const showLoader = isLocalLoading || isConnecting;

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.container}>
//         <div className={styles.logoSection}>
//           <div className={styles.logoCircle}>
//             <span className={styles.logoText}>ID</span>
//           </div>
//         </div>

//         <h1 className={styles.title}>Onchain Personal ID</h1>
//         <p className={styles.subtitle}>
//           Connect your wallet to mint and check-in daily.
//         </p>

//         <button
//           className={styles.signButton}
//           onClick={handleConnect}
//           disabled={showLoader || (isConnected && statusMessage === "Redirecting...")}
//         >
//           {showLoader ? (
//             <div className={styles.loader}></div>
//           ) : isConnected ? (
//             statusMessage || "Redirecting..."
//           ) : (
//             "Sign with Wallet"
//           )}
//         </button>

//         <p className={styles.footerText}>Powered by Base Network</p>
//       </div>
//     </div>
//   );
// }



























"use client";

import { useState, useEffect } from "react";
import { useConnect, useAccount, useSignMessage } from "wagmi";
import { useRouter } from "next/navigation";
import styles from "./loading.module.css"; 

export default function LoadingPage() {
  // ✅ [FIXED] connectors ইম্পোর্ট করা হয়েছে যাতে config থেকে সঠিক কানেক্টর বেছে নেওয়া যায়
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage(); // সিগনেচার নেওয়ার জন্য
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  const handleConnect = async () => {
    try {
      setIsLocalLoading(true);
      setStatusMessage("Connecting...");
      
      // ✅ [FIXED] সরাসরি farcasterMiniApp() কল না করে connectors লিস্ট থেকে আইডি অনুযায়ী খুঁজে বের করা হয়েছে
      const fcConnector = connectors.find((c) => c.id === "farcaster-mini-app") || connectors[0];
      
      connect({ connector: fcConnector });
    } catch (error) {
      console.error("Connection failed:", error);
      setIsLocalLoading(false);
      setStatusMessage("Connection failed");
    }
  };

  // কানেকশন সফল হলে সিগনেচার নিয়ে প্রোফাইল পেজে রিডাইরেক্ট লজিক
  useEffect(() => {
    const verifyAndRedirect = async () => {
      if (isConnected && address) {
        try {
          setStatusMessage("Verifying...");
          
          // প্যাট্রিক ডোমেইন মিসম্যাচ ফিক্স করতে সিগনেচার চেয়েছিলেন
          // এটি ওয়ালেটে আপনার ডোমেইন mint.personalids.xyz ভেরিফাই করবে
          await signMessageAsync({
            message: `Login to Personal Onchain ID\nDomain: ${window.location.host}\nAddress: ${address}`,
          });

          setStatusMessage("Redirecting...");
          
          const timer = setTimeout(() => {
            router.push("/profile");
          }, 2000); // ভেরিফিকেশনের পর দ্রুত রিডাইরেক্ট

          return () => clearTimeout(timer);
        } catch (err) {
          console.error("Signature failed:", err);
          setStatusMessage("Signature Required");
          setIsLocalLoading(false);
        }
      }
    };

    verifyAndRedirect();
  }, [isConnected, address, router, signMessageAsync]);

  const showLoader = isLocalLoading || isConnecting;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>ID</span>
          </div>
        </div>

        <h1 className={styles.title}>Onchain Personal ID</h1>
        <p className={styles.subtitle}>
          Connect your wallet to mint and check-in daily to earn rewards.
        </p>

        <button
          className={styles.signButton}
          onClick={handleConnect}
          disabled={showLoader || (isConnected && statusMessage === "Redirecting...")}
        >
          {showLoader ? (
            <div className={styles.loader}></div>
          ) : isConnected ? (
            statusMessage || "Redirecting..."
          ) : (
            "Sign with Wallet"
          )}
        </button>

        <p className={styles.footerText}>Powered by Base Network</p>
      </div>
    </div>
  );
}