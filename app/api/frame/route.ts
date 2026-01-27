import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // প্যারামিটার রিসিভ করা
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp') || '';
  // 🆕 Frontend থেকে আসা টাইমস্ট্যাম্প রিসিভ করা
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

  // 🚩 MAJOR FIX: Image URL-এর সাথেও টাইমস্ট্যাম্প যোগ করা হলো (&t=${timestamp})
  // এতে Warpcast বুঝবে এটি একটি নতুন ইমেজ এবং ক্যাশ থেকে পুরনো ইমেজ দেখাবে না।
  const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&pfp=${encodeURIComponent(pfp)}&rank=${encodeURIComponent(rank)}&t=${timestamp}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${username}'s Score</title>
        <meta property="og:title" content="${username}'s Farcaster Score" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="fc:frame:button:1" content="Check Yours / Join" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${appJoinUrl}" />
        
        <meta http-equiv="refresh" content="0;url=${appJoinUrl}" />
      </head>
      <body>
        <h1>Redirecting...</h1>
        <script>
          window.location.href = "${appJoinUrl}";
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      // ক্যাশ কন্ট্রোল: সার্ভার এবং ক্লায়েন্ট কাউকে ক্যাশ করতে নিষেধ করা হচ্ছে
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}