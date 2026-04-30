import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        if (pathname.startsWith("/job-seeker") && token?.role !== "job-seeker") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (pathname.startsWith("/company") && token?.role !== "company") {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (pathname.startsWith("/admin") && token?.role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/company/:path*", "/job-seeker/:path*"],
};