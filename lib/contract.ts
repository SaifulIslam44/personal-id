


// // lib/contract.ts

// import { type Address } from "viem";

// // Base Mainnet Contract Address
// export const CONTRACT_ADDRESS: Address = "0x391c872975D655eFA512B6c7aE91F427d1452A17";

// // Base Mainnet ABI
// export const ABI = [
//   {
//     "inputs": [
//       { "internalType": "address", "name": "to", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "approve",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "dailyCheckIn",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "sender", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
//       { "internalType": "address", "name": "owner", "type": "address" }
//     ],
//     "name": "ERC721IncorrectOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "operator", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "ERC721InsufficientApproval",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }],
//     "name": "ERC721InvalidApprover",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }],
//     "name": "ERC721InvalidOperator",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
//     "name": "ERC721InvalidOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }],
//     "name": "ERC721InvalidReceiver",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
//     "name": "ERC721InvalidSender",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
//     "name": "ERC721NonexistentToken",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
//     "name": "OwnableInvalidOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
//     "name": "OwnableUnauthorizedAccount",
//     "type": "error"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
//       { "indexed": true, "internalType": "address", "name": "approved", "type": "address" },
//       { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "Approval",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
//       { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
//       { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }
//     ],
//     "name": "ApprovalForAll",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": false, "internalType": "uint256", "name": "_fromTokenId", "type": "uint256" },
//       { "indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256" }
//     ],
//     "name": "BatchMetadataUpdate",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
//       { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
//     ],
//     "name": "CheckedIn",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
//       { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
//       { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }
//     ],
//     "name": "IDMinted",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
//     "name": "MetadataUpdate",
//     "type": "event"
//   },
//   {
//     "inputs": [{ "internalType": "string", "name": "tokenURI", "type": "string" }],
//     "name": "mintID",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
//       { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
//     ],
//     "name": "OwnershipTransferred",
//     "type": "event"
//   },
//   {
//     "inputs": [],
//     "name": "renounceOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "from", "type": "address" },
//       { "internalType": "address", "name": "to", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "safeTransferFrom",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "from", "type": "address" },
//       { "internalType": "address", "name": "to", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
//       { "internalType": "bytes", "name": "data", "type": "bytes" }
//     ],
//     "name": "safeTransferFrom",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "operator", "type": "address" },
//       { "internalType": "bool", "name": "approved", "type": "bool" }
//     ],
//     "name": "setApprovalForAll",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "_newFee", "type": "uint256" }],
//     "name": "setCheckInFee",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "_newFee", "type": "uint256" }],
//     "name": "setMintFee",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
//       { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
//       { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "Transfer",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "from", "type": "address" },
//       { "internalType": "address", "name": "to", "type": "address" },
//       { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
//     ],
//     "name": "transferFrom",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
//     "name": "transferOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "withdraw",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
//     "name": "balanceOf",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "checkInFee",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
//     "name": "getApproved",
//     "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "name": "hasMinted",
//     "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       { "internalType": "address", "name": "owner", "type": "address" },
//       { "internalType": "address", "name": "operator", "type": "address" }
//     ],
//     "name": "isApprovedForAll",
//     "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
//     "name": "isIdHolder",
//     "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "name": "lastCheckIn",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "mintFee",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "name",
//     "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
//     "name": "ownerOf",
//     "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
//     "name": "supportsInterface",
//     "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "symbol",
//     "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
//     "name": "tokenURI",
//     "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ] as const;









// 0x6f010f76AB54E893327b1Ed5A0D91464e06E04B6

//0x447D55C0BEBA932CCBe6cAf2Fcd50D2f7d309f0d proxy main logic contract
//0x8C05C76496556D9071bB1CEB941d7641Da82e5d2 proxy contract user public


// lib/contract.ts

import { type Address } from "viem";

// Base Mainnet Contract Address
export const CONTRACT_ADDRESS: Address = "0x8C05C76496556D9071bB1CEB941d7641Da82e5d2";

