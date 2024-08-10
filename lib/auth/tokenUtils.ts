import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USERPOOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!
})


export async function isTokenValid(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    await verifier.verify(token);
    return true;
  } catch(error) {
    console.error("Token verification failed: ", error);
    return false;
  }
}

export function isTokenExpired(token: string | null) {
  if (!token) return true;
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000 < Date.now();
}