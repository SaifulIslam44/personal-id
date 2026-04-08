import { createConfig, http } from "wagmi";
import { base, celo } from "wagmi/chains"; // celo ইম্পোর্ট করুন
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"], 
});

export const config = createConfig({
  chains: [celo, base], // এখানে celo অ্যাড করুন
  transports: {
    [celo.id]: http("https://rpc.ankr.com/celo"),
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
    
  },
  dataSuffix: DATA_SUFFIX,
});





// [celo.id]: http("https://forno.celo.org"),