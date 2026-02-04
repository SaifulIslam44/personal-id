import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addresses = searchParams.get("addresses");

  if (!addresses) return NextResponse.json({});

  try {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addresses}`, 
      {
        headers: {
          'accept': 'application/json',
          'api_key': process.env.NEYNAR_API_KEY as string
        }
      }
    );

    const data = await response.json();
    const profileMap: Record<string, { profileName: string; pfp: string }> = {};

    if (data) {
      Object.keys(data).forEach((addr) => {
        const user = data[addr][0];
        if (user) {
          profileMap[addr.toLowerCase()] = {
            profileName: user.display_name || user.username, // Display Name না থাকলে ইউজারনেম দেখাবে
            pfp: user.pfp_url
          };
        }
      });
    }

    return NextResponse.json(profileMap);
  } catch {
    return NextResponse.json({});
  }
}