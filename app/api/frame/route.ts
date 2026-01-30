// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userAgent = request.headers.get('user-agent') || '';

//   const isFarcasterBot = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');
//   const username = searchParams.get('username') || 'User';
//   const fid = searchParams.get('fid') || '0';
//   const score = searchParams.get('score') || '0.00';
//   const rank = searchParams.get('rank') || 'ACTIVE USER';
//   const pfp = searchParams.get('pfp') || '';
//   const timestamp = searchParams.get('t') || Date.now().toString();

//   const baseUrl = "https://mints.personalids.xyz"; 
//   // এই লিঙ্কটি সরাসরি Warpcast থেকে কপি করা Mini App শেয়ার লিঙ্ক হতে হবে
//   const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

//   const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&pfp=${encodeURIComponent(pfp)}&t=${timestamp}`;
  

// const redirectMeta = !isFarcasterBot 
//     ? `<meta http-equiv="refresh" content="0;url=${appJoinUrl}" />` 
//     : '';


//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Neynar Score</title>
//         <meta property="og:title" content="${username}'s Score" />
//         <meta property="og:image" content="${imageUrl}" />
        
//         <meta property="fc:frame" content="vNext" />
//         <meta property="fc:frame:image" content="${imageUrl}" />
//         <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

//         <meta property="fc:frame:button:1" content="Check Yours ⚡" />
//         <meta property="fc:frame:button:1:action" content="launch_app" />
//         <meta property="fc:frame:button:1:target" content="${appJoinUrl}" />
//       ${redirectMeta}
//       </head>
//       <body>
//         ${!isFarcasterBot ? `<script>window.location.href = "${appJoinUrl}";</script>` : ''}
//       </body>
//     </html>
//   `;

//   return new NextResponse(html, {
//     status: 200,
//     headers: {
//       'Content-Type': 'text/html',
//       'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', // ক্যাশ ক্লিয়ার করতে এটি জরুরি
//     },
//   });
// }





















// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const userAgent = request.headers.get('user-agent') || '';

//   const isFarcasterBot = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');
//   const username = searchParams.get('username') || 'User';
//   const fid = searchParams.get('fid') || '0';
//   const score = searchParams.get('score') || '0.00';
//   const rank = searchParams.get('rank') || 'ACTIVE USER';
//   // const pfp = searchParams.get('pfp') || ''; // ❌ Eta r lagbe na
//   const timestamp = searchParams.get('t') || Date.now().toString();

//   const baseUrl = "https://mints.personalids.xyz"; 
//   const appJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint"; 

//   // 👇 CHANGE: Image URL e r PFP pass korchi na, api/og FID diye ber kore nibe
//   const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&t=${timestamp}`;

//   const redirectMeta = !isFarcasterBot 
//     ? `<meta http-equiv="refresh" content="0;url=${appJoinUrl}" />` 
//     : '';

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
//         <meta property="fc:frame:button:1:target" content="${appJoinUrl}" />
//       ${redirectMeta}
//       </head>
//       <body>
//         ${!isFarcasterBot ? `<script>window.location.href = "${appJoinUrl}";</script>` : ''}
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
  const userAgent = request.headers.get('user-agent') || '';

  // ইউজার কোথা থেকে আসছে সেটা ডিটেক্ট করা
  const isFarcaster = userAgent.includes('Farcaster') || userAgent.includes('Warpcast');
  const isBaseApp = userAgent.includes('Base') || userAgent.includes('Coinbase');

  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const timestamp = searchParams.get('t') || Date.now().toString();

  const baseUrl = "https://mints.personalids.xyz"; 
  const farcasterJoinUrl = "https://farcaster.xyz/miniapps/WbTVgaQ34L1m/personal-id-mint";
  const baseAppJoinUrl = "https://base.app/app/mints.personalids.xyz";

  // isBaseApp ব্যবহার করে টার্গেট ইউআরএল নির্ধারণ
  // যদি ইউজার Farcaster থেকে আসে তবে Farcaster লিঙ্ক, আর যদি Base App থেকে আসে তবে Base লিঙ্ক
  // অন্যথায় (সাধারণ ব্রাউজার) ডিফল্ট হিসেবে Farcaster লিঙ্কে পাঠাবে
  let targetUrl = farcasterJoinUrl;
  if (isBaseApp) {
    targetUrl = baseAppJoinUrl;
  } else if (isFarcaster) {
    targetUrl = farcasterJoinUrl;
  }

  const imageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(username)}&fid=${fid}&score=${score}&rank=${encodeURIComponent(rank)}&t=${timestamp}`;

  // যদি বট না হয় (সরাসরি ব্রাউজারে কেউ লিঙ্ক ওপেন করে), তবে তাকে তার অ্যাপ অনুযায়ী রিডাইরেক্ট করা
  const isBot = isFarcaster || isBaseApp || userAgent.includes('bot');
  const redirectMeta = !isBot ? `<meta http-equiv="refresh" content="0;url=${targetUrl}" />` : '';

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
        <meta property="fc:frame:button:1:target" content="${targetUrl}" />
        
        ${redirectMeta}
      </head>
      <body>
        ${!isBot ? `<script>window.location.href = "${targetUrl}";</script>` : ''}
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