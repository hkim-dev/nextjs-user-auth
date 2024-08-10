import {
  CognitoIdentityProviderClient,
  AuthFlowType,
  InitiateAuthCommand, 
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  UpdateUserAttributesCommand,
  AdminGetUserCommand,
  AdminLinkProviderForUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  GlobalSignOutCommand,
  AuthenticationResultType,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import { AuthError } from "./authError";
import getNickname from "./generateNickname";
import { userAttribute } from "@/customTypes/auth";

class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;
  private clientId: string;
  private userPoolId: string;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    this.clientId = process.env.COGNITO_CLIENT_ID!;
    this.userPoolId = process.env.COGNITO_USERPOOL_ID!;
  }

  public async signIn(username: string, password: string): Promise<AuthenticationResultType> {
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      const { AuthenticationResult } = await this.cognitoClient.send(command);
      return AuthenticationResult!;
    } catch (error: any) {
      console.error("Error signing in: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async confirmSignUp(username: string, code: string): Promise<void> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
    };
    try {
      const command = new ConfirmSignUpCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error confirming sign up: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async signUp(email: string, password: string): Promise<void> {
    const randomNickname = await getNickname();
    const params = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "nickname",
          Value: randomNickname
        }
      ],
    };
    try {
      const command = new SignUpCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error signing up: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async socialSignUp(email: string, password: string, idp: string): Promise<void> {
    const randomNickname = await getNickname();
    const params = {
      UserPoolId: this.userPoolId,
      Username: email,
      TemporaryPassword: password,
      MessageAction: MessageActionType.SUPPRESS,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "nickname",
          Value: randomNickname
        },
        {
          Name: "email_verified",
          Value: "true"
        },
        {
          Name: "custom:idp",
          Value: idp,
        }
      ],
    };
    try {
      const command = new AdminCreateUserCommand(params);
      await this.cognitoClient.send(command);
      await this.adminSetPassword(email, password)
    } catch (error: any) {
      console.error("Error signing up: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async adminSetPassword(username: string, password: string): Promise<void> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      Password: password,
      Permanent: true
    };
    const command = new AdminSetUserPasswordCommand(params);
    await this.cognitoClient.send(command);
  }

  public async resendConfirmationCode(username: string): Promise<void> {
    const params = {
      ClientId: this.clientId,
      Username: username,
    };
    try {
      const command = new ResendConfirmationCodeCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error resending confirmation code: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async forgotPassword(username: string): Promise<void> {
    const params = {
      ClientId: this.clientId,
      Username: username,
    };
    try {
      const command = new ForgotPasswordCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error sending confirmation code for resetting password: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async confirmForgotPassword(username: string, code: string, newPassword: string): Promise<void> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword
    };
    try {
      const command = new ConfirmForgotPasswordCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error resetting password: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async getUserInfo(accessToken: string) {
    const params = {
      AccessToken: accessToken,
    }
    try {
      const command = new GetUserCommand(params);
      const response = await this.cognitoClient.send(command);
      const username = response.Username!;
      const userinfo = this.adminGetUserInfo(username);
      return userinfo;
    } catch (error: any) {
      console.error("Error getting user infomation: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async adminGetUserInfo(username: string) {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
    }
    try {
      const command = new AdminGetUserCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error: any) {
      console.error("Error getting user information: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async linkProviderForCognitoUser(username: string, sub: string, provider: string) {
    const params = {
      UserPoolId: this.userPoolId,
      DestinationUser: {
        ProviderName: 'Cognito',
        ProviderAttributeName: 'username',
        ProviderAttributeValue: username
      },
      SourceUser: {
        ProviderName: provider,
        ProviderAttributeName: "Cognito_Subject",
        ProviderAttributeValue: sub,
      },
    }
    try {
      const command = new AdminLinkProviderForUserCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error: any) {
      console.error("Error linking Cognito user to IdP: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async updateUserAttributes(userAttributes: userAttribute[], accessToken: string) {
    const params = {
      UserAttributes: userAttributes,
      AccessToken: accessToken,
    };
    try {
      const command = new UpdateUserAttributesCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error: any) {
      console.error("Error updating user attributes: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<AuthenticationResultType> {
    const params = {
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    try {
      const command = new InitiateAuthCommand(params);
      const { AuthenticationResult } = await this.cognitoClient.send(command);
      return AuthenticationResult!;
    } catch (error: any) {
      console.error("Error refreshing access token: ", error);
      throw new AuthError(error.name, error.message);
    }
  }

  public async revokeRefreshToken(accessToken: string) {
    const params = {
      AccessToken: accessToken,
    }
    try {
      const command = new GlobalSignOutCommand(params);
      await this.cognitoClient.send(command);
    } catch (error: any) {
      console.error("Error globally signing out the user: ", error);
      throw new AuthError(error.name, error.message);
    }
  }
}

const authService = new AuthService();
export default authService;