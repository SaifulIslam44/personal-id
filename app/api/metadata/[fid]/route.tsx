// /** @jsxImportSource react */
// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';
// import { NextRequest } from 'next/server';

// export const runtime = 'edge';
// export const dynamic = 'force-dynamic'; 

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ fid: string }> }
// ) {
//   const { fid } = await params;
//   const url = new URL(req.url);

//   try {
//     const res = await fetch(`https://api.warpcast.com/v2/user-by-fid?fid=${fid}`);
//     const json = await res.json();
//     const user = json.result.user;

//     const userName = user.displayName || "Base User";
//     const userHandle = user.username ? `@${user.username}` : "";
//     const pfpUrl = user.pfp.url || "https://wrpcd.xyz/pfp/default.png";

//     // 🔹 JSON রিকোয়েস্ট চেক করার জন্য উন্নত লজিক
//     // যদি শেষে .json থাকে অথবা ব্রাউজার/মার্কেটপ্লেস JSON ডাটা ডিমান্ড করে
//     const isJson = url.pathname.endsWith('.json') || req.headers.get('accept')?.includes('json');

//     if (isJson) {
//       return new Response(JSON.stringify({
//         name: `Onchain ID #${fid}`,
//         description: `Official ID for ${userName}`,
//         // 🔹 ইমেজের শেষে .png যোগ করা হয়েছে যাতে ওয়ালেট এটাকে ইমেজ ফাইল হিসেবে দ্রুত চিনতে পারে
//         image: `${process.env.NEXT_PUBLIC_URL || 'http://' + req.headers.get('host')}/api/metadata/${fid}/image.png`,
//         attributes: [
//           { trait_type: "FID", value: fid },
//           { trait_type: "Name", value: userName }
//         ]
//       }), { headers: { 'Content-Type': 'application/json' } });
//     }

//     // 🔹 ইমেজ জেনারেশন অংশ
//     // 🔹 শুধু এই অংশটা বদলাও — বাইরে কোনো background থাকবে না

// // ✅ শুধু card-টাই canvas হবে (no extra background possible way)

// return new ImageResponse(
//   (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         backgroundColor: '#1a1a1a',
//         borderRadius: 40,
//         padding: 50,
//         border: '2px solid #222',
//         width: '100%',
//         height: '100%',
//         color: 'white',
//       }}
//     >
//       <img
//         src={pfpUrl}
//         alt="Profile"
//         style={{
//           width: 180,
//           height: 180,
//           borderRadius: 30,
//           border: '5px solid #0052FF',
//         }}
//       />
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           marginLeft: 40,
//           justifyContent: 'center',
//         }}
//       >
//         <div style={{ fontSize: 40, fontWeight: 'bold' }}>{userName}</div>
//         <div style={{ fontSize: 26, color: '#0052FF' }}>{userHandle}</div>
//         <div style={{ fontSize: 24, color: '#888', marginTop: 15 }}>
//           FID: {fid}
//         </div>
//         <div
//           style={{
//             marginTop: 20,
//             backgroundColor: '#0052FF22',
//             color: '#0052FF',
//             padding: '10px 20px',
//             borderRadius: 100,
//             fontSize: 18,
//             width: 'fit-content',
//           }}
//         >
//           Onchain Identity
//         </div>
//       </div>
//     </div>
//   ),
//   {
//     width: 900,
//     height: 300,
//   }
// );


//   } catch (e) {
//     console.error("Error:", e);
//     return new Response("Failed to generate image", { status: 500 });
//   }
// }















// /** @jsxImportSource react */
// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';
// import { NextRequest } from 'next/server';

// export const runtime = 'edge';
// export const dynamic = 'force-dynamic'; 

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ fid: string }> }
// ) {
//   const { fid } = await params;
//   const url = new URL(req.url);

//   try {
//     // 🔹 পরিবর্তন ১: fetch এ cache: 'no-store' যোগ করা হয়েছে যাতে Warpcast থেকে সবসময় ফ্রেশ ডাটা আসে
//     const res = await fetch(`https://api.warpcast.com/v2/user-by-fid?fid=${fid}`, {
//       cache: 'no-store',
//       headers: { 'Cache-Control': 'no-cache' }
//     });
    
