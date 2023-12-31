import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth")?.value;
  // console.log("auth cookie is ", authToken);

  const loggedInUserNotAccessPaths =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  if (loggedInUserNotAccessPaths) {
    if (authToken) {
      return NextResponse.redirect(new URL("/problems", request.url));
    }
  } else {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  //   return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    "/problems",
    "/problem/:path*",
    "/groups",
    "/group/:path*",
    "/settings/:path*",
  ],
};
