import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth")?.value;

  const userInfoCookie = request.cookies.get("userInfo")?.value as string;

  let userInfo = null;
  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie);
    } catch (e) {
      console.error("Error parsing JSON", e);
      // Handle the error or set a default value for userInfo
    }
  }

  let isAdmin = false;
  if (authToken) {
    isAdmin = typeof userInfo === "object" ? userInfo?.role === "admin" : false;
  }

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

  if (authToken) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/problems", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    // "/problems",
    // "/problem/:path*",
    // "/groups",
    "/settings/:path*",
  ],
};
