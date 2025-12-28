// import { Errors, createClient } from "@farcaster/quick-auth";
// import { NextRequest, NextResponse } from "next/server";

// const client = createClient();

// // Helper function to determine the correct domain for JWT verification
// function getUrlHost(request: NextRequest): string {
//   // First try to get the origin from the Origin header (most reliable for CORS requests)
//   const origin = request.headers.get("origin");
//   if (origin) {
//     try {
//       const url = new URL(origin);
//       return url.host;
//     } catch (error) {
//       console.warn("Invalid origin header:", origin, error);
//     }
//   }

//   // Fallback to Host header
//   const host = request.headers.get("host");
//   if (host) {
//     return host;
//   }

//   // Final fallback to environment variables (your original logic)
//   let urlValue: string;
//   if (process.env.VERCEL_ENV === "production") {
//     urlValue = process.env.NEXT_PUBLIC_URL!;
//   } else if (process.env.VERCEL_URL) {
//     urlValue = `https://${process.env.VERCEL_URL}`;
//   } else {
//     urlValue = "http://localhost:3000";
//   }

//   const url = new URL(urlValue);
//   return url.host;
// }

// export async function GET(request: NextRequest) {
//   // Because we're fetching this endpoint via `sdk.quickAuth.fetch`,
//   // if we're in a mini app, the request will include the necessary `Authorization` header.
//   const authorization = request.headers.get("Authorization");

//   // Here we ensure that we have a valid token.
//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return NextResponse.json({ message: "Missing token" }, { status: 401 });
//   }

//   try {
//     // Now we verify the token. `domain` must match the domain of the request.
//     // In our case, we're using the `getUrlHost` function to get the domain of the request
//     // based on the Vercel environment. This will vary depending on your hosting provider.
//     const payload = await client.verifyJwt({
//       token: authorization.split(" ")[1] as string,
//       domain: getUrlHost(request),
//     });

//     console.log("payload", payload);

//     // If the token was valid, `payload.sub` will be the user's Farcaster ID.
//     const userFid = payload.sub;

//     // Return user information for your waitlist application
//     return NextResponse.json({
//       success: true,
//       user: {
//         fid: userFid,
//         issuedAt: payload.iat,
//         expiresAt: payload.exp,
//       },
//     });

//   } catch (e) {
//     if (e instanceof Errors.InvalidTokenError) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }
//     if (e instanceof Error) {
//       return NextResponse.json({ message: e.message }, { status: 500 });
//     }
//     throw e;
//   }
// }








// app/api/auth/route.ts
// 👉 Base Mini App + Farcaster QuickAuth এর জন্য FINAL correct version

import { NextRequest, NextResponse } from "next/server"; // Next.js request/response
import { createClient, Errors } from "@farcaster/quick-auth"; // Farcaster QuickAuth SDK

// 🔹 QuickAuth client init
const client = createClient();

// 🔹 request domain বের করার helper
function getRequestDomain(req: NextRequest): string {
  // 🔹 Origin header থাকলে সেটাই সবচেয়ে reliable
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host;
    } catch {}
  }

  // 🔹 fallback: host header
  const host = req.headers.get("host");
  if (host) return host;

  // 🔹 final fallback (local / vercel)
  if (process.env.VERCEL_ENV === "production") {
    return new URL(process.env.NEXT_PUBLIC_URL!).host;
  }

  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL;
  }

  return "localhost:3000";
}

// 🔹 GET handler (QuickAuth only GET support করে)
export async function GET(req: NextRequest) {
  // 🔹 Authorization header নেওয়া
  const authHeader = req.headers.get("authorization");

  // 🔹 token না থাকলে reject
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Missing authorization token" },
      { status: 401 }
    );
  }

  try {
    // 🔹 JWT token extract
    const token = authHeader.replace("Bearer ", "");

    // 🔹 token verify (domain must match)
    const payload = await client.verifyJwt({
      token,
      domain: getRequestDomain(req),
    });

    // 🔹 verified user info return
    return NextResponse.json({
      success: true,
      user: {
        fid: payload.sub, // Farcaster ID
        issuedAt: payload.iat, // token issue time
        expiresAt: payload.exp, // token expiry
      },
    });
  } catch (err) {
    // 🔹 invalid token
    if (err instanceof Errors.InvalidTokenError) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    // 🔹 other server error
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        { status: 500 }
      );
    }

    throw err;
  }
}
