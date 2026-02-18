"use client";

import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

export default function AutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // যদি কানেক্টেড না থাকে, তাহলে কানেক্ট করার চেষ্টা করবে
    if (!isConnected && connectors.length > 0) {
      const injectedConnector = connectors.find((c) => c.id === "coinbaseWalletSDK") || connectors[0];
      
      // কানেক্ট রিকোয়েস্ট পাঠানো হচ্ছে
      connect({ connector: injectedConnector });
    }
  }, [isConnected, connectors, connect]);

  return null; // এটার কোনো UI নেই, ব্যাকগ্রাউন্ডে কাজ করবে
}