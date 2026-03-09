
//Neynar Api main code:


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
  
//   // 👇 Logic: URL e PFP na thakle FID diye fetch koro (Ja chilo tai ache)
//   let pfpUrl = getParam('pfp');

//   if (!pfpUrl && fid !== '0') {
//     try {
//         const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//             headers: {
//                 'accept': 'application/json',
//                 'api_key': process.env.NEYNAR_API_KEY || ''
//             },
//             next: { revalidate: 86400 }
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
//           border: '5px solid rgba(240, 100, 47, 0.5)', // Border ektu mota kora hoyeche
//           borderRadius: '60px', // Radius barano hoyeche
//           padding: '50px',
//           width: '900px',  // Size barano hoyeche square er jonno
//           height: '900px', // Square box er moto
//           boxShadow: '0 0 60px rgba(240, 100, 47, 0.2)' // Glow effect add kora hoyeche
//         }}>
          
//           <div style={{ display: 'flex', color: '#f0642f', fontSize: '28px', marginBottom: '30px', fontWeight: '800', letterSpacing: '2px' }}>
//             🛡️ VERIFIED IDENTITY
//           </div>

//           <div style={{ display: 'flex', width: '200px', height: '200px', borderRadius: '200px', border: '6px solid #f0642f', overflow: 'hidden', marginBottom: '25px' }}>
//              {/* PFP Render - Size barano hoyeche 120 theke 200 */}
//              <img src={pfpUrl} width="200" height="200" style={{ objectFit: 'cover' }} alt="PFP" />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
//             <h2 style={{ color: 'white', fontSize: '56px', margin: '0', fontWeight: '900', textAlign: 'center' }}>{username}</h2>
//             <p style={{ color: '#f0642f', fontSize: '32px', fontWeight: '700', margin: '10px 0' }}>FID: {fid}</p>
//           </div>

//           <div style={{ display: 'flex', height: '3px', width: '60%', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}></div>

//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//              <p style={{ color: '#8a94a8', fontSize: '22px', margin: '0', letterSpacing: '1px' }}>ACTIVITY NEYNAR SCORE</p>
//              {/* Score font huge kora hoyeche */}
//              <h1 style={{ color: 'white', fontSize: '130px', margin: '10px 0', fontWeight: '900', lineHeight: '1' }}>{score}</h1>
//           </div>

//           <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontSize: '28px', padding: '15px 40px', borderRadius: '60px', marginTop: '30px', fontWeight: '800' }}>
//             ⚡ {rank}
//           </div>
//         </div>
//       </div>
//     ),
//     // 👇 Eikhane Dimensions Change kora hoyeche Square er jonno
//     { width: 1080, height: 1080 }
//   );
// }






























/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge'; 

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
  
  let pfpUrl = getParam('pfp');

  // ১৫ দিনের সেকেন্ডের হিসাব
  const FIFTEEN_DAYS = 1296000; 

  if (!pfpUrl && fid !== '0') {
    try {
        const neynarRes = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                'accept': 'application/json',
                'api_key': process.env.NEYNAR_API_KEY || ''
            },
            // 🔥 এখানেও ১৫ দিন করে দেওয়া হলো
            next: { revalidate: FIFTEEN_DAYS }
        });
        const data = await neynarRes.json();
        if (data.users && data.users.length > 0) {
            pfpUrl = data.users[0].pfp_url;
        }
    } catch (e) {
        console.error("Failed to fetch PFP in OG", e);
    }
  }

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
          border: '5px solid rgba(240, 100, 47, 0.5)', 
          borderRadius: '60px', 
          padding: '50px',
          width: '900px',  
          height: '900px', 
          boxShadow: '0 0 60px rgba(240, 100, 47, 0.2)' 
        }}>
          
          <div style={{ display: 'flex', color: '#f0642f', fontSize: '28px', marginBottom: '30px', fontWeight: '800', letterSpacing: '2px' }}>
            🛡️ VERIFIED IDENTITY
          </div>

          <div style={{ display: 'flex', width: '200px', height: '200px', borderRadius: '200px', border: '6px solid #f0642f', overflow: 'hidden', marginBottom: '25px' }}>
             <img src={pfpUrl} width="200" height="200" style={{ objectFit: 'cover' }} alt="PFP" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '56px', margin: '0', fontWeight: '900', textAlign: 'center' }}>{username}</h2>
            <p style={{ color: '#f0642f', fontSize: '32px', fontWeight: '700', margin: '10px 0' }}>FID: {fid}</p>
          </div>

          <div style={{ display: 'flex', height: '3px', width: '60%', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p style={{ color: '#8a94a8', fontSize: '22px', margin: '0', letterSpacing: '1px' }}>ACTIVITY NEYNAR SCORE</p>
             <h1 style={{ color: 'white', fontSize: '130px', margin: '10px 0', fontWeight: '900', lineHeight: '1' }}>{score}</h1>
          </div>

          <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontSize: '28px', padding: '15px 40px', borderRadius: '60px', marginTop: '30px', fontWeight: '800' }}>
            ⚡ {rank}
          </div>
        </div>
      </div>
    ),
    { 
      width: 1080, 
      height: 1080,
      // 🔥 এই অংশটি জেনারেট করা ইমেজকে ১৫ দিনের জন্য হার্ড ক্যাশ করবে
      headers: {
        'Cache-Control': `public, max-age=${FIFTEEN_DAYS}, immutable`,
      }
    }
  );
}