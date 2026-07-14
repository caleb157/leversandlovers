import { NextRequest, NextResponse } from "next/server";

// Site-wide passcode gate. Change via SITE_PASSCODE env var on Vercel.
const PASSCODE = process.env.SITE_PASSCODE ?? "pullthelever";

export function middleware(req: NextRequest) {
  if (req.cookies.get("b4t-site")?.value === PASSCODE) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the gate page itself and framework/static assets.
  matcher: ["/((?!gate|_next/static|_next/image|favicon.ico).*)"],
};
