import { OAuth2Client } from "google-auth-library";
import authService from "@/lib/auth/authService";
import sessionManager from "@/lib/auth/sessionManager";

const oauth2Client = new OAuth2Client();

export async function POST(request: Request) {
  const { token } = await request.json();
  try {
    const result = await verifyGoogleIdToken(token);
    if (!result) {
      return Response.json({ error: 'Invalid token payload' }, { status: 401 });
    }
    const email = result.email;
    const sub = result.userId;
    const socialSigninPassword = `SocialPassword!@${sub}`;
    try {
      await authService.adminGetUserInfo(email);
    } catch(error: any) {
      if (error.name === "UserNotFoundException") {
        await authService.socialSignUp(email, socialSigninPassword, 'google');
        await authService.linkProviderForCognitoUser(email, sub, 'Google');
      }
    } finally {
      const authResult = await authService.signIn(email, socialSigninPassword);
      sessionManager.setTokens(authResult);
    }
  } catch(error) {
    console.error("Error authenticating user: ", error);
    return Response.json({ success: false }, { status: 500 });
  }
  return Response.json({ success: true }, { status: 200 });
}

async function verifyGoogleIdToken(token: string): Promise<{ userId: string, email: string} | null> {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
    });
    const payload = ticket.getPayload();
    if (payload) {
      const userid = payload['sub'];
      const email = payload['email'] || 'N/A';
      return { userId: userid, email: email };
    } else {
      return null;
    }
  } catch(error) {
    console.error("Verification of Google ID token failed: ", error);
    return null;
  }
}