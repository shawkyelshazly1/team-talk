import { NextRequest, NextResponse } from "next/server";

const team_lead_routes = ["/app", "/app/conversations"];
const csr_routes = ["/app/inbox", "/app/search"];
export async function middleware(request: NextRequest) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL}/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
        });

        const { nextUrl } = request;

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



        // check routes based on role
        if (team_lead_routes.includes(nextUrl.pathname) && session.user.role !== "team_lead") {


            return NextResponse.redirect(new URL("/app/inbox", request.url));
        }

        if (csr_routes.includes(nextUrl.pathname) && session.user.role !== "csr") {

            return NextResponse.redirect(new URL("/app", request.url));
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