

// import { ImageResponse } from 'next/og';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   const username = searchParams.get('username') || 'User';
//   const fid = searchParams.get('fid') || '0';
//   const score = searchParams.get('score') || '0.00';
//   const rank = searchParams.get('rank') || 'ACTIVE USER';
//   const pfp = searchParams.get('pfp');

//   return new ImageResponse(
//     (
//       // 🚩 প্রধান পরিবর্তন: এখানে একটিই মাত্র মেইন DIV ব্যবহার করা হয়েছে।
//       // এই DIV টাই পুরো ইমেজের সাইজ নিবে এবং এটাই কার্ড হিসেবে কাজ করবে।
//       <div style={{
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         // কার্ডের স্টাইলগুলো সরাসরি এই মেইন কন্টেইনারে দেওয়া হলো
//         background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
//         border: '4px solid rgba(240, 100, 47, 0.5)', // বর্ডার একটু স্পষ্ট করা হলো
//         borderRadius: '0px',
//         padding: '30px',
//         boxSizing: 'border-box', // বর্ডার যেন সাইজের ভেতরে থাকে
//         fontFamily: '"Inter", sans-serif', // ভালো ফন্টের জন্য (অপশনাল)
//       }}>

//         {/* হেডার */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           color: '#f0642f',
//           fontSize: '18px',
//           marginBottom: '20px',
//           fontWeight: '700',
//           letterSpacing: '1px'
//         }}>
//           <span style={{ marginRight: '8px' }}>🛡️</span> VERIFIED IDENTITY
//         </div>

//         {/* প্রোফাইল পিকচার */}
//         <div style={{
//           display: 'flex',
//           width: '130px',
//           height: '130px',
//           borderRadius: '50%',
//           border: '4px solid #f0642f',
//           backgroundColor: '#1a1d23',
//           overflow: 'hidden',
//           marginBottom: '15px',
//           boxShadow: '0 4px 20px rgba(240, 100, 47, 0.2)'
//         }}>
//           {pfp ? (
//             <img src={pfp} width="130" height="130" style={{ objectFit: 'cover' }} alt="PFP" />
//           ) : (
//             <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#f0642f', fontSize: '50px' }}>
//               👤
//             </div>
//           )}
//         </div>

//         {/* ইউজার নাম ও FID */}
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
//           <h2 style={{ color: 'white', fontSize: '36px', margin: '0 0 5px', fontWeight: '800' }}>{username}</h2>
//           <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '0', opacity: 0.9 }}>FID: {fid}</p>
//         </div>

//         {/* ডিভাইডার লাইন */}
//         <div style={{ display: 'flex', height: '2px', width: '70%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', margin: '0 0 25px 0' }}></div>

//         {/* স্কোর সেকশন */}
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//            <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Activity Neynar Score</p>
//            {/* স্কোরটি যেন এক লাইনে থাকে এবং মাঝখানে থাকে তা নিশ্চিত করা হলো */}
//            <h1 style={{ color: 'white', fontSize: '100px', margin: '0', fontWeight: '900', lineHeight: '1', textAlign: 'center' }}>{score}</h1>
//         </div>

//         {/* র‍্যাঙ্ক ব্যাজ */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           background: 'rgba(74, 222, 128, 0.1)',
//           color: '#4ade80',
//           border: '1px solid rgba(74, 222, 128, 0.25)',
//           padding: '10px 25px',
//           borderRadius: '50px',
//           fontSize: '20px',
//           marginTop: '30px',
//           fontWeight: '700',
//           boxShadow: '0 0 20px rgba(74, 222, 128, 0.1)'
//         }}>
//           <span style={{ marginRight: '8px' }}>⚡</span> {rank}
//         </div>

//       </div>
//     ),
//     {
//       // 🚩 কনফিগারেশন:
//       // ইমেজের সাইজ কার্ডের কন্টেন্টের সাথে সামঞ্জস্য রেখে সেট করা হয়েছে।
//       // এই সাইজের বাইরে কোনো কালো ব্যাকগ্রাউন্ড তৈরি হবে না।
//       width: 600,
//       height: 650,
//     }
//   );
// }


















































