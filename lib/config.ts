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














import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { Attribution } from "ox/erc8021";
import { coinbaseWallet, injected } from "wagmi/connectors"; // কানেক্টর ইমপোর্ট করা হয়েছে

// Get your Builder Code from base.dev > Settings > Builder Codes
const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"], // আপনার সঠিক বিল্ডার কোড
});

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
  },
  // কানেক্টরগুলো এখানে অ্যাড করা হয়েছে যাতে রিফ্রেশ করলে ওয়ালেট মনে রাখতে পারে
  connectors: [
    injected(), 
    coinbaseWallet({ appName: "Personal ID Mint" }), // প্রয়োজনে অ্যাপের নাম দিন
  ],
  dataSuffix: DATA_SUFFIX,
  ssr: true, // সার্ভার সাইড রেন্ডারিং বা ফ্রেমের ক্ষেত্রে এটি সেশন ধরে রাখতে সাহায্য করে
});