// Base Mainnet Updated ABI
export const ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "adminBurnNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "adminClearBio",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "additionalDays", "type": "uint256" }
    ],
    "name": "adminExtendSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "adminMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "adminReduceActivity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "adminResetMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "adminResetSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "adminResetUserPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "level", "type": "uint256" }
    ],
    "name": "adminSetNFTLevel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "daysFromNow", "type": "uint256" }
    ],
    "name": "adminSetSubscriptionManual",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "durationInDays", "type": "uint256" }
    ],
    "name": "adminSetUserSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "address", "name": "newReferrer", "type": "address" }
    ],
    "name": "adminUpdateReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "airdropPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "to", "type": "address[]" },
      { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }
    ],
    "name": "batchTransferNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_msg", "type": "string" },
      { "internalType": "uint256", "name": "_importance", "type": "uint256" }
    ],
    "name": "broadcastAnnouncement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "name": "bulkAirdropPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "bool", "name": "status", "type": "bool" }
    ],
    "name": "bulkBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address[]", "name": "users", "type": "address[]" }],
    "name": "bulkResetPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "burnContractEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "burnRewardTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "burnUserPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "buyNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "daysCount", "type": "uint256" }],
    "name": "buySubWithPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "cancelNFTListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimProfileBonus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReferralETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyCheckIn",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disableCheckIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disableClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disableMinting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "disablePointTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "uint256[]", "name": "rewards", "type": "uint256[]" }
    ],
    "name": "distributeRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "donatePointsToCommunity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyShutdown",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "enableCheckIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_maxUsers", "type": "uint256" }],
    "name": "enableClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "enableMinting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "enablePointTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "forceTransferNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "inputs": [{ "internalType": "address", "name": "target", "type": "address" }],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  { "inputs": [], "name": "AddressInvalid", "type": "error" },
  { "inputs": [], "name": "AlreadyMintedID", "type": "error" },
  { "inputs": [], "name": "ClaimNotActive", "type": "error" },
  { "inputs": [], "name": "ContractBalanceLow", "type": "error" },
  {
    "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }],
    "name": "ERC1967InvalidImplementation",
    "type": "error"
  },
  { "inputs": [], "name": "ERC1967NonPayable", "type": "error" },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  { "inputs": [], "name": "FailedCall", "type": "error" },
  { "inputs": [], "name": "FeeIncorrect", "type": "error" },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "giftMint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "GlobalLimitReached", "type": "error" },
  { "inputs": [], "name": "IDNotFound", "type": "error" },
  {
    "inputs": [{ "internalType": "address", "name": "rewardTokenAddress", "type": "address" }],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "InsufficientPointsToClaim", "type": "error" },
  { "inputs": [], "name": "InvalidInitialization", "type": "error" },
  { "inputs": [], "name": "IsPaused", "type": "error" },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "listNFTForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_msg", "type": "string" }],
    "name": "logAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "tokenURI", "type": "string" }],
    "name": "mintID",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "MintingNotEnabled", "type": "error" },
  { "inputs": [], "name": "NotAuthorized", "type": "error" },
  { "inputs": [], "name": "NotInitializing", "type": "error" },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "partialWithdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "PointsTooLow", "type": "error" },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "recoverERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address payable", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "refundUserGas",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "renounceOwnershipPermanently", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "resetUserCheckIn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "revokeID",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "SendFailed", "type": "error" },
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" },
      { "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_newBaseURI", "type": "string" }],
    "name": "setBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "bool", "name": "status", "type": "bool" }
    ],
    "name": "setBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_newFee", "type": "uint256" }],
    "name": "setCheckInFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_points", "type": "uint256" }],
    "name": "setCheckInRewardPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_timestamp", "type": "uint256" }],
    "name": "setClaimDeadline",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_fee", "type": "uint256" }],
    "name": "setClaimServiceFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_uri", "type": "string" }],
    "name": "setContractURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "rate", "type": "uint256" }
    ],
    "name": "setCustomUserRewardRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_limit", "type": "uint256" }],
    "name": "setDailyGlobalClaimLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_limit", "type": "uint256" }],
    "name": "setMaxMintPerWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_limit", "type": "uint256" }],
    "name": "setMaxPointsLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_level", "type": "uint256" }],
    "name": "setMinLevelToClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_level", "type": "uint256" }],
    "name": "setMinLevelTransfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "p", "type": "uint256" }],
    "name": "setMinPointsToClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_newFee", "type": "uint256" }],
    "name": "setMintFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_points", "type": "uint256" }],
    "name": "setMintRewardPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_startTime", "type": "uint256" }],
    "name": "setMintTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "expirationTimestamp", "type": "uint256" }
    ],
    "name": "setNFTExpiration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_endTime", "type": "uint256" }],
    "name": "setOfferTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "notice", "type": "string" }],
    "name": "setOfficialNotice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "status", "type": "bool" }],
    "name": "setPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_percent", "type": "uint256" }],
    "name": "setReferralCommission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "address", "name": "referrer", "type": "address" }
    ],
    "name": "setReferrer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "m", "type": "uint256" }],
    "name": "setRewardMultiplier",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_rateInEther", "type": "uint256" }],
    "name": "setRewardRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_percent", "type": "uint256" }],
    "name": "setRoyalty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_receiver", "type": "address" }],
    "name": "setRoyaltyReceiver",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_points", "type": "uint256" }],
    "name": "setSecondaryReferralPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_threshold", "type": "uint256" }],
    "name": "setStackingThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_fee", "type": "uint256" }],
    "name": "setSubscriptionFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_tax", "type": "uint256" }],
    "name": "setTransferTax",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }],
    "name": "setTreasuryWallet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "setUserPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "bool", "name": "status", "type": "bool" }
    ],
    "name": "setWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "TimeLimitError", "type": "error" },
  {
    "inputs": [{ "internalType": "bool", "name": "status", "type": "bool" }],
    "name": "toggleBioUpdate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "_status", "type": "bool" }],
    "name": "toggleBuyPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "status", "type": "bool" }],
    "name": "toggleGiftMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "_status", "type": "bool" }],
    "name": "togglePublicMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "_status", "type": "bool" }],
    "name": "toggleReferral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bool", "name": "status", "type": "bool" }],
    "name": "toggleUpgrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }],
    "name": "transferOwnershipSecurely",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "points", "type": "uint256" }
    ],
    "name": "transferPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_msg", "type": "string" }],
    "name": "updateAnnouncement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "bio", "type": "string" }],
    "name": "updateBio",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_newURI", "type": "string" }],
    "name": "updateContractURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_newPoints", "type": "uint256" }],
    "name": "updateReferralPoints",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "newToken", "type": "address" }],
    "name": "updateRewardToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "string", "name": "newURI", "type": "string" }
    ],
    "name": "updateTokenURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newImplementation", "type": "address" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  { "inputs": [], "name": "UUPSUnauthorizedCallContext", "type": "error" },
  { "inputs": [{ "internalType": "bytes32", "name": "slot", "type": "bytes32" }], "name": "UUPSUnsupportedProxiableUUID", "type": "error" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "message", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "importance", "type": "uint256" }
    ],
    "name": "AdminAnnouncement",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "approved", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "operator", "type": "address" },
      { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "_fromTokenId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "_toTokenId", "type": "uint256" }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "newBio", "type": "string" }
    ],
    "name": "BioUpdated",
    "type": "event"
  },
  { "anonymous": false, "inputs": [], "name": "CheckInDisabled", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "CheckInEnabled", "type": "event" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CheckedIn",
    "type": "event"
  },
  { "anonymous": false, "inputs": [], "name": "ClaimDisabled", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "ClaimEnabled", "type": "event" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "message", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "CustomLog",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "IDMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": false, "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
    "name": "MetadataUpdate",
    "type": "event"
  },
  { "anonymous": false, "inputs": [], "name": "MintingDisabled", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "MintingEnabled", "type": "event" },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "NFTExpired",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" }
    ],
    "name": "NFTListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "NFTListingCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }
    ],
    "name": "NFTSale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  { "anonymous": false, "inputs": [], "name": "PointTransferDisabled", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "PointTransferEnabled", "type": "event" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "points", "type": "uint256" }
    ],
    "name": "PointsTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "referrer", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "rewardAmount", "type": "uint256" }
    ],
    "name": "ReferralRewarded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "rewardAmount", "type": "uint256" }
    ],
    "name": "RewardsClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "planId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "expiration", "type": "uint256" }
    ],
    "name": "SubscriptionActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }],
    "name": "SubscriptionCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }],
    "name": "Upgraded",
    "type": "event"
  },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "address", "name": "_to", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" }
    ],
    "name": "withdrawToAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "activityScore",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bioUpdateEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyPointsEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkInEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkInFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkInRewardPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimDeadline",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimServiceFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "communityPoolPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentAnnouncement",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentClaimersCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "customUserRewardRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyGlobalClaimLimit",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getApproved",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getBoostedPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractEthBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFullContractState",
    "outputs": [
      { "internalType": "uint256", "name": "ethBal", "type": "uint256" },
      { "internalType": "uint256", "name": "tokenBal", "type": "uint256" },
      { "internalType": "uint256", "name": "claimers", "type": "uint256" },
      { "internalType": "bool", "name": "paused", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getFullUserStats",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserLifetimePoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserSubscriptionStatus",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "giftMintEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasMinted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasReceivedProfileBonus",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "operator", "type": "address" }
    ],
    "name": "isApprovedForAll",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "isBlacklisted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isIdHolder",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isInactive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "isNFTExpired",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPaused",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isSubscriptionActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "isWhitelisted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "lastCheckIn",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxClaimers",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxPointsPerWallet",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minLevelToClaim",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minLevelToTransfer",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minPointsToClaim",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintRewardPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintStartTime",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "nftExpiration",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "nftLevel",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "nftPrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "nftSeller",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "offerEndTime",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "officialNotice",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "ownerOf",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pointTransferEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "referralBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "referralCommissionPercent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "referralEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "referralRewardPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardMultiplier",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardRate",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "royaltyPercent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "royaltyReceiver",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "secondaryReferralPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stackingThreshold",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
    "name": "supportsInterface",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "totalPointsEarnedEver",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "transferTax",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryWallet",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADE_INTERFACE_VERSION",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "upgradeEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userBio",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userReferrer",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "userSubscriptionStatus",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;