import { createConfig, http } from "wagmi";
import { base, celo } from "wagmi/chains"; 
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_bmhx0p43"], 
});

export const config = createConfig({
  chains: [celo, base], 
  transports: {
    [celo.id]: http("https://rpc.ankr.com/celo"),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    
  },
  dataSuffix: DATA_SUFFIX,
});





// [celo.id]: http("https://forno.celo.org"),