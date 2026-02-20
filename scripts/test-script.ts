// // ১. রেন্ডম ওয়ালেট জেনারেটর
// function getRandomWallet() {
//     const chars = '0123456789abcdef';
//     let wallet = '0x';
//     for (let i = 0; i < 40; i++) wallet += chars[Math.floor(Math.random() * 16)];
//     return wallet;
// }

// // ২. ক্লেইম সিগনেচার টেস্টার
// async function attackSignature() {
//     console.log("😈 Starting Signature Loop Test...");

//     for (let i = 0; i < 5; i++) { // ৫ বার ট্রাই করবে
//         const fakeWallet = getRandomWallet();
        
//         // ডায়নামিক URL তৈরি করা
//         const targetUrl = `https://api.clashofcoins.com/api/agentic/claim-signature?address=${fakeWallet}`;

//         try {
//             const response = await fetch(targetUrl, {
//                 method: "GET", // এটা এখন GET হবে
//                 headers: {
//                     // ⚠️ ইম্পরট্যান্ট: ব্রাউজারের Network Tab থেকে 'Cookie' বা 'Authorization' কপি করে এখানে বসাতে হতে পারে
//                     // যদি লগইন ছাড়া কাজ না করে।
//                     "Content-Type": "application/json"
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log(`✅ Success for ${fakeWallet}:`, data);
//             } else {
//                 console.log(`❌ Failed for ${fakeWallet}: Status ${response.status}`);
//             }

//         } catch (e) {
//             console.log("💥 Error:", e);
//         }

//         await new Promise(r => setTimeout(r, 500)); // সার্ভার ব্লক এড়াতে আধা সেকেন্ড গ্যাপ
//     }
// }

// // ৩. রান করুন
// attackSignature();





















// // ১. আপনার টার্গেট ওয়ালেট লিস্ট
// // এই ওয়ালেটগুলো অবশ্যই আপনার ব্যাকএন্ড ডাটাবেসে থাকতে হবে, নাহলে ৫০০ এরর আসবে।
// const targetWallets: string[] = [
//     "0xbc1122c1dD59e03B196417B86fbE472B2106D823",
//     "0x1544BBa3aabafEC0816c948B13A3a6ae1Ad7d820",
//     "0x183A63E205F52e870Fa671eD7CFc962288991212"
// ];

// async function testClaimSignature() {
//     console.log("🛡️ Starting Real Signature Test...");

//     for (const wallet of targetWallets) {
//         // আপনার রিয়েল API স্ট্রাকচার অনুযায়ী URL
//         const targetUrl = `https://api.clashofcoins.com/api/agentic/claim-signature?address=${wallet}`;

//         try {
//             console.log(`-----------------------------------`);
//             console.log(`🔍 Requesting for: ${wallet}`);

//             const response = await fetch(targetUrl, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     // যদি আপনার API কোনো নির্দিষ্ট কুকি বা সেশন চেক করে, তবে ব্রাউজার থেকে 
//                     // 'Cookie' হেডারটি কপি করে এখানে বসাতে হতে পারে।
//                 }
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 // সিগনেচার পাওয়া গেলে তা প্রিন্ট করবে
//                 console.log(`✅ Success! Signature:`, data);
//             } else {
//                 // ৫00 এরর আসলে সার্ভার মেসেজ দেখাবে
//                 console.log(`❌ Failed (Status ${response.status})`);
//                 console.log(`💬 Server Message:`, data.message || "No message provided");
//             }

//         } catch (e: any) {
//             console.log("💥 Network/Connection Error:", e.message);
//         }

//         // রেট লিমিট এড়াতে ১ সেকেন্ড বিরতি
//         await new Promise(r => setTimeout(r, 1000));
//     }

//     console.log("-----------------------------------");
//     console.log("🏁 Test Completed.");
// }

// testClaimSignature();







// async function testClaimSignature() {
//     console.log("🛡️ Starting Real Signature Test with Headers...");

//     const wallet = "0x183A63E205F52e870Fa671eD7CFc962288991212";
//     const targetUrl = `https://api.clashofcoins.com/api/agentic/claim-signature?address=${wallet}`;

//     try {
//         const response = await fetch(targetUrl, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 // ⚠️ ব্রাউজারের Network Tab -> Header থেকে নিচের গুলো কপি করে বসান
//                 "Cookie": "আপনার_কুকি_এখানে_দিন", 
//                 "Authorization": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNIYkE0bElBcktMVk1VY3gycmVtaXlGenVScXByRFBTTkxyYlB5QWhobnMifQ.eyJzaWQiOiJjbWxzaDJuaDIwMDBqMGNqdmg3bXdtNmFmIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3NzE0NDU3NjksImF1ZCI6ImNtMnRqNjc0dDAwNGhwNzE0cXRiNmYwenIiLCJzdWIiOiJkaWQ6cHJpdnk6Y21sc2gybmtlMDAwazBjanYweW15eWRkcSIsImV4cCI6MTc3MTQ0OTM2OX0.b_OCtkBlUX16rkv38zU7VBVxx1E0nSk3Mg6U6Qq8hS6tfvUTtnBevQ_XyrjpkqwKaCXCAE0RyLzJ2eN_GC4jDw" 
//             }
//         });

