import session from "@/lib/auth/sessionManager";
import authService from "@/lib/auth/authService";

export async function POST() {
  try {
    const tokens = await session.getTokens();
    if (tokens.accessToken) {
      authService.revokeRefreshToken(tokens.accessToken);
      await session.clearTokens();
    }
  } catch(error) {
    return Response.json({ error: error }, { status: 500 });
  }
  return Response.json({ success: true }, { status: 200 });
}