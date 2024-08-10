import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export function setSessionId(sessionId: string) {
  cookies().set({
    name: 'sessionId',
    value: sessionId,
    // httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })
}
export function getSessionId(): string | undefined {
  return cookies().get('sessionId')?.value;
}

export function generateNewSessionId(): string {
  return uuidv4();
}

export function deleteSessionId() {
  setSessionId('');
}