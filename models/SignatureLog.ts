import mongoose from "mongoose";

const SignatureLogSchema = new mongoose.Schema({
  fid: { 
    type: String, 
    required: true,
    index: true // দ্রুত খোঁজার জন্য ইনডেক্স করা হলো
  },
  wallet: { 
    type: String,
    required: true
  },
  giveawayId: { 
    type: String,
    required: true
  },
  lastAttempt: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // 🔥 ৫ মিনিট (৩০০ সেকেন্ড) পর অটোমেটিক ডিলিট হয়ে যাবে
  }
});

// মডেলটি যদি আগে থেকে থাকে তবে সেটি ব্যবহার করবে, না থাকলে নতুন তৈরি করবে
const SignatureLog = mongoose.models.SignatureLog || mongoose.model("SignatureLog", SignatureLogSchema);

export default SignatureLog;