import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value
  const role = request.cookies.get('user-role')?.value

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/products', request.url))
    }
  }

  if (pathname.startsWith('/orders') || pathname === '/cart') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/cart'],
}
