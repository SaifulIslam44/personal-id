import { Schema, model, models } from "mongoose";

// ব্যাকআপ মডেলের স্কিমা (এখানে ডাটা কখনো ডিলিট হবে না)
const ShareBackupSchema = new Schema({
  fid: { 
    type: String, 
    required: true,
    index: true // সার্চ ফাস্ট করার জন্য ইনডেক্স যোগ করা হয়েছে
  },
  username: { 
    type: String 
  },
  walletAddress: { 
    type: String 
  }, 
  castHash: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
    // নোট: এখানে কোনো 'expires' নেই
  }
});

// যদি মডেলটি আগে থেকে তৈরি করা থাকে তবে সেটি ব্যবহার করবে, নাহলে নতুন তৈরি করবে
const ShareBackup = models.ShareBackup || model("ShareBackup", ShareBackupSchema);

export default ShareBackup;