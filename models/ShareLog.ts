import { Schema, model, models } from "mongoose";

const ShareLogSchema = new Schema({
  fid: { type: String, required: true },
  username: { type: String },
  walletAddress: { type: String }, // ✅ এই লাইনটি মাস্ট থাকতে হবে
  castHash: { type: String, required: true },
  timestamp: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ShareLog = models.ShareLog || model("ShareLog", ShareLogSchema);
export default ShareLog;