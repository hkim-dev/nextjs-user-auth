import { type NextRequest } from 'next/server';
import authService from "@/lib/auth/authService";
import sessionManager from "@/lib/auth/sessionManager";

export async function POST(request: NextRequest) {

  const data = await request.json();
  try {
    const authResult = await authService.signIn(data.username, data.password);
    await sessionManager.setTokens(authResult);
    return Response.json({ success: true }, { status: 200 });
  } catch(error: any) {
    return Response.json({
      error: {
        name: error.name,
        message: error.message
      }
    }, { status: 400 });
  }
}