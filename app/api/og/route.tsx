
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


































//changed upper code is neynar api. 

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

  // ডিফল্ট ভ্যালু সেট করা (যাতে ডাটা না পেলেও ইমেজ জেনারেট হয়)
  const username = safeDecode(getParam('username')) || 'User';
  const fid = getParam('fid') || '0';
  const score = getParam('score') || '0.00';
  const rank = safeDecode(getParam('rank')) || 'ACTIVE USER';
  
  let pfpUrl = getParam('pfp');

  // 👇 SAFE API CALL: Warpcast Public API with Timeout
  if (!pfpUrl && fid !== '0') {
    try {
        const res = await fetch(`https://api.warpcast.com/v2/user?fid=${fid}`, {
            next: { revalidate: 86400 }, // ২৪ ঘণ্টা ক্যাশ
            signal: AbortSignal.timeout(2500) // ⏳ ২.৫ সেকেন্ডের বেশি সময় নিলে বন্ধ হয়ে যাবে
        });

        if (res.ok) {
            const data = await res.json();
            if (data.result && data.result.user && data.result.user.pfp) {
                pfpUrl = data.result.user.pfp.url;
            }
        }
    } catch {
        // ফেইল করলে লুপ আটকানোর জন্য আমরা সাইলেন্টলি ইগনোর করব
        // কনসোল লগ দেখতে পারেন ডিবাগিংয়ের জন্য, কিন্তু ইমেজ জেনারেট থামবে না
        console.log("PFP fetch skipped/failed, using fallback.");
    }
  }

  // 🛡️ Final Fallback Image (যদি কোনোভাবেই ছবি না পাওয়া যায়)
  if (!pfpUrl) {
    pfpUrl = `https://avatar.vercel.sh/${fid}?size=200`;
  }

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

          <div style={{ display: 'flex', width: '250px', height: '250px', borderRadius: '250px', border: '8px solid #f0642f', overflow: 'hidden', marginBottom: '25px' }}>
            
             <img src={pfpUrl} width="250" height="250" style={{ objectFit: 'cover' }} alt="PFP" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '64px', margin: '0', fontWeight: '900', textAlign: 'center' }}>{username}</h2>
            <p style={{ color: '#f0642f', fontSize: '38px', fontWeight: '700', margin: '10px 0' }}>FID: {fid}</p>
          </div>

          <div style={{ display: 'flex', height: '3px', width: '60%', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }}></div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p style={{ color: '#8a94a8', fontSize: '24px', margin: '0', letterSpacing: '1px' }}>ACTIVITY NEYNAR SCORE</p>
             <h1 style={{ color: 'white', fontSize: '150px', margin: '10px 0', fontWeight: '900', lineHeight: '1' }}>{score}</h1>
          </div>

          <div style={{ display: 'flex', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', fontSize: '32px', padding: '15px 50px', borderRadius: '60px', marginTop: '30px', fontWeight: '800' }}>
            ⚡ {rank}
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}