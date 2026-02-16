// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const fid = searchParams.get("fid");

//   if (!fid) return NextResponse.json({ error: "FID missing" }, { status: 400 });

//   try {
//     const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
//       headers: {
//         'accept': 'application/json',
//         'api_key': process.env.NEYNAR_API_KEY as string
//       }
//     });

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch {
//     return NextResponse.json({ error: "Failed to fetch score" }, { status: 500 });
//   }
// }








import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) return NextResponse.json({ error: "FID missing" }, { status: 400 });

  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'accept': 'application/json',
        'api_key': process.env.NEYNAR_API_KEY as string
      },
      next: { revalidate: 86400 }
    });

    const data = await response.json();
    
    // Neynar JSON-এর 'users' অ্যারে থেকে প্রথম ইউজারের স্কোর নেওয়া
    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      return NextResponse.json({ 
        score: user.score || 0,
        username: user.username,
        fid: user.fid 
      });
    }

    return NextResponse.json({ score: 0 });
  } catch (_error) {
    console.error("Score Error:", _error);
    return NextResponse.json({ score: 0 });
  }
}