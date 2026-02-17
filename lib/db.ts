// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("MONGODB_URI is missing in env");
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI!).then((m) => m);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;







import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // ১. চেকটি ফাংশনের ভেতরে নিয়ে আসা হয়েছে যাতে স্ক্রিপ্ট রান করার সময় এরর না দেয়
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in env");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // ২. বাফার কমান্ড ফলস রাখা ভালো যাতে কানেকশন হওয়ার আগে কোনো কুয়েরি না চলে
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // এরর হলে প্রমিস রিসেট করে দিবে
    throw e;
  }

  return cached.conn;
}

export default connectDB;