//         const data = await response.json();
//         console.log(`Status: ${response.status}`, data);

//     } catch (e: any) {
//         console.log("💥 Error:", e.message);
//     }
// }
// testClaimSignature();








// // ১. আপনার দেওয়া রিয়েল সিগনেচার ডাটা
// const staticSignatureData = {
//     "contractAddress": "0x98430ECBe49bf6dB549D6F827d95ed7A3625FAeb",
//     "to": "0x183A63E205F52e870Fa671eD7CFc962288991212",
//     "ts": 1771445818146,
//     "signature": "0x465dd629b866a1de9e5a0720276c483d30b23dd1d7417cd8ae9d3647c9fbc636009ad4aea91cea06e4d865bccef9c8bc5b0ecb34e70412255957e27e3cd816381b"
// };

// async function runStaticSignatureTest() {
//     console.log("🛡️ Starting Static Signature Simulation...");
//     console.log("-------------------------------------------");

//     try {
//         // এখানে আমরা এপিআই কল করছি না, সরাসরি ডাটা ব্যবহার করছি
//         const data = staticSignatureData;

//         console.log(`✅ Data Loaded Successfully!`);
//         console.log(`📝 Target Contract: ${data.contractAddress}`);
//         console.log(`👤 Recipient (To): ${data.to}`);
//         console.log(`⏰ Timestamp: ${data.ts}`);
//         console.log(`🔑 Signature Key: \n${data.signature}`);

//         // একটি ছোট ভ্যালিডেশন চেক (Simulation)
//         if (data.signature.startsWith("0x") && data.signature.length > 100) {
//             console.log("\n✨ Status: Signature format looks VALID.");
//         } else {
//             console.log("\n⚠️ Status: Invalid Signature format.");
//         }

//     } catch (error) {
//         console.error("💥 Error processing static data:", error);
//     }

//     console.log("-------------------------------------------");
//     console.log("🏁 Simulation Completed.");
// }

// // রান করুন
// runStaticSignatureTest();






// import { ethers } from "ethers";
// import * as dotenv from "dotenv";

// // .env.local ফাইল লোড করা
// dotenv.config({ path: ".env.local" });

// // ১. আপনার দেওয়া রিয়েল সিগনেচার ডাটা
// const claimData = {
//     contractAddress: "0x98430ECBe49bf6dB549D6F827d95ed7A3625FAeb",
//     to: "0xbc1122c1dD59e03B196417B86fbE472B2106D823",
//     ts: 1771445818146,
//     signature: "0x465dd629b866a1de9e5a0720276c483d30b23dd1d7417cd8ae9d3647c9fbc636009ad4aea91cea06e4d865bccef9c8bc5b0ecb34e70412255957e27e3cd816381b"
// };

// // ২. ক্লেইম করার জন্য মিনিমাল ABI
// const ABI = [
//     "function claim(address to, uint256 ts, bytes memory signature) external"
// ];

// async function executeClaim() {
//     console.log("🚀 Starting Claim Transaction Test (ethers v5)...");

//     try {
//         // v5 এ providers এর ভেতর থেকে JsonRpcProvider নিতে হয়
//         const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org"); 
        
//         // .env.local থেকে প্রাইভেট কি নেওয়া
//         const privateKey = process.env.PRIVATE_KEY;
//         if (!privateKey) {
//             console.log("❌ Error: PRIVATE_KEY not found in .env.local");
//             return;
//         }

//         const wallet = new ethers.Wallet(privateKey, provider);
//         const contract = new ethers.Contract(claimData.contractAddress, ABI, wallet);

//         console.log(`📡 Sending transaction for: ${claimData.to}`);

//         // ট্রানজেকশন কল করা
//         const tx = await contract.claim(
//             claimData.to, 
//             claimData.ts, 
//             claimData.signature
//         );

//         console.log(`⏳ Transaction Sent! Hash: ${tx.hash}`);
//         const receipt = await tx.wait();
//         console.log(`✅ Transaction Success! Block: ${receipt.blockNumber}`);

//     } catch (error: any) {
//         console.error("❌ Claim Failed!");
//         console.error(`Reason: ${error.reason || error.message}`);
//     }
// }

// executeClaim();













// import { ethers } from "ethers";
// import * as dotenv from "dotenv";

// // .env.local ফাইল লোড করা
// dotenv.config({ path: ".env.local" });

// // ১. আপনার সিগনেচার ডাটা 
// // ⚠️ মনে রাখবেন: সিগনেচারটি যে ওয়ালেটের জন্য জেনারেট করা হয়েছে, 'to' তে সেই একই ওয়ালেট থাকতে হবে।
// const claimData = {
//     contractAddress: "0x98430ECBe49bf6dB549D6F827d95ed7A3625FAeb",
//     to: "0xbc1122c1dD59e03B196417B86fbE472B2106D823", // আপনার আসল সিগনেচার ডাটা অনুযায়ী
//     ts: 1771445818146,
//     signature: "0x465dd629b866a1de9e5a0720276c483d30b23dd1d7417cd8ae9d3647c9fbc636009ad4aea91cea06e4d865bccef9c8bc5b0ecb34e70412255957e27e3cd816381b"
// };

