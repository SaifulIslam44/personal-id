"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import sdk from "@farcaster/frame-sdk"; // এটি যুক্ত করুন
import miniapp from "@farcaster/miniapp-sdk";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      
      await miniapp.actions.ready();
     
      await sdk.actions.ready(); 
       
      
      router.replace("/loading");
    };

    initialize();
  }, [router]);

  return null;
}