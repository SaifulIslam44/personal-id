// import { createConfig, http } from "wagmi";
// import { base, celo } from "wagmi/chains"; 
// import { Attribution } from "ox/erc8021";

// const DATA_SUFFIX = Attribution.toDataSuffix({
//   codes: ["bc_bmhx0p43"], 
// });

// export const config = createConfig({
//   chains: [celo, base], 
//   transports: {
//     [celo.id]: http("https://celo-json-rpc.stakely.io"),
//     [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    
//   },
//   dataSuffix: DATA_SUFFIX,
// });





// [celo.id]: http("https://forno.celo.org"),





import { createConfig, http, fallback } from "wagmi";
import { base, celo } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"],
});

export const config = createConfig({
  chains: [celo, base],

  connectors: [
    farcasterMiniApp(),
  ],

  transports: {
    // 🔴 এখানে fallback যোগ করা হলো
    // [celo.id]: fallback([
    //   http(process.env.NEXT_PUBLIC_CELO_RPC_URL),
    //   http("https://forno.celo.org"),            
    //   http("https://rpc.ankr.com/celo"),         
    //   http("https://celo-json-rpc.stakely.io"),  
    // ]),

    [celo.id]: http(
      process.env.NEXT_PUBLIC_CELO_RPC_URL
    ),

    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL
    ),
  },

  dataSuffix: DATA_SUFFIX,
  ssr: true,
});