//     const json = await res.json();
//     const user = json.result.user;

//     const userName = user.displayName || "Base User";
//     const userHandle = user.username ? `@${user.username}` : "";
//     const pfpUrl = user.pfp.url || "https://wrpcd.xyz/pfp/default.png";
//     // const pfpUrl = user.pfp?.url || "https://i.imgur.com/8RK9Zf3.png";

//     const isJson = url.pathname.endsWith('.json') || req.headers.get('accept')?.includes('json');

//     if (isJson) {
//       return new Response(JSON.stringify({
//         name: `Onchain ID #${fid}`,
//         description: `Official ID for ${userName}`,
//         image: `${process.env.NEXT_PUBLIC_URL || 'http://' + req.headers.get('host')}/api/metadata/${fid}/image.png`,
//         attributes: [
//           { trait_type: "FID", value: fid },
//           { trait_type: "Name", value: userName }
//         ]
//       }), { 
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store, max-age=0' // মেটাডাটা ক্যাশ বন্ধ করা হয়েছে
//         } 
//       });
//     }

//     return new ImageResponse(
//       (
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             backgroundColor: '#121212',
//             width: '900px',
//             height: '400px',
//             color: 'white',
//             alignItems: 'center',
//             padding: '40px',
//             border: '6px solid #0052FF',
//             borderRadius: '0px',
//             position: 'relative',
//           }}
//         >
//           {/* Profile Section */}
//           <div style={{ display: 'flex', position: 'relative' }}>
//             <img
//               src={pfpUrl}
//               alt="Profile"
//               style={{
//                 width: 240,
//                 height: 240,
//                 borderRadius: 40,
//                 objectFit: 'cover',
//                 border: '8px solid #0052FF',
//               }}
//             />
//           </div>

//           {/* User Details Section */}
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               marginLeft: 40,
//               flex: 1,
//             }}
//           >
//             <div style={{ display: 'flex', fontSize: 55, fontWeight: 'bold', letterSpacing: '-1px' }}>
//               {userName}
//             </div>
//             <div style={{ display: 'flex', fontSize: 32, color: '#0052FF', marginTop: 5 }}>
//               {userHandle}
//             </div>
//             <div style={{ display: 'flex', fontSize: 26, color: '#666', marginTop: 15, fontWeight: '500' }}>
//               FID: {fid}
//             </div>

//             <div style={{ display: 'flex', marginTop: 35 }}>
//               <div
//                 style={{
//                   display: 'flex',
//                   backgroundColor: '#0052FF',
//                   color: 'white',
//                   padding: '12px 30px',
//                   borderRadius: 100,
//                   fontSize: 22,
//                   fontWeight: 'bold',
//                 }}
//               >
//                 Onchain Identity
//               </div>
//             </div>
//           </div>

//           {/* Premium Badge Design for Base App User */}
//           <div
//             style={{
//               display: 'flex',
//               position: 'absolute',
//               bottom: 40,
//               right: 40,
//               padding: '10px 24px',
//               backgroundColor: '#0052FF15',
//               border: '2px solid #0052FF',
//               borderRadius: '12px',
//               alignItems: 'center',
//               justifyContent: 'center',
//               boxShadow: '0 0 20px rgba(0, 82, 255, 0.2)',
//             }}
//           >
//             <span
//               style={{
//                 fontSize: 20,
//                 color: '#0052FF',
//                 fontWeight: '900',
//                 textTransform: 'uppercase',
//                 letterSpacing: '2px',
//               }}
//             >
//               VERIFIED PIM USER
//             </span>
//           </div>
//         </div>
//       ),
//       {
//         width: 900,
//         height: 400,
//         // 🔹 পরিবর্তন ২: এখানে ক্যাশ কন্ট্রোল হেডার যোগ করা হয়েছে যাতে ব্রাউজার ইমেজ ক্যাশ না করে
//         headers: {
//           'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
//           'Pragma': 'no-cache',
//           'Expires': '0',
//         },
//       }
//     );

