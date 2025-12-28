
// const ROOT_URL = (
//   process.env.NEXT_PUBLIC_URL ||
//   (process.env.VERCEL_PROJECT_PRODUCTION_URL
//     ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//     : "http://localhost:3000")
// ).trim();

// export const minikitConfig = {
  // accountAssociation: {
  //   "header": "eyJmaWQiOjEwNTAyNjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkM2U4MzhFQThmMjczYzdkMzlDNmViMzUxMDMwOGJGNUNkYUUyY2VFIn0",
  //   "payload": "eyJkb21haW4iOiJtaW50LnBlcnNvbmFsaWRzLnh5eiJ9",
  //   "signature": "sZBMFygdlbt5QDf2mGFW984Hek0qfWIOwjeYltVD3HogwvctWdu5IubQNZDf0A0Vinra0QJk1tCcHJb5ZJqrSxs="
  // },

//   miniapp: {
//     version: "1",
//     name: "Personal ID Mint",
//     subtitle: "Onchain ID Mint",
//     description:
//       "Mint a unique Onchain ID on Base. Features Daily Check-in to build a streak and share progress on social media.",
//     tagline: "Mint your onchain identity",
//     ogTitle: "Personal ID Mint",
//     ogDescription: "Mint a unique onchain ID on Base with daily check-in streaks.",
//     ogImageUrl: `${ROOT_URL}/og.png`,
//     noindex: false,

//     capabilities: {
//       wallet: {

//         smartWalletOnly: false, 
//       },
//       atomicBatch: true, 
//     },

//     screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
//     iconUrl: `${ROOT_URL}/icon.png`,
//     heroImageUrl: `${ROOT_URL}/hero.png`,
//     splashImageUrl: `${ROOT_URL}/hero.png`,
//     splashBackgroundColor: "#000000",
//     homeUrl: ROOT_URL,
//     webhookUrl: `${ROOT_URL}/api/webhook`,
//     requiresAccountAssociation: true, 
//     primaryCategory: "social",
//     tags: ["identity", "mint", "onchain", "streak", "social"],
//   },

//   frame: {
//     version: "1",
//     name: "Personal ID Mint",
//     iconUrl: `${ROOT_URL}/icon.png`,
//     splashImageUrl: `${ROOT_URL}/hero.png`,
//     splashBackgroundColor: "#000000",
//     action: {
//       type: "launch_frame",
//       name: "Mint ID",
//       url: ROOT_URL,
//     },
//   },
// };
















import type { MiniAppManifest } from "@coinbase/onchainkit/minikit";


const ROOT_URL = "https://mint.personalids.xyz";


export const minikitConfig: MiniAppManifest = {
  // accountAssociation: {
  //   header: "eyJmaWQiOjEwNTAyNjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhkM2U4MzhFQThmMjczYzdkMzlDNmViMzUxMDMwOGJGNUNkYUUyY2VFIn0",
  //   payload: "eyJkb21haW4iOiJtaW50LnBlcnNvbmFsaWRzLnh5eiJ9",
  //   signature: "sZBMFygdlbt5QDf2mGFW984Hek0qfWIOwjeYltVD3HogwvctWdu5IubQNZDf0A0Vinra0QJk1tCcHJb5ZJqrSxs=",
  // },


  miniapp: {
    version: "1",
    name: "Personal ID Mint",
    subtitle: "Onchain ID Mint",
    description:
      "Mint a unique Onchain ID on Base. Features Daily Check-in to earn rewards and share progress on social media.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["identity", "mint", "onchain", "rewards"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Mint your onchain identity",
    ogTitle: "Personal ID Mint",
    ogDescription: "Mint a unique onchain ID on Base with daily check-in Rewards",
    ogImageUrl: `${ROOT_URL}/og.png`,
  },
};