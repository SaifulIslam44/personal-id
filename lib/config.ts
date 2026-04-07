import { createConfig, http } from "wagmi";
import { base, celo } from "wagmi/chains"; // celo ইম্পোর্ট করুন
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"], 
});

export const config = createConfig({
  chains: [base, celo], // এখানে celo অ্যাড করুন
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"),
    [celo.id]: http("https://forno.celo.org"), // Celo এর জন্য RPC
  },
  dataSuffix: DATA_SUFFIX,
});