//   } catch (e) {
//     console.error("Error:", e);
//     return new Response("Failed to generate image", { status: 500 });
//   }
// }












// /** @jsxImportSource react */
// /* eslint-disable @next/next/no-img-element */
// import { ImageResponse } from 'next/og';
// import { NextRequest } from 'next/server';

// export const runtime = 'edge';
// export const revalidate = 1296000;

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ fid: string }> }
// ) {
//   const { fid } = await params;
//   const url = new URL(req.url);

//   try {
//     const res = await fetch(`https://api.warpcast.com/v2/user-by-fid?fid=${fid}`, {
//       next: { revalidate: 1296000 }
//     });
    
//     const json = await res.json();
    
//     if (!json.result || !json.result.user) {
//         return new Response("User not found", { status: 404 });
//     }

//     const user = json.result.user;
//     const userName = user.displayName || "Base User";
//     const userHandle = user.username ? `@${user.username}` : "";

//     // 🔹 এখানে ডিফল্ট ইমেজ সেট করা হয়েছে। 
//     // যদি Warpcast থেকে pfp.url না আসে, তবে এই লিংকটি ব্যবহার হবে।
//     const defaultPfp = "https://placehold.co/100x100/0052FF/ffffff?text=?"; 
//     const pfpUrl = user.pfp?.url && user.pfp.url !== "" ? user.pfp.url : defaultPfp;

//     const isJson = url.pathname.endsWith('.json') || req.headers.get('accept')?.includes('json');

//     if (isJson) {
//       return new Response(JSON.stringify({
//         name: `Onchain ID #${fid}`,
//         description: `Official ID for ${userName}`,
//         image: `${process.env.NEXT_PUBLIC_URL || 'https://' + req.headers.get('host')}/api/metadata/${fid}/image.png`,
//         attributes: [
//           { trait_type: "FID", value: fid },
//           { trait_type: "Name", value: userName }
//         ]
//       }), { 
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'public, s-maxage=1296000, stale-while-revalidate=86400'
//         } 
//       });
//     }

//     return new ImageResponse(
//       (
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'row',
//             backgroundColor: '#121212',
//             width: '900px',
//             height: '400px',
//             color: 'white',
//             alignItems: 'center',
//             padding: '40px',
//             border: '6px solid #0052FF',
//             borderRadius: '0px',
//             position: 'relative',
//           }}
//         >
//           {/* Profile Section */}
//           <div style={{ display: 'flex', position: 'relative' }}>
//             <img
//               src={pfpUrl}
//               alt="Profile"
//               // 🔹onError হ্যান্ডলিং: যদি pfpUrl কাজ না করে, তবে ব্রাউজার স্বয়ংক্রিয়ভাবে ডিফল্ট ইমেজটি দেখাবে
//               onError={(e: any) => {
//                 e.currentTarget.src = defaultPfp;
//               }}
//               style={{
//                 width: 240,
//                 height: 240,
//                 borderRadius: 40,
//                 objectFit: 'cover',
//                 border: '8px solid #0052FF',
//               }}
//             />
//           </div>

//           <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40, flex: 1 }}>
//             <div style={{ display: 'flex', fontSize: 55, fontWeight: 'bold', letterSpacing: '-1px' }}>{userName}</div>
//             <div style={{ display: 'flex', fontSize: 32, color: '#0052FF', marginTop: 5 }}>{userHandle}</div>
//             <div style={{ display: 'flex', fontSize: 26, color: '#666', marginTop: 15, fontWeight: '500' }}>FID: {fid}</div>
//             <div style={{ display: 'flex', marginTop: 35 }}>
//               <div style={{ display: 'flex', backgroundColor: '#0052FF', color: 'white', padding: '12px 30px', borderRadius: 100, fontSize: 22, fontWeight: 'bold' }}>Onchain Identity</div>
//             </div>
//           </div>

//           <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 40, padding: '10px 24px', backgroundColor: '#0052FF15', border: '2px solid #0052FF', borderRadius: '12px', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 82, 255, 0.2)' }}>
//             <span style={{ fontSize: 20, color: '#0052FF', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>VERIFIED PIM USER</span>
//           </div>
//         </div>
//       ),
//       {
//         width: 900,
//         height: 400,
//         headers: {
//           'Cache-Control': 'public, s-maxage=1296000, stale-while-revalidate=86400',
//         },
//       }
//     );