// /* eslint-disable @next/next/no-img-element */

// import { ImageResponse } from 'next/og';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   // প্যারামিটারগুলো রিসিভ করা
//   const username = searchParams.get('username') || 'User';
//   const fid = searchParams.get('fid') || '0';
//   const score = searchParams.get('score') || '0.00';
//   const rank = searchParams.get('rank') || 'ACTIVE USER';
//   const pfp = searchParams.get('pfp');

//   return new ImageResponse(
//     (
//       <div style={{
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         // মেইন ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট
//         backgroundColor: 'transparent',
//       }}>

//         {/* কার্ড ডিজাইন (মাঝখানে থাকবে) */}
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
//           border: '3px solid rgba(240, 100, 47, 0.5)', 
//           borderRadius: '40px',
//           padding: '40px',
//           width: '550px', // কার্ডের সাইজ ফিক্সড রাখা হলো যাতে দেখতে সুন্দর লাগে
//           boxShadow: '0 10px 40px rgba(0,0,0,0.5)', // একটু শ্যাডো দেওয়া হলো ডেপথের জন্য
//           fontFamily: '"Inter", sans-serif',
//         }}>

//           {/* হেডার */}
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             color: '#f0642f',
//             fontSize: '18px',
//             marginBottom: '20px',
//             fontWeight: '700',
//             letterSpacing: '1px'
//           }}>
//             <span style={{ marginRight: '8px' }}>🛡️</span> VERIFIED IDENTITY
//           </div>

//           {/* প্রোফাইল পিকচার */}
//           <div style={{
//             display: 'flex',
//             width: '120px',
//             height: '120px',
//             borderRadius: '50%',
//             border: '4px solid #f0642f',
//             backgroundColor: '#1a1d23',
//             overflow: 'hidden',
//             marginBottom: '15px',
//             boxShadow: '0 4px 20px rgba(240, 100, 47, 0.2)'
//           }}>
//             {pfp ? (
//               <img src={pfp} width="120" height="120" style={{ objectFit: 'cover' }} alt="PFP" />
//             ) : (
//               <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#f0642f', fontSize: '50px' }}>
//                 👤
//               </div>
//             )}
//           </div>

//           {/* ইউজার নাম ও FID */}
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ color: 'white', fontSize: '32px', margin: '0 0 5px', fontWeight: '800', textAlign: 'center' }}>{username}</h2>
//             <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '0', opacity: 0.9 }}>FID: {fid}</p>
//           </div>

//           {/* ডিভাইডার লাইন */}
//           <div style={{ display: 'flex', height: '2px', width: '70%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', margin: '0 0 20px 0' }}></div>

//           {/* স্কোর সেকশন */}
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//              <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Activity Neynar Score</p>
//              <h1 style={{ color: 'white', fontSize: '90px', margin: '0', fontWeight: '900', lineHeight: '1', textAlign: 'center' }}>{score}</h1>
//           </div>

//           {/* র‍্যাঙ্ক ব্যাজ */}
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             background: 'rgba(74, 222, 128, 0.1)',
//             color: '#4ade80',
//             border: '1px solid rgba(74, 222, 128, 0.25)',
//             padding: '10px 25px',
//             borderRadius: '50px',
//             fontSize: '18px',
//             marginTop: '25px',
//             fontWeight: '700',
//             boxShadow: '0 0 20px rgba(74, 222, 128, 0.1)'
//           }}>
//             <span style={{ marginRight: '8px' }}>⚡</span> {rank}
//           </div>

//         </div>
//       </div>
//     ),
//     {
//       // 🚩 স্ট্যান্ডার্ড সাইজ: ১২০০ x ৬৩০
//       width: 1200,
//       height: 630,
      
