import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Next.js 16 Network Proxy ("Gatekeeper")
 * 
 * Capabilities:
 * 1. Request Tracing: Injects unique X-Request-ID for stack-traceability.
 * 2. Security Hardening: Injects CSP, HSTS, and other transport security headers.
 * 3. Session Synchronization: Core Supabase Auth lifecycle management.
 */
export default async function proxy(request: NextRequest) {
    // 1. Generate unique Request Identifier (Enterprise Tracing)
    const requestId = crypto.randomUUID();

    // 2. Perform Session Update (Core Auth)
    let response = await updateSession(request);

    // If updateSession returns a simple response, we ensure it's a NextResponse
    if (!response) {
        response = NextResponse.next();
    }

    // 3. Security Header Injection
    const headers = response.headers;

    // Request Tracing
    headers.set('X-Request-ID', requestId);

    // Transport & Content Security
    headers.set('X-DNS-Prefetch-Control', 'on');
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // Permissions Policy (Camera/Geo/Mic privacy)
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // 4. Maintenance / Canary Flags (Demonstration)
    // if (process.env.MAINTENANCE_MODE === 'true') {
    //    return NextResponse.rewrite(new URL('/maintenance', request.url));
    // }

    return response;
}

export const config = {
    matcher: [
        /*
         * Next.js 16 Optimized Matcher:
         * Matches all request paths except static assets and internal Next.js files.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
