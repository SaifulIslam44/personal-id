import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  const isFarcasterBot = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');
  
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp') || '';
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 
  
  // 🚩 সরাসরি ডিপ-লিঙ্ক যা ব্রাউজার এড়িয়ে অ্যাপ ওপেন করবে
  const deepLinkUrl = "farcaster://view-group/miniapp?url=https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

  const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&pfp=${encodeURIComponent(pfp)}&t=${timestamp}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${username}'s Score</title>
        <meta property="og:title" content="${username}'s Score" />
        <meta property="og:image" content="${imageUrl}" />
        
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="fc:frame:button:1" content="Check Yours ⚡" />
        <meta property="fc:frame:button:1:action" content="launch_app" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />
      </head>
      <body>
        <script>
          // যদি ইউজার ব্রাউজারে থাকে, তবে সরাসরি অ্যাপে পাঠানোর চেষ্টা করবে
          if (!/${isFarcasterBot}/.test(navigator.userAgent)) {
            window.location.href = "${deepLinkUrl}";
            // ব্যাকআপ রিডাইরেক্ট যদি ডিপ লিঙ্ক কাজ না করে
            setTimeout(() => {
              window.location.href = "${appJoinUrl}";
            }, 500);
          }
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}