











// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userAgent = request.headers.get('user-agent') || '';

//   // ইউজার কোথা থেকে আসছে সেটা ডিটেক্ট করা
//   const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');
//   const isBaseApp = userAgent.includes('Base') || userAgent.includes('Coinbase');

//   const username = searchParams.get('username') || 'User';
//   const fid = searchParams.get('fid') || '0';
//   const score = searchParams.get('score') || '0.00';
//   const rank = searchParams.get('rank') || 'ACTIVE USER';
//   const timestamp = searchParams.get('t') || Date.now().toString();

//   const baseUrl = "https://mints.personalids.xyz"; 
//   const farcasterJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
//   const baseAppJoinUrl = "https://base.app/app/mints.personalids.xyz";

//   // isBaseApp ব্যবহার করে টার্গেট ইউআরএল নির্ধারণ
//   // যদি ইউজার Farcaster থেকে আসে তবে Farcaster লিঙ্ক, আর যদি Base App থেকে আসে তবে Base লিঙ্ক
//   // অন্যথায় (সাধারণ ব্রাউজার) ডিফল্ট হিসেবে Farcaster লিঙ্কে পাঠাবে
//   let targetUrl = farcasterJoinUrl;
//   if (isBaseApp) {
//     targetUrl = baseAppJoinUrl;
//   } else if (isFarcaster) {
//     targetUrl = farcasterJoinUrl;
//   }

//   const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&t=${timestamp}`;

//   // যদি বট না হয় (সরাসরি ব্রাউজারে কেউ লিঙ্ক ওপেন করে), তবে তাকে তার অ্যাপ অনুযায়ী রিডাইরেক্ট করা
//   const isBot = isFarcaster || isBaseApp || userAgent.includes('bot');
//   const redirectMeta = !isBot ? `<meta http-equiv="refresh" content="0;url=${targetUrl}" />` : '';

//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>${username}'s Score</title>
//         <meta property="og:title" content="${username}'s Score" />
//         <meta property="og:image" content="${imageUrl}" />
        
//         <meta property="fc:frame" content="vNext" />
//         <meta property="fc:frame:image" content="${imageUrl}" />
//         <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

//         <meta property="fc:frame:button:1" content="Check Yours ⚡" />
//         <meta property="fc:frame:button:1:action" content="launch_app" />
//         <meta property="fc:frame:button:1:target" content="${targetUrl}" />
        
//         ${redirectMeta}
//       </head>
//       <body>
//         ${!isBot ? `<script>window.location.href = "${targetUrl}";</script>` : ''}
//       </body>
//     </html>
//   `;

//   return new NextResponse(html, {
//     status: 200,
//     headers: {
//       'Content-Type': 'text/html',
//       'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
//     },
//   });
// }






































import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 

  // ইমেজ জেনারেশনের লিঙ্ক
  const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&t=${timestamp}`;

  // মিনি অ্যাপ লিঙ্ক
  const targetUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Score</title>
        <meta property="og:title" content="" />
        <meta property="og:site_name" content="Personal ID" />
        
        <meta property="og:image" content="${imageUrl}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta http-equiv="refresh" content="0;url=${targetUrl}" />
      </head>
      <body>
        <script>window.location.href = "${targetUrl}";</script>
      </body>
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