// import { createConfig, http } from "wagmi";
// import { base } from "wagmi/chains";
// import { Attribution } from "ox/erc8021";

// // Get your Builder Code from base.dev > Settings > Builder Codes
// const DATA_SUFFIX = Attribution.toDataSuffix({
//   codes: ["bc_bmhx0p43"], // আপনার সঠিক বিল্ডার কোড
// });

// export const config = createConfig({
//   chains: [base],
//   transports: {
//     [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
//   },
//   dataSuffix: DATA_SUFFIX,
// });







import { createConfig, http, createStorage, cookieStorage } from "wagmi"; // createStorage ও cookieStorage ইমপোর্ট করুন
import { base } from "wagmi/chains";
import { Attribution } from "ox/erc8021";

// Get your Builder Code from base.dev > Settings > Builder Codes
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"],
});

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
  },
  // এই storage এবং ssr অংশটুকু নতুন যোগ করুন
  storage: createStorage({
    storage: cookieStorage, 
  }),
  ssr: true, 
  // ----------------------------------------
  dataSuffix: DATA_SUFFIX,
});



