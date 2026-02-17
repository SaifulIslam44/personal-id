


import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import dbConnect from "../lib/db";
import User from "../models/User";
import axios from "axios";

async function sendNotification() {
    const title = process.argv[2]; 
    const body = process.argv[3];  

    if (!title || !body) {
        console.log("❌ Error: Please provide title and body.");
        console.log("Usage: npm run send-push 'Title' 'Message'");
        process.exit(1);
    }

    await dbConnect();
    
    const users = await User.find({ 
        notificationUrl: { $exists: true }, 
        notificationToken: { $exists: true } 
    });

    console.log(`🚀 Sending notification to ${users.length} users...`);

    for (const user of users) {
        try {
            await axios.post(user.notificationUrl, {
                notificationId: `msg-${Date.now()}`,
                title: title,
                body: body,
                // আপনার ফারকাস্টার মিনি অ্যাপ লিঙ্কটি এখানে দেওয়া হলো
                targetUrl: "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint", 
                tokens: [user.notificationToken]
            });
            console.log(`✅ Sent to FID: ${user.fid}`);
        } catch (error: any) {
            console.error(`❌ Failed for FID ${user.fid}:`, error.response?.data || error.message);
        }
    }

    console.log("✨ All notifications sent!");
    process.exit(0);
}

sendNotification();