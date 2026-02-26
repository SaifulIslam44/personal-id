import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { Attribution } from "ox/erc8021";


const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"], 
});

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://base-mainnet.g.alchemy.com/v2/32tegXMoF5FiuVtoOrxzH"),
  },
  dataSuffix: DATA_SUFFIX,
});







