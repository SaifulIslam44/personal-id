import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import dbConnect from "../lib/db";
import User from "../models/User";
import axios from "axios";

async function sendNotification() {
    const title = process.argv[2]; 
    const body = process.argv[3];  

    if (!title || !body) {
        console.log("❌ Error: Please provide title and body.");
        console.log("Usage: npx tsx scripts/send-notif.ts 'Title' 'Message'");
        process.exit(1);
    }

    try {
        await dbConnect();
        
        // শুধুমাত্র যাদের নোটিফিকেশন ডাটা আছে তাদের খুঁজে বের করা
        const users = await User.find({ 
            notificationUrl: { $exists: true }, 
            notificationToken: { $exists: true } 
        });

        if (users.length === 0) {
            console.log("⚠️ No users found with notification tokens.");
            process.exit(0);
        }

        console.log(`🚀 Sending notification to ${users.length} users...`);

        for (const user of users) {
            try {
                
                await axios.post(user.notificationUrl, {
                    notificationId: `msg-${Date.now()}-${user.fid}`,
                    title: title,
                    body: body,
                    // আপনার অ্যাপের আসল ভেরিফাইড ডোমেইনটি এখানে দিন
                    targetUrl: "https://mints.personalids.xyz", 
                    tokens: [user.notificationToken]
                });
                console.log(`✅ Sent to FID: ${user.fid}`);
            } catch (error: any) {
                const errorMsg = error.response?.data?.errors?.[0]?.message || error.message;
                console.error(`❌ Failed for FID ${user.fid}:`, errorMsg);
            }
        }

        console.log("✨ All notifications sent!");
        process.exit(0);

    } catch (error: any) {
        console.error("❌ Database Connection Error:", error.message);
        process.exit(1);
    }
}

sendNotification();


//ID: 200542152