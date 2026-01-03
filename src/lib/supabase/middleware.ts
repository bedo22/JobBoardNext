import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isProtectedRoute =
        path.startsWith('/dashboard') ||
        path.startsWith('/jobs/post')

    // Optimization: If public route and no Supabase cookies, skip auth check
    const hasAuthCookies = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'))
    if (!isProtectedRoute && !hasAuthCookies) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}
