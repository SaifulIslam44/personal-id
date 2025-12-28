import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { event, notificationDetails } = payload;

    switch (event) {
      case "miniapp_added":
        
        console.log("User added app. Token:", notificationDetails?.token);
        
        break;

      case "notifications_enabled":
        console.log("Notifications enabled for token:", notificationDetails?.token);
        break;

      case "miniapp_removed":
        console.log("User removed the app");
        break;
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}