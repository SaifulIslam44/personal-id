// "use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { createConfig, http, WagmiProvider } from "wagmi";
// import { base } from "wagmi/chains";
// import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";


// // ১. Query Client তৈরি করুন
// const queryClient = new QueryClient();

// // ২. Wagmi Config তৈরি করুন
// export const config = createConfig({
//   chains: [base], // Farcaster Mini Apps সাধারণত Base chain-এ কাজ করে
//   transports: {
//     [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
//   },
//   connectors: [
//     farcasterMiniApp(), // এটিই Farcaster Wallet-এর সাথে কানেক্ট করে
//   ],
//   ssr: true,

// });

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         {children}
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }





















































































// "use client";
// import { ReactNode } from "react";
// import { base } from "wagmi/chains";
// import { OnchainKitProvider } from "@coinbase/onchainkit";
// import "@coinbase/onchainkit/styles.css";

// export function RootProvider({ children }: { children: ReactNode }) {
//   return (
//     <OnchainKitProvider
//       apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
//       chain={base}
//       config={{
//         appearance: {
//           mode: "auto",
//         },
//         wallet: {
//           display: "modal",
//           preference: "all",
//         },
//       }}
//       miniKit={{
//         enabled: true,
//         autoConnect: true,
//         notificationProxyUrl: undefined,
//       }}
//     >
//       {children}
//     </OnchainKitProvider>
//   );
// }






// "use client";
// import { ReactNode } from "react";
// import { base } from "wagmi/chains"; // Mainnet
// import { OnchainKitProvider } from "@coinbase/onchainkit";
// import { WagmiProvider, createConfig, http } from "wagmi"; // যুক্ত করা হয়েছে
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // যুক্ত করা হয়েছে
// import "@coinbase/onchainkit/styles.css";

// // ১. Wagmi কনফিগ সেটআপ (যাতে আপনার হুকগুলো কাজ করে)
// const config = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http(),
//   },
// });

// const queryClient = new QueryClient();

// export function RootProvider({ children }: { children: ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <OnchainKitProvider
//           apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
//           chain={base}
//           config={{
//             appearance: {
//               mode: "auto",
//             },
//             wallet: {
//               display: "modal",
//               preference: "all",
//             },
//           }}
//           miniKit={{
//             enabled: true,
//             autoConnect: true,
//             notificationProxyUrl: undefined,
//           }}
//         >
//           {children}
//         </OnchainKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }



























"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

// ১. Query Client তৈরি করুন (Root থেকে আনা)
const queryClient = new QueryClient();

// ২. Wagmi কনফিগ সেটআপ (যাতে আপনার হুকগুলো কাজ করে এবং Farcaster কানেক্ট হয়)
export const config = createConfig({
  chains: [base], // Farcaster Mini Apps সাধারণত Base chain-এ কাজ করে
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
  },
  connectors: [
    farcasterMiniApp(), // এটিই Farcaster Wallet-এর সাথে কানেক্ট করে
  ],
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "auto",
            },
            // পে-মাস্টার যাতে ফি কাটে তার জন্য URL যোগ করা হয়েছে [cite: 2026-01-26]
            paymaster: "https://api.developer.coinbase.com/rpc/v1/base/QgLBDzBBarpt7Ob9FpVSjk24cbzDsDeF",
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
          // miniKit সেটিংস হুবহু রাখা হয়েছে যাতে বিল্ড এরর না আসে [cite: 2026-01-26]
          miniKit={{
            enabled: true,
            autoConnect: true,
            notificationProxyUrl: undefined,
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}