//       // 🚩 Cache Control Headers (খুবই গুরুত্বপূর্ণ)
//       // এটি যুক্ত করায় সার্ভার পুরনো ইমেজ ধরে রাখবে না
//       headers: {
//         'Cache-Control': 'no-store, no-cache, must-revalidate',
//         'Pragma': 'no-cache',
//       },
//     }
//   );
// }








// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
  
//   // Safe parsing helper - semicolon সমস্যা ফিক্স করার জন্য
//   const getParam = (key: string) => {
//     return searchParams.get(key) || searchParams.get(`${key};`);
//   };

//   const safeDecode = (str: string | null) => {
//     try {
//       return str ? decodeURIComponent(str) : '';
//     } catch {
//       return str || '';
//     }
//   };

//   const username = safeDecode(getParam('username')) || 'User';
//   const fid = getParam('fid') || '0';
//   const score = getParam('score') || '0.00';
//   const rank = safeDecode(getParam('rank')) || 'ACTIVE USER';
//   const pfp = getParam('pfp');

//   return new ImageResponse(
//     (
//       <div style={{
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#020408',
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
//           border: '3px solid rgba(240, 100, 47, 0.5)', 
//           borderRadius: '40px',
//           padding: '40px',
//           width: '550px',
//         }}>
//           <div style={{ display: 'flex', color: '#f0642f', fontSize: '18px', marginBottom: '20px', fontWeight: '700' }}>
//             🛡️ VERIFIED IDENTITY
//           </div>

//           <div style={{ display: 'flex', width: '120px', height: '120px', borderRadius: '100px', border: '4px solid #f0642f', overflow: 'hidden', marginBottom: '15px' }}>
//             {pfp ? (
//               <img src={decodeURIComponent(pfp)} width="120" height="120" style={{ objectFit: 'cover' }} alt="PFP" />
//             ) : (
//               <div style={{ display: 'flex', fontSize: '50px' }}>👤</div>
//             )}
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ color: 'white', fontSize: '32px', margin: '0', fontWeight: '800' }}>{username}</h2>
//             <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '5px 0' }}>FID: {fid}</p>
//           </div>

//           <div style={{ display: 'flex', height: '2px', width: '70%', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//              <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0' }}>ACTIVITY NEYNAR SCORE</p>
//              <h1 style={{ color: 'white', fontSize: '90px', margin: '0', fontWeight: '900' }}>{score}</h1>
//           </div>

//           <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '10px 25px', borderRadius: '50px', marginTop: '20px', fontWeight: '700' }}>
//             ⚡ {rank}
//           </div>
//         </div>
//       </div>
//     ),
//     { width: 1200, height: 630 }
//   );
// }
















// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';

// export const runtime = 'edge'; // Edge runtime use kora valo OG er jonno

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
  
//   const getParam = (key: string) => searchParams.get(key) || searchParams.get(`${key};`);
  
//   const safeDecode = (str: string | null) => {
//     try { return str ? decodeURIComponent(str) : ''; } 
//     catch { return str || ''; }
//   };

//   const username = safeDecode(getParam('username')) || 'User';
//   const fid = getParam('fid') || '0';
//   const score = getParam('score') || '0.00';
//   const rank = safeDecode(getParam('rank')) || 'ACTIVE USER';
  
//   // 👇 Logic: URL e PFP na thakle FID diye fetch koro
//   let pfpUrl = getParam('pfp');

//   if (!pfpUrl && fid !== '0') {
//     try {
//         const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//             headers: {
//                 'accept': 'application/json',
//                 'api_key': process.env.NEYNAR_API_KEY || ''
//             }
//         });
//         const data = await neynarRes.json();
//         if (data.users && data.users.length > 0) {
//             pfpUrl = data.users[0].pfp_url;
//         }
//     } catch (e) {
//         console.error("Failed to fetch PFP in OG", e);
//     }
//   }

//   // Fallback image
//   if (!pfpUrl) pfpUrl = "https://placehold.co/120x120?text=User";

