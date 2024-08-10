# Next.js User Authentication with AWS Cognito and Redis
This repository contains a boilerplate project for implementing user authentication and session management using Next.js, AWS Cognito, and Redis. This setup provides a robust solution for managing user login, logout, and session handling, making it ideal for web applications that require secure user management.

# Features
- User Authentication with AWS Cognito: Securely handle user sign-up, sign-in, and token management.
- Session Management with Redis: Efficiently store and manage user sessions, including token expiration checks.
- Protected Routes: Middleware protection for routes that require authentication.
- Token Refresh: Automatic handling of access token refresh using the refresh token stored in Redis.
- Responsive UI: Built with React and Next.js, ensuring a seamless user experience across devices.

# Getting Started

## Prerequisites
- Node.js
- AWS Account: Set up an AWS Cognito User Pool and obtain the necessary credentials.
- Redis Instance

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hkim-dev/nextjs-user-auth.git
cd nextjs-user-auth
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a .env.local file in the root directory and add the following variables:
```
AWS_REGION=<< value >>
COGNITO_USERPOOL_ID=<< value >>
COGNITO_CLIENT_ID=<< value >>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<< value >>
REDIS_HOST=<< value >>
REDIS_PASSWORD=<< value >>
REDIS_PORT=<< value >>
```
Replace the placeholders with actual values.

### 4. Run the development server

```bash
npm run dev
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

# Usage
- User Login: Users can sign in using credentials managed by AWS Cognito.
- Session Handling: Sessions are stored in Redis and checked for validity on each request.
- Route Protection: Middleware ensures that only authenticated users can access protected routes like /account.