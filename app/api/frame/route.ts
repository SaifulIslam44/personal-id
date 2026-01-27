import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ডাটা রিসিভ করা এবং সেফটি চেক
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp') || '';
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

  // 🚩 OG ইমেজের ইউআরএল তৈরি - প্রোপার এনকোডিং সহ
  const imageUrl = `${baseUrl}/api/og?score=${score}&fid=${fid}&rank=${encodeURIComponent(rank)}&username=${encodeURIComponent(username)}&t=${timestamp}&pfp=${encodeURIComponent(pfp)}`;

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
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <h1>Redirecting to Personal ID Mint...</h1>
          <p>Please wait while we take you to the app.</p>
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