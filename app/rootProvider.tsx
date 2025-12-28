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






"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains"; // Mainnet
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider, createConfig, http } from "wagmi"; // যুক্ত করা হয়েছে
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // যুক্ত করা হয়েছে
import "@coinbase/onchainkit/styles.css";

// ১. Wagmi কনফিগ সেটআপ (যাতে আপনার হুকগুলো কাজ করে)
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
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
            wallet: {
              display: "modal",
              preference: "all",
            },
          }}
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