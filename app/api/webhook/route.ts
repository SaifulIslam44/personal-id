import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Farcaster Webhook Data:", data);
    
  
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


export async function GET() {
  return NextResponse.json({ 
    message: "Webhook is active and ready for Farcaster!",
    status: "healthy"
  });
}