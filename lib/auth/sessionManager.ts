import "server-only";

import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';
import redis from "@/lib/auth/redis";
import { generateNewSessionId, getSessionId, setSessionId, deleteSessionId } from "@/lib/auth/cookieUtils";

class SessionManager {
  public async setTokens(authResult: AuthenticationResultType) {
    const sessionId = generateNewSessionId();
    if (!sessionId) {
      return null;
    }
    const sessionData = {
      accessToken: authResult.AccessToken || null,
      refreshToken: authResult.RefreshToken || null,
      expiresAt: Math.floor(Date.now() / 1000) + 86400,
    };
    await redis.hSet(`session-${sessionId}`, 'data', JSON.stringify(sessionData));
    setSessionId(sessionId);
  }

  public async getTokens() {
    const sessionId = getSessionId();
    if (!sessionId) {
      return null;
    }
    const result = await redis.hGet(`session-${sessionId}`, 'data');
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }

  public async clearTokens() {
    const sessionId = getSessionId();
    if (!sessionId) {
      return;
    }
    await redis.hDel(`session-${sessionId}`, 'data');
    deleteSessionId();
  }
}

const sessionManager = new SessionManager();
export default sessionManager;