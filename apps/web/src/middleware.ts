import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth")?.value;

  let isAdmin = false;
  if (authToken) {
    const user = jwt.decode(authToken);
    console.log("user is ", user);
    isAdmin = typeof user === "object" ? user?.role === "admin" : false;
  }

  // console.log("isAdmin is ", isAdmin);

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