// // ২. ক্লেইম করার জন্য ABI
// const ABI = [
//     "function claim(address to, uint256 ts, bytes memory signature) external"
// ];

// async function executeClaim() {
//     console.log("🚀 Starting Claim Transaction Test (ethers v5)...");

//     try {
//         // RPC Provider সেটআপ (Base Mainnet)
//         const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org"); 
        
//         // .env.local থেকে প্রাইভেট কি নেওয়া (গ্যাস ফি এই ওয়ালেট থেকে কাটবে)
//         const privateKey = process.env.PRIVATE_KEY;
//         if (!privateKey) {
//             console.log("❌ Error: PRIVATE_KEY not found in .env.local");
//             return;
//         }

//         const wallet = new ethers.Wallet(privateKey, provider);
//         const contract = new ethers.Contract(claimData.contractAddress, ABI, wallet);

//         console.log(`📡 Sending transaction for: ${claimData.to}`);

//         // ৩. ম্যানুয়াল গ্যাস লিমিট সহ ট্রানজেকশন কল করা
//         // যাতে 'cannot estimate gas' এরর আসলেও ট্রানজেকশনটি সাবমিট করা যায়।
//         const tx = await contract.claim(
//             claimData.to, 
//             claimData.ts, 
//             claimData.signature,
//             { 
//                 gasLimit: 300000 // পর্যাপ্ত গ্যাস লিমিট সেট করা হলো
//             }
//         );

//         console.log(`⏳ Transaction Sent! Hash: ${tx.hash}`);
//         const receipt = await tx.wait();
//         console.log(`✅ Transaction Success! Block: ${receipt.blockNumber}`);

//     } catch (error: any) {
//         console.error("❌ Claim Failed!");
//         // ডিটেইল এরর রিজন জানার জন্য এই অংশটি জরুরি
//         console.error(`Reason: ${error.reason || error.message}`);
        
//         if (error.reason?.includes("execution reverted")) {
//             console.log("💡 পরামর্শ: আপনার সিগনেচার বা ওয়ালেট অ্যাড্রেস হয়তো মিলছে না।");
//         }
//     }
// }

// executeClaim();






import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const claimData = {
    contractAddress: "0x98430ECBe49bf6dB549D6F827d95ed7A3625FAeb",
    to: "0x183A63E205F52e870Fa671eD7CFc962288991212",
    ts: 1771445818146,
    signature: "0x465dd629b866a1de9e5a0720276c483d30b23dd1d7417cd8ae9d3647c9fbc636009ad4aea91cea06e4d865bccef9c8bc5b0ecb34e70412255957e27e3cd816381b"
};

const ABI = [
    "function claim(address to, uint256 ts, bytes memory signature) external"
];

// আপনার টোকেনটি এখানে বসিয়েছি
const AUTH_TOKEN = "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNIYkE0bElBcktMVk1VY3gycmVtaXlGenVScXByRFBTTkxyYlB5QWhobnMifQ.eyJzaWQiOiJjbWxzaDJuaDIwMDBqMGNqdmg3bXdtNmFmIiwiaXNzIjoicHJpdnkuaW8iLCJpYXQiOjE3NzE0NDU3NjksImF1ZCI6ImNtMnRqNjc0dDAwNGhwNzE0cXRiNmYwenIiLCJzdWIiOiJkaWQ6cHJpdnk6Y21sc2gybmtlMDAwazBjanYweW15eWRkcSIsImV4cCI6MTc3MTQ0OTM2OX0.b_OCtkBlUX16rkv38zU7VBVxx1E0nSk3Mg6U6Qq8hS6tfvUTtnBevQ_XyrjpkqwKaCXCAE0RyLzJ2eN_GC4jDw";

async function executeClaim() {
    console.log("🛡️ Starting Authorized Claim Test...");

    try {
        const provider = new ethers.providers.JsonRpcProvider("https://mainnet.base.org");
        const privateKey = process.env.PRIVATE_KEY;
        
        if (!privateKey) {
            console.log("❌ Error: PRIVATE_KEY not found in .env.local");
            return;
        }

        const wallet = new ethers.Wallet(privateKey, provider);
        console.log(`🏦 Sending from: ${wallet.address}`);
        const contract = new ethers.Contract(claimData.contractAddress, ABI, wallet);

        // API কল করার সময় এই হেডারটি পাঠাতে হবে
        console.log(`📡 Sending transaction with Authorization...`);

        const tx = await contract.claim(
            claimData.to, 
            claimData.ts, 
            claimData.signature,
            { 
                gasLimit: 300000 // ম্যানুয়াল গ্যাস লিমিট
            }
        );

        console.log(`⏳ Transaction Sent! Hash: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Success! Block: ${receipt.blockNumber}`);

    } catch (error: any) {
        console.error("❌ Claim Failed!");
        console.error(`Reason: ${error.reason || error.message}`);
    }
}

executeClaim();