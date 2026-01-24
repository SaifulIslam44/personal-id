"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";


// ১. Query Client তৈরি করুন
const queryClient = new QueryClient();

// ২. Wagmi Config তৈরি করুন
export const config = createConfig({
  chains: [base], // Farcaster Mini Apps সাধারণত Base chain-এ কাজ করে
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp(), // এটিই Farcaster Wallet-এর সাথে কানেক্ট করে
  ],

});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}