//   return new ImageResponse(
//     (
//       <div style={{
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#020408',
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
//           border: '3px solid rgba(240, 100, 47, 0.5)', 
//           borderRadius: '40px',
//           padding: '40px',
//           width: '550px',
//         }}>
//           <div style={{ display: 'flex', color: '#f0642f', fontSize: '18px', marginBottom: '20px', fontWeight: '700' }}>
//             🛡️ VERIFIED IDENTITY
//           </div>

//           <div style={{ display: 'flex', width: '120px', height: '120px', borderRadius: '100px', border: '4px solid #f0642f', overflow: 'hidden', marginBottom: '15px' }}>
//              {/* PFP Render */}
//              <img src={pfpUrl} width="120" height="120" style={{ objectFit: 'cover' }} alt="PFP" />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ color: 'white', fontSize: '32px', margin: '0', fontWeight: '800' }}>{username}</h2>
//             <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '5px 0' }}>FID: {fid}</p>
//           </div>

//           <div style={{ display: 'flex', height: '2px', width: '70%', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//              <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0' }}>ACTIVITY NEYNAR SCORE</p>
//              <h1 style={{ color: 'white', fontSize: '90px', margin: '0', fontWeight: '900' }}>{score}</h1>
//           </div>

//           <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '10px 25px', borderRadius: '50px', marginTop: '20px', fontWeight: '700' }}>
//             ⚡ {rank}
//           </div>
//         </div>
//       </div>
//     ),
//     { width: 1200, height: 630 }
//   );
// }


















// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';

// export const runtime = 'edge'; // Edge runtime use kora valo OG er jonno

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
  
//   const getParam = (key: string) => searchParams.get(key) || searchParams.get(`${key};`);
  
//   const safeDecode = (str: string | null) => {
//     try { return str ? decodeURIComponent(str) : ''; } 
//     catch { return str || ''; }
//   };

//   const username = safeDecode(getParam('username')) || 'User';
//   const fid = getParam('fid') || '0';
//   const score = getParam('score') || '0.00';
//   const rank = safeDecode(getParam('rank')) || 'ACTIVE USER';
  
//   // 👇 Logic: URL e PFP na thakle FID diye fetch koro
//   let pfpUrl = getParam('pfp');

//   if (!pfpUrl && fid !== '0') {
//     try {
//         const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//             headers: {
//                 'accept': 'application/json',
//                 'api_key': process.env.NEYNAR_API_KEY || ''
//             }
//         });
//         const data = await neynarRes.json();
//         if (data.users && data.users.length > 0) {
//             pfpUrl = data.users[0].pfp_url;
//         }
//     } catch (e) {
//         console.error("Failed to fetch PFP in OG", e);
//     }
//   }

//   // Fallback image
//   if (!pfpUrl) pfpUrl = "https://placehold.co/120x120?text=User";

//   return new ImageResponse(
//     (
//       <div style={{
//         height: '100%',
//         width: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#020408',
//       }}>
//         <div style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
//           border: '3px solid rgba(240, 100, 47, 0.5)', 
//           borderRadius: '40px',
//           padding: '40px',
//           width: '550px',
//         }}>
//           <div style={{ display: 'flex', color: '#f0642f', fontSize: '18px', marginBottom: '20px', fontWeight: '700' }}>
//             🛡️ VERIFIED IDENTITY
//           </div>

//           <div style={{ display: 'flex', width: '120px', height: '120px', borderRadius: '100px', border: '4px solid #f0642f', overflow: 'hidden', marginBottom: '15px' }}>
//              {/* PFP Render */}
//              <img src={pfpUrl} width="120" height="120" style={{ objectFit: 'cover' }} alt="PFP" />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ color: 'white', fontSize: '32px', margin: '0', fontWeight: '800' }}>{username}</h2>
//             <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '5px 0' }}>FID: {fid}</p>
//           </div>

