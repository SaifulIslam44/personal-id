// app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // প্যারামিটারগুলো রিসিভ করা
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp') || '';

  const baseUrl = "https://mints.personalids.xyz";

  // সেই আগের ইমেজ জেনারেশন URL টি এখানে তৈরি করুন
  // এটিই ফ্রেমের প্রিভিউ ইমেজ হিসেবে দেখাবে
  const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&pfp=${encodeURIComponent(pfp)}&rank=${encodeURIComponent(rank)}`;

  // আপনার অ্যাপের জয়েন লিংক (যেখানে ইউজারকে পাঠাতে চান)
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

  // HTML রেসপন্স রিটার্ন করা (Meta Tags সহ)
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${username}'s Score</title>
        <meta property="og:title" content="${username}'s Farcaster Score" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta property="fc:frame" content="vNext" />
        
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:image" content="${imageUrl}" />

        <meta property="fc:frame:button:1" content="Check Yours / Join" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${appJoinUrl}" />
        
      </head>
      <body>
        <h1>Redirecting...</h1>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}