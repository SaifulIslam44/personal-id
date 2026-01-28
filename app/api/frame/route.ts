import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Warpcast/Farcaster বট কিনা চেক
  const isFarcasterBot = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');

  const username = searchParams.get('username') || 'User';
  const score = searchParams.get('score') || '0.00';
  const baseUrl = "https://mints.personalids.xyz";
  const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";

  const imageUrl = `${baseUrl}/api/og?${searchParams.toString()}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${username}'s Score" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta property="fc:frame:button:1" content="Check My Score 🚀" />
        <meta property="fc:frame:button:1:action" content="launch_app" />
        <meta property="fc:frame:button:1:target" content="${baseUrl}" />

        ${!isFarcasterBot ? `<meta http-equiv="refresh" content="0;url=${appJoinUrl}" />` : ''}
      </head>
      <body></body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}