//   } catch (e) {
//     console.error("Error:", e);
//     // 🔹 এরর আসলে একটি সিম্পল রেসপন্স দিন যাতে CPU প্রসেসিং না ঝুলে থাকে
//     return new Response("Failed to generate image", { status: 500 });
//   }
// }















//No change neynar api not requied for this file. 


/** @jsxImportSource react */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// export const runtime = 'edge';
export const revalidate = 1296000;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fid: string }> }
) {
  const { fid } = await params;
  const url = new URL(req.url);

  try {
    const res = await fetch(`https://api.warpcast.com/v2/user-by-fid?fid=${fid}`, {
      next: { revalidate: 1296000 }
    });
    
    const json = await res.json();
    
    if (!json.result || !json.result.user) {
        return new Response("User not found", { status: 404 });
    }

    const user = json.result.user;
    const userName = user.displayName || "Base User";
    const userHandle = user.username ? `@${user.username}` : "";
    
    // প্রোফাইল পিকচার চেক
    const pfpUrl = user.pfp?.url || "";

    const isJson = url.pathname.endsWith('.json') || req.headers.get('accept')?.includes('json');

    if (isJson) {
      return new Response(JSON.stringify({
        name: `Onchain ID #${fid}`,
        description: `Official ID for ${userName}`,
        image: `${process.env.NEXT_PUBLIC_URL || 'https://' + req.headers.get('host')}/api/metadata/${fid}/image.png`,
        attributes: [
          { trait_type: "FID", value: fid },
          { trait_type: "Name", value: userName }
        ]
      }), { 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=1296000, stale-while-revalidate=86400'
        } 
      });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#121212',
            width: '900px',
            height: '400px',
            color: 'white',
            alignItems: 'center',
            padding: '40px',
            border: '6px solid #0052FF',
            borderRadius: '0px',
            position: 'relative',
          }}
        >
          {/* Profile Section */}
          <div style={{ display: 'flex', position: 'relative' }}>
            {pfpUrl ? (
              <img
                src={pfpUrl}
                alt="Profile"
                width="240"
                height="240"
                style={{
                  borderRadius: 40,
                  objectFit: 'cover',
                  border: '8px solid #0052FF',
                }}
              />
            ) : (
              /* ইমেজ না থাকলে placehold.co এর বদলে Pure CSS Avatar */
              <div style={{
                display: 'flex',
                width: '240px',
                height: '240px',
                borderRadius: '40px',
                backgroundColor: '#0052FF',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '100px',
                fontWeight: 'bold',
                color: 'white',
                border: '8px solid #0052FF',
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40, flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 55, fontWeight: 'bold', letterSpacing: '-1px' }}>{userName}</div>
            <div style={{ display: 'flex', fontSize: 32, color: '#0052FF', marginTop: 5 }}>{userHandle}</div>
            <div style={{ display: 'flex', fontSize: 26, color: '#666', marginTop: 15, fontWeight: '500' }}>FID: {fid}</div>
            <div style={{ display: 'flex', marginTop: 35 }}>
              <div style={{ display: 'flex', backgroundColor: '#0052FF', color: 'white', padding: '12px 30px', borderRadius: 100, fontSize: 22, fontWeight: 'bold' }}>Onchain Identity</div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            position: 'absolute', 
            bottom: 40, 
            right: 40, 
            padding: '10px 24px', 
            backgroundColor: 'rgba(0, 82, 255, 0.15)', 
            border: '2px solid #0052FF', 
            borderRadius: '12px', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ fontSize: 20, color: '#0052FF', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>VERIFIED PIM USER</span>
          </div>
        </div>
      ),
      {
        width: 900,
        height: 400,
        headers: {
          'Cache-Control': 'public, s-maxage=1296000, stale-while-revalidate=86400',
        },
      }
    );

  } catch (e) {
    console.error("Error:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}