import { type NextRequest } from 'next/server';
import redis from "@/lib/auth/redis";
import { getSessionId } from "@/lib/auth/cookieUtils";
import authService from '@/lib/auth/authService';

export async function POST(request: NextRequest) {
  const { refreshToken } = await request.json();
  const sessionId = getSessionId();

  if (!refreshToken || !sessionId) {
    return Response.json({ success: false }, { status: 400 });
  }

  try {
    const newTokens = await authService.refreshAccessToken(refreshToken);
    const sessionData = {
      accessToken: newTokens.AccessToken || null,
      refreshToken: refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + 86400,
    };
    await redis.hSet(`session-${sessionId}`, 'data', JSON.stringify(sessionData));
  } catch(error) {
    return Response.json({ success: false }, { status: 404 });
  }
  return Response.json({ success: true }, { status: 200 });
}