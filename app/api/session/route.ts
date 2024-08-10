import { type NextRequest } from 'next/server';
import redis from "@/lib/auth/redis";
import { generateNewSessionId, getSessionId, setSessionId, deleteSessionId } from "@/lib/auth/cookieUtils";

export async function GET() {
  const sessionId = getSessionId();
  if (!sessionId) {
    return Response.json({ success: false, message: 'Session ID does not exist' }, { status: 400 });
  }
  const result = await redis.hGet(`session-${sessionId}`, 'data');
  if (result) {
    return Response.json({ sessionData: JSON.parse(result) }, { status: 200 });
  } else {
    return Response.json({ success: false }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  const { sessionData } = await request.json();
  const sessionId = generateNewSessionId();

  if (!sessionData) {
    return Response.json({ success: false }, { status: 400 });
  }
  
  try {
    await redis.hSet(`session-${sessionId}`, 'data', JSON.stringify(sessionData));
  } catch(error) {
    return Response.json({ success: false }, { status: 404 });
  }
  setSessionId(sessionId);
  return Response.json({ success: true }, { status: 200 });
}

export async function DELETE() {
  const sessionId = getSessionId();
  if (!sessionId) {
    return Response.json({ success: false }, { status: 400 });
  }

  try {
    await redis.hDel(`session-${sessionId}`, 'data');
  } catch (error) {
    return Response.json({ success: false }, { status: 404 });
  }
  deleteSessionId();
  return Response.json({ success: true }, { status: 200 });
}