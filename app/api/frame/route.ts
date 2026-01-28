import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ১. সব প্যারামিটার রিসিভ করা হচ্ছে
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp') || '';
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

  // 🚩 ২. প্যারামিটার সিরিয়াল পরিবর্তন (Score এবং Rank আগে আনা হয়েছে)
  // PFP লিঙ্ক অনেক বড় হয়, তাই এটিকে লিঙ্কের একদম শেষে রাখা নিরাপদ
  const imageUrl = `${baseUrl}/api/og?score=${score}&rank=${encodeURIComponent(rank)}&username=${encodeURIComponent(username)}&fid=${fid}&t=${timestamp}&pfp=${encodeURIComponent(pfp)}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${username}'s Score</title>
        <meta property="og:title" content="${username}'s Score: ${score}" />
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
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #000; color: #fff; font-family: sans-serif;">
          <h1>Redirecting to Personal ID Mint...</h1>
        </div>
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
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}