//           <div style={{ display: 'flex', height: '2px', width: '70%', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//              <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0' }}>ACTIVITY NEYNAR SCORE</p>
//              <h1 style={{ color: 'white', fontSize: '90px', margin: '0', fontWeight: '900' }}>{score}</h1>
//           </div>

//           <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '10px 25px', borderRadius: '50px', marginTop: '20px', fontWeight: '700' }}>
//             ⚡ {rank}
//           </div>
//         </div>
//       </div>
//     ),
//     { width: 1200, height: 630 }
//   );
// }




/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge'; // Edge runtime use kora valo OG er jonno

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const getParam = (key: string) => searchParams.get(key) || searchParams.get(`${key};`);
  
  const safeDecode = (str: string | null) => {
    try { return str ? decodeURIComponent(str) : ''; } 
    catch { return str || ''; }
  };

  const username = safeDecode(getParam('username')) || 'User';
  const fid = getParam('fid') || '0';
  const score = getParam('score') || '0.00';
  const rank = safeDecode(getParam('rank')) || 'ACTIVE USER';
  
  // 👇 Logic: URL e PFP na thakle FID diye fetch koro (Ja chilo tai ache)
  let pfpUrl = getParam('pfp');

  if (!pfpUrl && fid !== '0') {
    try {
        const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                'accept': 'application/json',
                'api_key': process.env.NEYNAR_API_KEY || ''
            },
            next: { revalidate: 86400 }
        });
        const data = await neynarRes.json();
        if (data.users && data.users.length > 0) {
            pfpUrl = data.users[0].pfp_url;
        }
    } catch (e) {
        console.error("Failed to fetch PFP in OG", e);
    }
  }

  // Fallback image
  if (!pfpUrl) pfpUrl = "https://placehold.co/120x120?text=User";

  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020408',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(165deg, #0e121a 0%, #020408 100%)',
          border: '5px solid rgba(240, 100, 47, 0.5)', // Border ektu mota kora hoyeche
          borderRadius: '60px', // Radius barano hoyeche
          padding: '50px',
          width: '900px',  // Size barano hoyeche square er jonno
          height: '900px', // Square box er moto
          boxShadow: '0 0 60px rgba(240, 100, 47, 0.2)' // Glow effect add kora hoyeche
        }}>
          
          <div style={{ display: 'flex', color: '#f0642f', fontSize: '28px', marginBottom: '30px', fontWeight: '800', letterSpacing: '2px' }}>
            🛡️ VERIFIED IDENTITY
          </div>

          <div style={{ display: 'flex', width: '200px', height: '200px', borderRadius: '200px', border: '6px solid #f0642f', overflow: 'hidden', marginBottom: '25px' }}>
             {/* PFP Render - Size barano hoyeche 120 theke 200 */}
             <img src={pfpUrl} width="200" height="200" style={{ objectFit: 'cover' }} alt="PFP" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '56px', margin: '0', fontWeight: '900', textAlign: 'center' }}>{username}</h2>
            <p style={{ color: '#f0642f', fontSize: '32px', fontWeight: '700', margin: '10px 0' }}>FID: {fid}</p>
          </div>

          <div style={{ display: 'flex', height: '3px', width: '60%', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p style={{ color: '#8a94a8', fontSize: '22px', margin: '0', letterSpacing: '1px' }}>ACTIVITY NEYNAR SCORE</p>
             {/* Score font huge kora hoyeche */}
             <h1 style={{ color: 'white', fontSize: '130px', margin: '10px 0', fontWeight: '900', lineHeight: '1' }}>{score}</h1>
          </div>

          <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontSize: '28px', padding: '15px 40px', borderRadius: '60px', marginTop: '30px', fontWeight: '800' }}>
            ⚡ {rank}
          </div>
        </div>
      </div>
    ),
    // 👇 Eikhane Dimensions Change kora hoyeche Square er jonno
    { width: 1080, height: 1080 }
  );
}








