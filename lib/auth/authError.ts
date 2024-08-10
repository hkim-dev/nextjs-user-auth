export class AuthError extends Error {
  public name: string;
  public message: string;
  private messages: { [key: string]: string };

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
    this.messages = {
      'InternalErrorException': 'An internal error occurred during authentication. Please try again.',
      'TooManyRequestsException': 'You\'ve sent too many requests. Please wait a moment and try again.',
      'UserNotFoundException': 'We could not find an account associated with the provided information. Please check your details or sign up for a new account.',
      'UserNotConfirmedException': 'You\'re not a confirmed user. Please verify your email first.',
      'CodeMismatchException': 'Please enter a valid confirmation code.',
      'ExpiredCodeException': 'The provided code has expired.',
      'CodeDeliveryFailureException': 'Failed to deliver the confirmation code. Please try again.',
      'UsernameExistsException': 'The given email address is already registered. Please sign in.',
      'PasswordResetRequiredException': 'Please reset your password and sign in.',
    }
    if (message && !this.messages.hasOwnProperty(name)) {
      this.message = message;
    } else {
      this.message = this.getMessage();
    }
    // required for custom error classes in TypeScript
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  private getMessage(): string {
    return this.messages[this.name] || 'An unexpected error occurred during authentication. Please try again.';
  }
}