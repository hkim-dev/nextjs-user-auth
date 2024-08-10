import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { isTokenExpired } from '@/lib/auth/tokenUtils';

const protectedRoutes = ['/account'];

export async function middleware(request: NextRequest) {
  const redisData = await getTokensFromRedis(request);
  const doesSessionExist = redisData && redisData.sessionData;
  
  if (doesSessionExist) {
    if (hasSessionExpired(redisData.sessionData.expiresAt) && protectedRoutes.includes(request.nextUrl.pathname)) {
      await deleteTokensInRedis(request.nextUrl.origin);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    if (isTokenExpired(redisData.sessionData.accessToken)) {
      const refreshResponse = await refreshAccessToken(request.nextUrl.origin, redisData.sessionData.refreshToken);
      if (!refreshResponse.ok) {
        return Response.json({ success: false, message: 'Authentication failed' }, { status: 401 });
      }
    }
  } else if(protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

function hasSessionExpired(expiresAt: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  return expiresAt && expiresAt < currentTime;
}

async function getTokensFromRedis(request: NextRequest) {
  const response = await fetch(`${request.nextUrl.origin}/api/session`, {
    method: 'GET',
    headers: {
      Cookie: cookies().toString()
    }
  });
  const redisData = response.ok ? await response.json() : null;
  return redisData;
}

async function deleteTokensInRedis(originURL: string) {
  await fetch(`${originURL}/api/session`, {
    method: 'DELETE',
    headers: {
      Cookie: cookies().toString()
    }
  });
}

async function refreshAccessToken(originURL: string, refreshToken: string) {
  return await fetch(`${originURL}/api/session/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies().toString()
    },
    body: JSON.stringify({ refreshToken: refreshToken })
  });
}