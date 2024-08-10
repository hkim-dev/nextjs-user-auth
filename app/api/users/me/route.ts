import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import authService from '@/lib/auth/authService';
import sessionManager from "@/lib/auth/sessionManager";

export async function GET() {
  const tokens = await sessionManager.getTokens();
  try {
    let user = null;
    if (tokens && tokens.accessToken) {
      const response = await authService.getUserInfo(tokens.accessToken);
      if (response.UserAttributes) {
        const email = getAttributeValue(response.UserAttributes, "email");
        const nickname = getAttributeValue(response.UserAttributes, "nickname");
        const userCreateDate = response.UserCreateDate;
        user = {
          email: email || '',
          nickname: nickname || '',
          created_at: userCreateDate || new Date()
        };
      }
    }
    return Response.json({ user: user }, { status: 200 });
  } catch(error: any) {
    console.error("Error fetching user info: ", error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function getAttributeValue(attributes: AttributeType[], attributeName: string) {
  const attribute = attributes.find(attr => attr.Name === attributeName);
  return attribute?.Value;
}