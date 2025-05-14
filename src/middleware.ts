import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL}/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        if (response.status === 401) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (!response.ok) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        const session = await response.json();

        if (!session) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/app/:path*"], // Apply middleware to specific routes
};