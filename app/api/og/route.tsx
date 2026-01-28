

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










/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // URL থেকে পাঠানো এনকোডেড ডেটা রিসিভ করা
  const username = searchParams.get('username') || 'User';
  const fid = searchParams.get('fid') || '0';
  const score = searchParams.get('score') || '0.00';
  const rank = searchParams.get('rank') || 'ACTIVE USER';
  const pfp = searchParams.get('pfp');

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
          border: '3px solid rgba(240, 100, 47, 0.5)', 
          borderRadius: '40px',
          padding: '40px',
          width: '550px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        }}>

          {/* হেডার */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#f0642f',
            fontSize: '18px',
            marginBottom: '20px',
            fontWeight: '700',
          }}>
            <span style={{ marginRight: '8px' }}>🛡️</span> VERIFIED IDENTITY
          </div>

          {/* প্রোফাইল পিকচার ফিক্স */}
          <div style={{
            display: 'flex',
            width: '120px',
            height: '120px',
            borderRadius: '100px',
            border: '4px solid #f0642f',
            backgroundColor: '#1a1d23',
            overflow: 'hidden',
            marginBottom: '15px',
          }}>
            {pfp ? (
              <img src={decodeURIComponent(pfp)} width="120" height="120" style={{ objectFit: 'cover' }} alt="PFP" />
            ) : (
              <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#f0642f', fontSize: '50px' }}>
                👤
              </div>
            )}
          </div>

          {/* ইউজার নাম ও FID ফিক্স */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '32px', margin: '0 0 5px', fontWeight: '800', textAlign: 'center' }}>
              {decodeURIComponent(username)}
            </h2>
            <p style={{ color: '#f0642f', fontSize: '20px', fontWeight: '700', margin: '0', opacity: 0.9 }}>
              FID: {fid}
            </p>
          </div>

          <div style={{ display: 'flex', height: '2px', width: '70%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', margin: '0 0 20px 0' }}></div>

          {/* স্কোর সেকশন ফিক্স */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p style={{ color: '#8a94a8', fontSize: '14px', margin: '0 0 5px 0', textTransform: 'uppercase', fontWeight: '600' }}>Activity Neynar Score</p>
             <h1 style={{ color: 'white', fontSize: '90px', margin: '0', fontWeight: '900', lineHeight: '1', textAlign: 'center' }}>
               {score}
             </h1>
          </div>

          {/* র‍্যাঙ্ক ব্যাজ ফিক্স */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(74, 222, 128, 0.1)',
            color: '#4ade80',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            padding: '10px 25px',
            borderRadius: '50px',
            fontSize: '18px',
            marginTop: '25px',
            fontWeight: '700',
          }}>
            <span style={{ marginRight: '8px' }}>⚡</span> {decodeURIComponent(rank)}
          </div>

        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}