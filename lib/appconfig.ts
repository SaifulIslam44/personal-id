export const APP_CONFIG = {
  // Vercel-এ এই ভ্যালু true থাকলে নোটিশ দেখাবে, false থাকলে টাইটেল দেখাবে
  showNotice: process.env.NEXT_PUBLIC_SHOW_NOTICE === "true", 
  noticeMessage: process.env.NEXT_PUBLIC_NOTICE_MESSAGE || "⚠️Notice: Spin section temporary disabled due to this week rewards pool over. Wait for the next week and keep collect $PIM 🟦🟦🟦"
};