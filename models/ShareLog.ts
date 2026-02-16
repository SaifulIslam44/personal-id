import { Schema, model, models } from "mongoose";

const ShareLogSchema = new Schema({
  fid: { type: String, required: true },
  username: { type: String },
  walletAddress: { type: String }, 
  castHash: { type: String, required: true },
  timestamp: { type: Date, required: true },
  
  // 🔥 অটো ডিলিট লজিক (TTL Index) 🔥
  // এটি সরাসরি UTC টাইম নিবে এবং ৩০ সেকেন্ড পর ডাটা ডিলিট করবে
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // ৩০ সেকেন্ড (টেস্টের জন্য), পরে ৩০০ করে দিবেন
  }
});

const ShareLog = models.ShareLog || model("ShareLog", ShareLogSchema);
export default ShareLog;